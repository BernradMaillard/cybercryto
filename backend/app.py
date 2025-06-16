from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm, CSRFProtect
from flask_wtf.csrf import validate_csrf
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from wtforms import StringField, PasswordField, EmailField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import TooManyRequests
from datetime import datetime, timedelta
import logging
import os
import sqlite3
from config import Config
import secrets

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize security extensions
csrf = CSRFProtect(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.login_message_category = 'warning'

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

# Initialize Talisman for HTTPS and security headers
talisman = Talisman(app, **app.config['TALISMAN_CONFIG'])

# Setup secure logging
logging.basicConfig(
    filename=app.config['LOG_FILE'],
    level=getattr(logging, app.config['LOG_LEVEL']),
    format='%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
)

# User model
class User(UserMixin):
    def __init__(self, id, username, email, password_hash, is_admin=False):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.is_admin = is_admin
        self.failed_login_attempts = 0
        self.locked_until = None

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_locked(self):
        if self.locked_until and datetime.utcnow() < self.locked_until:
            return True
        return False

# Database helper functions
def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect('cybercrypto_forum.db')
    cursor = conn.cursor()

    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            failed_login_attempts INTEGER DEFAULT 0,
            locked_until TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create discussion categories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            post_count INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE
        )
    ''')

    # Create posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category_id INTEGER,
            user_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Insert default categories
    categories = [
        ('Threat Analysis', 'Latest threats, malware analysis, and security incidents'),
        ('Cryptography', 'Encryption algorithms, protocols, and implementation'),
        ('Career Guidance', 'Certifications, job opportunities, and career paths'),
        ('Tools & Scripts', 'Security tools, scripts, and automation'),
        ('Learning Resources', 'Tutorials, courses, and educational materials'),
        ('General Security', 'Best practices, policies, and general discussions')
    ]

    cursor.executemany('''
        INSERT OR IGNORE INTO categories (name, description, post_count)
        VALUES (?, ?, ?)
    ''', [(name, desc, secrets.randbelow(1000) + 400) for name, desc in categories])

    # Create default admin user
    admin_password_hash = generate_password_hash('admin123')
    cursor.execute('''
        INSERT OR IGNORE INTO users (username, email, password_hash, is_admin)
        VALUES (?, ?, ?, ?)
    ''', ('admin', 'admin@cybercrypto.com', admin_password_hash, True))

    conn.commit()
    conn.close()

def get_user_by_id(user_id):
    """Get user by ID"""
    conn = sqlite3.connect('cybercrypto_forum.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user_data = cursor.fetchone()
    conn.close()

    if user_data:
        return User(user_data[0], user_data[1], user_data[2], user_data[3], user_data[4])
    return None

def get_user_by_username(username):
    """Get user by username"""
    conn = sqlite3.connect('cybercrypto_forum.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user_data = cursor.fetchone()
    conn.close()

    if user_data:
        user = User(user_data[0], user_data[1], user_data[2], user_data[3], user_data[4])
        user.failed_login_attempts = user_data[5]
        if user_data[6]:
            user.locked_until = datetime.fromisoformat(user_data[6])
        return user
    return None

@login_manager.user_loader
def load_user(user_id):
    return get_user_by_id(int(user_id))

# Forms
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    password2 = PasswordField('Confirm Password',
                              validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Join Forum')

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    app.logger.warning(f'404 error: {request.url}')
    return render_template('error.html', error_code=404,
                         error_message='Page not found'), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f'500 error: {error}')
    return render_template('error.html', error_code=500,
                         error_message='Internal server error'), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    app.logger.warning(f'Rate limit exceeded: {get_remote_address()}')
    return render_template('error.html', error_code=429,
                         error_message='Too many requests. Please try again later.'), 429

# Routes
@app.route('/')
def index():
    """Homepage with community stats and resources"""
    # Mock community stats (in production, these would come from the database)
    stats = {
        'members': 12847,
        'discussions': 4923,
        'daily_views': 28391,
        'active_today': 2156
    }

    # Mock resource data
    resources = [
        {'name': 'NIST Cybersecurity Framework', 'type': 'Guide', 'downloads': 2300},
        {'name': 'OWASP Top 10 2024', 'type': 'Report', 'downloads': 1800},
        {'name': 'Cryptography Handbook', 'type': 'eBook', 'downloads': 1200},
        {'name': 'Security Tools Catalog', 'type': 'Database', 'downloads': 945}
    ]

    return render_template('index.html', stats=stats, resources=resources)

@app.route('/discussions')
def discussions():
    """Discussions page with categories"""
    conn = sqlite3.connect('cybercrypto_forum.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM categories WHERE is_active = 1')
    categories = cursor.fetchall()
    conn.close()

    return render_template('discussions.html', categories=categories)

@app.route('/resources')
def resources():
    """Resources page"""
    # Mock resources data
    resources = [
        {
            'title': 'NIST Cybersecurity Framework',
            'description': 'Comprehensive framework for improving cybersecurity posture',
            'type': 'Guide',
            'downloads': 2300,
            'file_size': '2.1 MB'
        },
        {
            'title': 'OWASP Top 10 2024',
            'description': 'Latest web application security risks',
            'type': 'Report',
            'downloads': 1800,
            'file_size': '1.8 MB'
        },
        {
            'title': 'Cryptography Handbook',
            'description': 'Complete guide to modern cryptographic techniques',
            'type': 'eBook',
            'downloads': 1200,
            'file_size': '5.4 MB'
        },
        {
            'title': 'Security Tools Catalog',
            'description': 'Comprehensive database of cybersecurity tools',
            'type': 'Database',
            'downloads': 945,
            'file_size': '3.2 MB'
        }
    ]

    return render_template('resources.html', resources=resources)

@app.route('/events')
def events():
    """Events page"""
    return render_template('events.html')

@app.route('/careers')
def careers():
    """Careers page"""
    return render_template('careers.html')

@app.route('/members')
@login_required
def members():
    """Members page (requires login)"""
    return render_template('members.html')

@app.route('/leaderboard')
def leaderboard():
    """Leaderboard page"""
    return render_template('leaderboard.html')

@app.route('/login', methods=['GET', 'POST'])
@limiter.limit("5 per minute")
def login():
    """Login page with rate limiting and account lockout"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    form = LoginForm()
    if form.validate_on_submit():
        user = get_user_by_username(form.username.data)

        if user and not user.is_locked():
            if user.check_password(form.password.data):
                # Reset failed attempts on successful login
                conn = sqlite3.connect('cybercrypto_forum.db')
                cursor = conn.cursor()
                cursor.execute('''
                    UPDATE users SET failed_login_attempts = 0, locked_until = NULL
                    WHERE username = ?
                ''', (user.username,))
                conn.commit()
                conn.close()

                login_user(user, remember=False)
                app.logger.info(f'Successful login: {user.username}')

                next_page = request.args.get('next')
                if not next_page or not next_page.startswith('/'):
                    next_page = url_for('index')
                return redirect(next_page)
            else:
                # Increment failed login attempts
                user.failed_login_attempts += 1

                conn = sqlite3.connect('cybercrypto_forum.db')
                cursor = conn.cursor()

                if user.failed_login_attempts >= app.config['MAX_LOGIN_ATTEMPTS']:
                    # Lock the account
                    locked_until = datetime.utcnow() + app.config['LOCKOUT_DURATION']
                    cursor.execute('''
                        UPDATE users SET failed_login_attempts = ?, locked_until = ?
                        WHERE username = ?
                    ''', (user.failed_login_attempts, locked_until.isoformat(), user.username))
                    flash(f'Account locked for {app.config["LOCKOUT_DURATION"].total_seconds()/60} minutes due to too many failed attempts.', 'error')
                    app.logger.warning(f'Account locked: {user.username}')
                else:
                    cursor.execute('''
                        UPDATE users SET failed_login_attempts = ?
                        WHERE username = ?
                    ''', (user.failed_login_attempts, user.username))
                    remaining = app.config['MAX_LOGIN_ATTEMPTS'] - user.failed_login_attempts
                    flash(f'Invalid credentials. {remaining} attempts remaining.', 'error')

                conn.commit()
                conn.close()
                app.logger.warning(f'Failed login attempt: {form.username.data}')
        elif user and user.is_locked():
            flash('Account is temporarily locked. Please try again later.', 'error')
        else:
            flash('Invalid username or password.', 'error')
            app.logger.warning(f'Failed login attempt: {form.username.data}')

    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    """Logout user"""
    username = current_user.username
    logout_user()
    app.logger.info(f'User logged out: {username}')
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('index'))

@app.route('/join', methods=['GET', 'POST'])
@limiter.limit("3 per minute")
def join():
    """Join forum (registration) page"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    form = RegistrationForm()
    if form.validate_on_submit():
        # Check if username or email already exists
        conn = sqlite3.connect('cybercrypto_forum.db')
        cursor = conn.cursor()
        cursor.execute('SELECT username FROM users WHERE username = ? OR email = ?',
                      (form.username.data, form.email.data))
        if cursor.fetchone():
            flash('Username or email already exists.', 'error')
        else:
            # Create new user
            password_hash = generate_password_hash(form.password.data)
            cursor.execute('''
                INSERT INTO users (username, email, password_hash)
                VALUES (?, ?, ?)
            ''', (form.username.data, form.email.data, password_hash))
            conn.commit()
            flash('Registration successful! Please log in.', 'success')
            app.logger.info(f'New user registered: {form.username.data}')
            return redirect(url_for('login'))

        conn.close()

    return render_template('join.html', form=form)

# API endpoints for dynamic content
@app.route('/api/stats')
def api_stats():
    """API endpoint for community stats"""
    stats = {
        'members': 12847,
        'discussions': 4923,
        'daily_views': 28391,
        'active_today': 2156
    }
    return jsonify(stats)

@app.route('/api/search')
@limiter.limit("10 per minute")
def api_search():
    """API endpoint for search functionality"""
    query = request.args.get('q', '').strip()
    if not query or len(query) < 3:
        return jsonify({'error': 'Query must be at least 3 characters'}), 400

    # Mock search results (in production, this would search the database)
    results = [
        {'title': f'Search result for: {query}', 'category': 'General Security'},
        {'title': f'Another result for: {query}', 'category': 'Threat Analysis'}
    ]

    app.logger.info(f'Search query: {query}')
    return jsonify({'results': results})

if __name__ == '__main__':
    # Initialize database
    init_db()

    # Run the application
    app.run(host='0.0.0.0', port=5000, debug=False)
