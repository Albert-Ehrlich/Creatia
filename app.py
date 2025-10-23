from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Needed for sessions


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # ⚠️ This is just temporary — you’ll replace it with a real database check later.
        if username == 'admin' and password == '1234':
            session['role'] = 'admin'
            return redirect(url_for('admin_dashboard'))
        else:
            session['role'] = 'user'
            return redirect(url_for('user_dashboard'))
    return render_template('login.html')

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
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)

