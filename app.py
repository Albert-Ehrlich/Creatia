import os
import logging
from datetime import datetime, date, timedelta
from flask import Flask, render_template, redirect, url_for, flash, request, session, jsonify, send_from_directory, abort
from sqlalchemy import or_, and_
from flask_wtf.csrf import CSRFProtect
from forms import LoginForm, RegisterForm
from models import db, User, Task, TaskAttachment, Mail
from werkzeug.utils import secure_filename
from authlib.integrations.flask_client import OAuth


# Single application instance and configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
app.secret_key = app.config['SECRET_KEY']

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'creatia.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# Extend or disable CSRF token expiry to avoid "token expired" on logins
app.config['WTF_CSRF_TIME_LIMIT'] = None

# Initialize database and CSRF protection
db.init_app(app)
csrf = CSRFProtect(app)

# Configure OAuth (Google)
oauth = OAuth(app)
google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
google_client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
if google_client_id and google_client_secret:
    oauth.register(
        name='google',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_id=google_client_id,
        client_secret=google_client_secret,
        client_kwargs={'scope': 'openid email profile'},
    )

# Configure logging to help debug server errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Create database tables and ensure schema compatibility
with app.app_context():
    db.create_all()
    # Ensure newer columns exist when running on an older SQLite file (lightweight migration)
    try:
        result = db.session.execute(db.text("PRAGMA table_info(tasks)")).fetchall()
        cols = {row[1] for row in result}
        if "description" not in cols:
            db.session.execute(db.text("ALTER TABLE tasks ADD COLUMN description TEXT"))
        if "view_status" not in cols:
            db.session.execute(db.text("ALTER TABLE tasks ADD COLUMN view_status TEXT DEFAULT 'send'"))
        if "viewed_at" not in cols:
            db.session.execute(db.text("ALTER TABLE tasks ADD COLUMN viewed_at DATETIME"))
        if "approved_at" not in cols:
            db.session.execute(db.text("ALTER TABLE tasks ADD COLUMN approved_at DATETIME"))
        # Mail table migrations
        result_mail = db.session.execute(db.text("PRAGMA table_info(mails)")).fetchall()
        mail_cols = {row[1] for row in result_mail}
        if "is_draft" not in mail_cols:
            db.session.execute(db.text("ALTER TABLE mails ADD COLUMN is_draft BOOLEAN DEFAULT 0"))
        if "deleted_at" not in mail_cols:
            db.session.execute(db.text("ALTER TABLE mails ADD COLUMN deleted_at DATETIME"))
        if "is_saved" not in mail_cols:
            db.session.execute(db.text("ALTER TABLE mails ADD COLUMN is_saved BOOLEAN DEFAULT 0"))
        db.session.commit()
    except Exception:
        logger.exception("Schema check failed while ensuring tasks table columns")


def current_user():
    uid = session.get('user_id')
    if not uid:
        return None
    return User.query.get(uid)


def unread_mail_count(user_id):
    now = datetime.utcnow()
    # purge trash older than 20 days
    threshold = now - timedelta(days=20)
    Mail.query.filter(Mail.deleted_at.isnot(None), Mail.deleted_at < threshold).delete()
    db.session.commit()
    return Mail.query.filter_by(recipient_id=user_id, is_read=False, deleted_at=None, is_draft=False).count()


def send_mail(subject, body, recipient_id, sender_id=None):
    msg = Mail(subject=subject, body=body, recipient_id=recipient_id, sender_id=sender_id, is_draft=False)
    db.session.add(msg)
    db.session.commit()
    return msg


def require_login():
    user = current_user()
    if not user:
        abort(401)
    return user


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    error = None
    try:
        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data

            # Query user from database
            user = User.query.filter_by(username=username).first()

            if not user or not user.check_password(password):
                error = 'Invalid username or password'
            elif not user.is_active:
                error = 'Account is inactive'
            else:
                # Update last login and set session
                user.update_last_login()
                session['user_id'] = user.id
                session['username'] = user.username
                session['role'] = user.role

                if user.role == 'admin':
                    return redirect(url_for('admin_dashboard'))
                if user.role == 'supervisor':
                    return redirect(url_for('supervisor_dashboard'))
                return redirect(url_for('researcher_dashboard'))
        elif request.method == 'POST':
            error = 'Please fill in both fields.'

        return render_template('login.html', form=form, error=error)
    except Exception:
        logger.exception('Exception in /login handler')
        raise


@app.route('/login/google')
def login_google():
    """Start Google OAuth flow."""
    if not (google_client_id and google_client_secret):
        flash('Google OAuth not configured.', 'danger')
        return redirect(url_for('login'))
    redirect_uri = url_for('auth_google', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@app.route('/auth/google')
def auth_google():
    """Handle response from Google and sign the user in/up."""
    try:
        token = oauth.google.authorize_access_token()
        userinfo = oauth.google.parse_id_token(token)
    except Exception:
        logger.exception('Google OAuth failed')
        flash('Google login failed. Try again.', 'danger')
        return redirect(url_for('login'))

    email = userinfo.get('email')
    name = userinfo.get('name') or (email.split('@')[0] if email else None)

    if not email:
        flash('Could not obtain email from Google account.', 'danger')
        return redirect(url_for('login'))

    # Find existing user by email, otherwise create one
    user = User.query.filter_by(email=email).first()
    if not user:
        # create a user with a random password (OAuth users don't use it)
        user = User(username=name or email.split('@')[0], email=email, role='user')
        # set a random password
        user.set_password(os.urandom(16).hex())
        db.session.add(user)
        db.session.commit()

    # finalize login
    user.update_last_login()
    session['user_id'] = user.id
    session['username'] = user.username
    session['role'] = user.role
    flash(f'Logged in as {user.username} via Google', 'success')
    return redirect(url_for('user_dashboard'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    error = None
    try:
        if form.validate_on_submit():
            username = form.username.data
            email = form.email.data
            password = form.password.data

            # Check if user already exists
            if User.query.filter_by(username=username).first():
                error = 'Username already exists'
            elif User.query.filter_by(email=email).first():
                error = 'Email already registered'
            else:
                # Create new user
                user = User(username=username, email=email, role='user')
                user.set_password(password)
                db.session.add(user)
                db.session.commit()

                flash('Account created successfully! Please log in.', 'success')
                return redirect(url_for('login'))
        elif request.method == 'POST':
            error = 'Please fill in all fields correctly.'

        return render_template('register.html', form=form, error=error)
    except Exception:
        logger.exception('Exception in /register handler')
        raise


@app.route('/admin')
def admin_dashboard():
    if not session.get('user_id') or session.get('role') != 'admin':
        return redirect(url_for('login'))

    user = User.query.get(session.get('user_id'))
    all_users = User.query.order_by(User.username).all()
    assignee_list = [{'id': u.id, 'username': u.username} for u in all_users]
    return render_template(
        'admin_dashboard.html',
        user=user,
        users=all_users,
        assignees_json=assignee_list,
        unread_mails=unread_mail_count(user.id),
    )


@app.route('/rsch')
def researcher_dashboard():
    if not session.get('user_id'):
        return redirect(url_for('login'))

    user = User.query.get(session.get('user_id'))
    if not user or not user.is_active:
        session.clear()
        return redirect(url_for('login'))

    return render_template('researcher_dashboard.html', user=user, unread_mails=unread_mail_count(user.id))


@app.route('/supv')
def supervisor_dashboard():
    if not session.get('user_id') or session.get('role') != 'supervisor':
        return redirect(url_for('login'))

    user = User.query.get(session.get('user_id'))
    if not user or not user.is_active:
        session.clear()
        return redirect(url_for('login'))

    return render_template('supervisor_dashboard.html', user=user, unread_mails=unread_mail_count(user.id))


@app.route('/logout')
def logout():
    username = session.get('username', 'User')
    session.clear()
    flash(f'Goodbye, {username}!', 'info')
    return redirect(url_for('home'))


@app.route('/mails')
def mails():
    user = require_login()
    users = User.query.order_by(User.username).all()
    return render_template('mails.html', user=user, unread_mails=unread_mail_count(user.id), users=users)


@csrf.exempt
@app.route('/api/mails/unread_count')
def api_unread_mails():
    user = require_login()
    return jsonify({'count': unread_mail_count(user.id)})


@csrf.exempt
@app.route('/api/mails', methods=['GET', 'POST'])
def api_mails():
    user = require_login()
    if request.method == 'POST':
        data = request.get_json() or {}
        subject = (data.get('subject') or '').strip() or 'No subject'
        body = (data.get('body') or '').strip() or ''
        recipient_id = data.get('recipient_id')
        is_draft = bool(data.get('is_draft'))
        if not recipient_id and not is_draft:
            return jsonify({'error': 'Recipient required'}), 400
        msg = Mail(
            subject=subject,
            body=body,
            sender_id=user.id,
            recipient_id=recipient_id or user.id,
            is_draft=is_draft,
            is_read=is_draft,
        )
        db.session.add(msg)
        db.session.commit()
        return jsonify(msg.to_dict()), 201

    folder = request.args.get('folder', 'inbox')
    base = Mail.query.filter(Mail.deleted_at.is_(None))
    if folder == 'inbox':
        query = base.filter_by(recipient_id=user.id, is_draft=False, is_saved=False)
    elif folder == 'sent':
        query = base.filter_by(sender_id=user.id, is_draft=False)
    elif folder == 'draft':
        query = base.filter_by(sender_id=user.id, is_draft=True)
    elif folder == 'trash':
        query = Mail.query.filter(Mail.deleted_at.isnot(None)).filter(
            (Mail.recipient_id == user.id) | (Mail.sender_id == user.id)
        )
    elif folder == 'saved':
        query = base.filter_by(recipient_id=user.id, is_draft=False, is_saved=True)
    else:
        return jsonify({'error': 'Invalid folder'}), 400
    mails = query.order_by(Mail.created_at.desc()).all()
    return jsonify([m.to_dict() for m in mails])


@csrf.exempt
@app.route('/api/mails/<int:mail_id>/read', methods=['POST'])
def api_mail_read(mail_id):
    user = require_login()
    mail = Mail.query.get_or_404(mail_id)
    if mail.recipient_id != user.id and mail.sender_id != user.id:
        return jsonify({'error': 'Not allowed'}), 403
    mail.is_read = True
    db.session.commit()
    return jsonify({'ok': True})


@csrf.exempt
@app.route('/api/mails/bulk', methods=['POST'])
def api_mail_bulk():
    user = require_login()
    data = request.get_json() or {}
    ids = data.get('ids') or []
    action = data.get('action')
    if not ids or action not in ('read', 'delete', 'restore', 'purge', 'move'):
        return jsonify({'error': 'Invalid request'}), 400
    q = Mail.query.filter(Mail.id.in_(ids)).filter(
        (Mail.recipient_id == user.id) | (Mail.sender_id == user.id)
    )
    now = datetime.utcnow()
    if action == 'purge':
        q.delete(synchronize_session=False)
    elif action == 'move':
        target = data.get('target')
        for mail in q:
            if target == 'trash':
                mail.deleted_at = now
                mail.is_saved = False
            elif target == 'inbox':
                mail.deleted_at = None
                mail.is_saved = False
            elif target == 'saved':
                mail.deleted_at = None
                mail.is_saved = True
    else:
        for mail in q:
            if action == 'read':
                mail.is_read = True
            elif action == 'delete':
                mail.deleted_at = now
            elif action == 'restore':
                mail.deleted_at = None
    db.session.commit()
    return jsonify({'ok': True})


def task_to_dict(task):
    data = task.to_dict()
    data['attachments'] = [
        {
          **att.to_dict(),
          'url': url_for('uploaded_file', filename=att.stored_path, _external=False),
        } for att in task.attachments
    ]
    data['approval_pending'] = task.view_status == 'awaiting_admin'
    data['created_by_admin'] = bool(task.created_by and task.created_by.role == 'admin')
    data['approved_at'] = task.approved_at.isoformat() if task.approved_at else None
    return data


@csrf.exempt
@app.route('/api/tasks', methods=['GET'])
def api_tasks_list():
    user = require_login()
    self_created_researcher = and_(
        Task.created_by_id.isnot(None),
        Task.created_by_id == Task.assigned_to_id,
        Task.assigned_to.has(User.role == 'user'),
    )
    if user.role == 'admin' and request.args.get('all') == '1':
        query = Task.query.filter(~self_created_researcher)
    else:
        if user.role == 'supervisor':
            # supervisors see only tasks assigned to themselves
            query = Task.query.filter(Task.assigned_to_id == user.id)
        else:
            # researchers/non-admin users see only tasks assigned to themselves and not to supervisors/admins
            query = Task.query.filter(
                Task.assigned_to_id == user.id,
                Task.assigned_to.has(User.role != 'supervisor'),
            )
    tasks = query.order_by(Task.due_date.asc(), Task.id.asc()).all()
    return jsonify([task_to_dict(t) for t in tasks])


@csrf.exempt
@app.route('/api/tasks', methods=['POST'])
def api_tasks_create():
    user = require_login()
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    description = (data.get('description') or '').strip() or None
    due_date_raw = data.get('due_date')
    assigned_raw = data.get('assigned_to_id')
    try:
        assigned_to_id = int(assigned_raw) if assigned_raw not in (None, "", 0) else int(user.id)
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid assignee id.'}), 400

    if not title or not due_date_raw:
        return jsonify({'error': 'Title and due date are required.'}), 400

    # Role-based assignment rules
    assignee = User.query.get(assigned_to_id)
    if not assignee:
        return jsonify({'error': 'Assignee not found.'}), 404

    if user.role == 'admin':
        if assignee.role not in ('admin', 'user', 'supervisor'):
            return jsonify({'error': 'Admins may assign only to admins, supervisors, or non-admin users.'}), 403
    else:
        # Non-admin and supervisors may only assign to themselves (default already self)
        if assigned_to_id != user.id:
            return jsonify({'error': 'You can only assign tasks to yourself.'}), 403
        assignee = user

    try:
        due_dt = datetime.fromisoformat(due_date_raw).date()
    except Exception:
        return jsonify({'error': 'Invalid due date format. Use YYYY-MM-DD.'}), 400

    task = Task(
        title=title,
        description=description,
        due_date=due_dt,
        assigned_to=assignee,
        created_by=user,
        admin_locked=user.role == 'admin'
    )
    db.session.add(task)
    db.session.commit()
    if user.role == 'admin' and assignee and assignee.id != user.id:
        send_mail(
            subject="New task assigned",
            body="یک مسئولیت جدید توسط مدیر پروژه برای شما ثبت شده است",
            recipient_id=assignee.id,
            sender_id=user.id,
        )
    return jsonify(task_to_dict(task)), 201


@csrf.exempt
@app.route('/api/tasks/<int:task_id>/status', methods=['POST'])
def api_tasks_status(task_id):
    user = require_login()
    task = Task.query.get_or_404(task_id)
    if task.assigned_to_id != user.id and user.role != 'admin':
        return jsonify({'error': 'Not allowed.'}), 403
    data = request.get_json() or {}
    new_status = data.get('status')
    if new_status not in ('pending', 'done'):
        return jsonify({'error': 'Invalid status.'}), 400
    # Non-admin assignees of admin-created tasks must be approved
    requires_admin = task.admin_locked and user.role != 'admin'
    if new_status == 'pending' and requires_admin and task.view_status == 'awaiting_admin':
        # requester cancels the done request
        task.view_status = 'seen'
        task.status = 'pending'
    elif new_status == 'done' and requires_admin:
        task.view_status = 'awaiting_admin'
        task.status = 'pending'
        admins = User.query.filter_by(role='admin').all()
        requester = user.username
        for admin in admins:
            send_mail(
                subject="Task pending approval",
                body=f"The task '{task.title}' of user {requester} is pending your approval.",
                recipient_id=admin.id,
                sender_id=user.id,
            )
    else:
        task.status = new_status
        if new_status == 'done':
            if user.role == 'admin':
                task.view_status = 'approved'
                task.approved_at = datetime.utcnow()
                if task.assigned_to:
                    send_mail(
                        subject="Task approved",
                        body=f"Your task '{task.title}' has been approved.",
                        recipient_id=task.assigned_to.id,
                        sender_id=user.id,
                    )
            else:
                task.view_status = task.view_status
        elif new_status == 'pending':
            task.view_status = 'seen'
        if task.view_status != 'seen' and task.assigned_to_id == user.id:
            task.view_status = 'seen'
            task.viewed_at = datetime.utcnow()
    db.session.commit()
    return jsonify(task_to_dict(task))


@csrf.exempt
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def api_tasks_delete(task_id):
    user = require_login()
    task = Task.query.get_or_404(task_id)
    # admins can delete any task; others only their own self-created/self-assigned tasks
    if user.role != 'admin':
        same_actor = task.created_by_id and task.created_by_id == task.assigned_to_id == user.id
        if not same_actor:
            return jsonify({'error': 'Not allowed to delete this task.'}), 403
    # Remove attachments first to avoid FK issues
    for att in list(task.attachments):
        db.session.delete(att)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'ok': True})


@csrf.exempt
@app.route('/api/tasks/<int:task_id>/due', methods=['POST'])
def api_tasks_update_due(task_id):
    user = require_login()
    task = Task.query.get_or_404(task_id)
    data = request.get_json() or {}
    due_date_raw = data.get('due_date')
    if not due_date_raw:
        return jsonify({'error': 'New due date is required.'}), 400
    # Only allow creator/assignee same user to change their own task
    same_actor = task.created_by_id and task.created_by_id == task.assigned_to_id == user.id
    if not same_actor:
        return jsonify({'error': 'Not allowed to change this due date.'}), 403
    try:
        due_dt = datetime.fromisoformat(due_date_raw).date()
    except Exception:
        return jsonify({'error': 'Invalid due date format. Use YYYY-MM-DD.'}), 400
    task.due_date = due_dt
    db.session.commit()
    return jsonify(task_to_dict(task))


@csrf.exempt
@app.route('/api/tasks/<int:task_id>/edit', methods=['POST'])
def api_tasks_edit(task_id):
    user = require_login()
    task = Task.query.get_or_404(task_id)
    # Admin can edit any task; others only their own self-created/self-assigned tasks
    if user.role != 'admin':
        same_actor = task.created_by_id == task.assigned_to_id == user.id
        if not same_actor:
            return jsonify({'error': 'Not allowed to edit this task.'}), 403
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    description = (data.get('description') or '').strip() or None
    due_date_raw = data.get('due_date')
    if title:
        task.title = title
    task.description = description
    if due_date_raw:
        try:
            task.due_date = datetime.fromisoformat(due_date_raw).date()
        except Exception:
            return jsonify({'error': 'Invalid due date format. Use YYYY-MM-DD.'}), 400
    db.session.commit()
    return jsonify(task_to_dict(task))


@csrf.exempt
@app.route('/api/tasks/<int:task_id>/seen', methods=['POST'])
def api_tasks_seen(task_id):
    user = require_login()
    task = Task.query.get_or_404(task_id)
    if task.assigned_to_id != user.id and user.role != 'admin':
        return jsonify({'error': 'Not allowed.'}), 403
    task.view_status = 'seen'
    task.viewed_at = datetime.utcnow()
    db.session.commit()
    return jsonify(task_to_dict(task))


@csrf.exempt
@app.route('/api/tasks/<int:task_id>/attach', methods=['POST'])
def api_tasks_attach(task_id):
    user = require_login()
    task = Task.query.get_or_404(task_id)
    if task.assigned_to_id != user.id and user.role != 'admin':
        return jsonify({'error': 'Not allowed.'}), 403
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded.'}), 400
    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({'error': 'Invalid file.'}), 400
    safe_name = secure_filename(file.filename)
    stored_path = f"{task_id}_{int(datetime.utcnow().timestamp())}_{safe_name}"
    full_path = os.path.join(app.config['UPLOAD_FOLDER'], stored_path)
    file.save(full_path)
    attachment = TaskAttachment(task=task, filename=safe_name, stored_path=stored_path, uploaded_by=user)
    db.session.add(attachment)
    db.session.commit()
    return jsonify(task_to_dict(task))


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
