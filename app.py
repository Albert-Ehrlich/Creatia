import os
import logging
from flask import Flask, render_template, redirect, url_for, flash, request, session
from flask_wtf.csrf import CSRFProtect
from forms import LoginForm


# Single application instance and configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
app.secret_key = app.config['SECRET_KEY']

# Initialize CSRF protection
csrf = CSRFProtect(app)

# Configure logging to help debug server errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def validate_user(username, password):
    """Placeholder user validation.

    - admin / 1234 -> 'admin'
    - any non-empty username/password -> 'user'
    - otherwise -> None
    """
    if username == 'admin' and password == '1234':
        return 'admin'
    if username and password:
        return 'user'
    return None


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
            role = validate_user(username, password)
            if not role:
                error = 'Invalid username or password'
            else:
                session['role'] = role
                flash('Logged in successfully', 'success')
                if role == 'admin':
                    return redirect(url_for('admin_dashboard'))
                return redirect(url_for('user_dashboard'))
        elif request.method == 'POST':
            error = 'Please fill in both fields.'

        return render_template('login.html', form=form, error=error)
    except Exception:
        logger.exception('Exception in /login handler')
        raise


@app.route('/admin')
def admin_dashboard():
    if session.get('role') != 'admin':
        return redirect(url_for('login'))
    return render_template('admin_dashboard.html')


@app.route('/dashboard')
def user_dashboard():
    if session.get('role') != 'user':
        return redirect(url_for('login'))
    return render_template('user_dashboard.html')


@app.route('/logout')
def logout():
    session.pop('role', None)
    flash('Logged out', 'info')
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)

