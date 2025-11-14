import os
import logging
from flask import Flask, render_template, redirect, url_for, flash, request, session
from flask_wtf.csrf import CSRFProtect
from forms import LoginForm, RegisterForm
from models import db, User


# Single application instance and configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
app.secret_key = app.config['SECRET_KEY']

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'creatia.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and CSRF protection
db.init_app(app)
csrf = CSRFProtect(app)

# Configure logging to help debug server errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Create database tables
with app.app_context():
    db.create_all()


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
                flash(f'Welcome back, {user.username}!', 'success')
                
                if user.role == 'admin':
                    return redirect(url_for('admin_dashboard'))
                return redirect(url_for('user_dashboard'))
        elif request.method == 'POST':
            error = 'Please fill in both fields.'

        return render_template('login.html', form=form, error=error)
    except Exception:
        logger.exception('Exception in /login handler')
        raise


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
    return render_template('admin_dashboard.html', user=user)


@app.route('/dashboard')
def user_dashboard():
    if not session.get('user_id'):
        return redirect(url_for('login'))
    
    user = User.query.get(session.get('user_id'))
    if not user or not user.is_active:
        session.clear()
        return redirect(url_for('login'))
    
    return render_template('user_dashboard.html', user=user)


@app.route('/logout')
def logout():
    username = session.get('username', 'User')
    session.clear()
    flash(f'Goodbye, {username}!', 'info')
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)


