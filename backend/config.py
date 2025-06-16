import os
from datetime import timedelta

class Config:
    # Security Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production-2024'
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600  # 1 hour

    # Session Configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    # Database Configuration (SQLite for demo, use PostgreSQL in production)
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///cybercrypto_forum.db'

    # Rate Limiting Configuration
    RATELIMIT_STORAGE_URL = 'memory://'
    RATELIMIT_DEFAULT = "100 per hour"

    # Flask-Talisman Configuration for HTTPS and CSP
    TALISMAN_CONFIG = {
        'force_https': False,  # Set to True in production
        'content_security_policy': {
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline'",
            'style-src': "'self' 'unsafe-inline'",
            'img-src': "'self' data: https:",
            'font-src': "'self'",
            'connect-src': "'self'",
            'frame-ancestors': "'none'",
            'base-uri': "'self'",
            'form-action': "'self'"
        },
        'strict_transport_security': True,
        'referrer_policy': 'strict-origin-when-cross-origin'
    }

    # Logging Configuration
    LOG_FILE = 'security.log'
    LOG_LEVEL = 'INFO'

    # Account Security
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_DURATION = timedelta(minutes=15)

    # Application Settings
    ITEMS_PER_PAGE = 20
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file upload
