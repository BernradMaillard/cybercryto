# CyberCrypto Security Forum

A comprehensive, secure cybersecurity community platform built with Flask, featuring advanced security measures, modern design, and full functionality for professional discussions, resource sharing, and career development.

![CyberCrypto Security Forum](https://img.shields.io/badge/Security-Premium-brightgreen) ![Flask](https://img.shields.io/badge/Flask-3.0.0-blue) ![Python](https://img.shields.io/badge/Python-3.8+-green)

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization**: Secure registration, login/logout with session management
- **Discussion Forums**: Categorized discussion areas for different cybersecurity topics
- **Resource Center**: Downloadable security guides, tools, and educational materials
- **Events Management**: Cybersecurity events, conferences, and community meetups
- **Career Center**: Job listings, certification guidance, and professional development
- **Member Profiles**: Community member directory and networking features
- **Leaderboard**: Gamification with points system and recognition badges

### Security Features
- **Multi-layered Security**: Comprehensive security implementation following industry best practices
- **Rate Limiting**: Protection against brute force attacks (Flask-Limiter)
- **CSRF Protection**: Cross-Site Request Forgery protection (Flask-WTF)
- **Secure Headers**: HTTPS enforcement and security headers (Flask-Talisman)
- **Account Lockout**: Automatic account lockout after failed login attempts
- **Input Validation**: Server-side and client-side input sanitization
- **Password Security**: Secure password hashing with Werkzeug
- **Session Security**: Secure session management with encrypted cookies
- **Audit Logging**: Comprehensive security event logging
- **Content Security Policy**: XSS protection with CSP headers

### Design & User Experience
- **Dark Theme**: Professional dark theme with cyan accents
- **Responsive Design**: Mobile-first responsive layout
- **Modern UI/UX**: Clean, intuitive interface optimized for cybersecurity professionals
- **Interactive Elements**: Dynamic search, real-time form validation, and smooth animations
- **Accessibility**: WCAG-compliant design with proper semantic markup

## 🏗️ Project Structure

```
CyberCrypto_Security_Forum/
│
├── static/
│   ├── css/
│   │   └── style.css              # Main stylesheet with dark theme
│   └── js/
│       └── script.js              # Interactive JavaScript functionality
│
├── templates/
│   ├── base.html                  # Base template with navigation
│   ├── index.html                 # Homepage with stats and resources
│   ├── discussions.html           # Discussion categories
│   ├── resources.html             # Resource center
│   ├── events.html                # Events listing
│   ├── careers.html               # Career opportunities
│   ├── members.html               # Member directory (login required)
│   ├── leaderboard.html           # Community leaderboard
│   ├── login.html                 # Login form
│   ├── join.html                  # Registration form
│   └── error.html                 # Error pages (404, 500, etc.)
│
├── app.py                         # Main Flask application
├── config.py                      # Security configuration
├── requirements.txt               # Python dependencies
└── README.md                      # Project documentation
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Git (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CyberCrypto_Security_Forum
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv

   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   SECRET_KEY=your-super-secret-key-change-this-in-production
   DATABASE_URL=sqlite:///cybercrypto_forum.db
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

5. **Initialize the database**
   ```bash
   python app.py
   ```
   The application will automatically create the SQLite database and populate it with sample data.

6. **Run the application**
   ```bash
   python app.py
   ```
   The application will be available at `http://localhost:5000`

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@cybercrypto.com`

⚠️ **Important**: Change the default admin password immediately in a production environment.

## 🔧 Configuration

### Security Configuration
All security settings are configured in `config.py`:

- **Session Security**: Secure cookies with HTTPOnly and SameSite protection
- **Rate Limiting**: Configurable rate limits for different endpoints
- **CSRF Protection**: Token-based CSRF protection for all forms
- **Content Security Policy**: Strict CSP headers to prevent XSS attacks
- **Account Lockout**: Configurable failed login attempt limits

### Environment Variables
Key environment variables for production deployment:

```env
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:password@localhost/cybercrypto_forum
FLASK_ENV=production
FLASK_DEBUG=False
FORCE_HTTPS=True
```

## 🛡️ Security Features

### Authentication & Authorization
- Secure user registration with email validation
- Password strength requirements and hashing
- Session-based authentication with Flask-Login
- Role-based access control (admin/user roles)
- Account lockout after failed login attempts

### Input Validation & Sanitization
- Server-side form validation with WTForms
- Real-time client-side validation
- SQL injection prevention with parameterized queries
- XSS protection through output escaping

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- Referrer Policy

### Monitoring & Logging
- Comprehensive security event logging
- Failed login attempt tracking
- Rate limiting monitoring
- Error logging with secure information disclosure

## 🎨 UI/UX Features

### Dark Theme Design
- Professional dark color scheme optimized for cybersecurity professionals
- Cyan accent colors for highlighting important elements
- High contrast ratios for accessibility
- Consistent typography and spacing

### Interactive Elements
- Real-time search functionality
- Dynamic form validation with visual feedback
- Smooth animations and transitions
- Loading states for better user experience

### Responsive Design
- Mobile-first approach
- Optimized for tablets and desktop
- Flexible grid layouts
- Touch-friendly navigation

## 📊 Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: User email address
- `password_hash`: Hashed password
- `is_admin`: Admin role flag
- `failed_login_attempts`: Failed login counter
- `locked_until`: Account lockout timestamp
- `created_at`: Account creation date

### Categories Table
- `id`: Primary key
- `name`: Category name
- `description`: Category description
- `post_count`: Number of posts in category
- `is_active`: Category status

### Posts Table
- `id`: Primary key
- `title`: Post title
- `content`: Post content
- `category_id`: Foreign key to categories
- `user_id`: Foreign key to users
- `created_at`: Post creation date

## 🔌 API Endpoints

### Public Endpoints
- `GET /`: Homepage
- `GET /discussions`: Discussion categories
- `GET /resources`: Resource center
- `GET /events`: Events listing
- `GET /careers`: Career opportunities
- `GET /leaderboard`: Community leaderboard
- `GET /login`: Login page
- `POST /login`: User authentication
- `GET /join`: Registration page
- `POST /join`: User registration

### Protected Endpoints
- `GET /members`: Member directory (login required)
- `GET /logout`: User logout

### API Endpoints
- `GET /api/stats`: Community statistics
- `GET /api/search`: Search functionality

## 🧪 Testing

### Security Testing
1. **Authentication Testing**
   - Test login/logout functionality
   - Verify account lockout mechanism
   - Test password strength requirements

2. **Authorization Testing**
   - Verify role-based access control
   - Test protected route access

3. **Input Validation Testing**
   - Test form validation
   - Verify XSS protection
   - Test SQL injection prevention

4. **Rate Limiting Testing**
   - Test API rate limits
   - Verify login attempt limits

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Navigation between all pages
- [ ] Search functionality
- [ ] Form submissions and validation
- [ ] Mobile responsiveness
- [ ] Error handling (404, 500, etc.)

## 🚀 Production Deployment

### Prerequisites for Production
1. **Database**: PostgreSQL or MySQL (recommended over SQLite)
2. **Web Server**: Nginx or Apache
3. **WSGI Server**: Gunicorn or uWSGI
4. **SSL Certificate**: For HTTPS encryption
5. **Environment Variables**: Secure configuration

### Deployment Steps
1. **Update Configuration**
   ```python
   # In config.py, set for production:
   TALISMAN_CONFIG['force_https'] = True
   SESSION_COOKIE_SECURE = True
   WTF_CSRF_ENABLED = True
   ```

2. **Database Migration**
   - Set up PostgreSQL database
   - Update DATABASE_URL in environment variables
   - Run database initialization

3. **Web Server Configuration**
   ```nginx
   # Example Nginx configuration
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. **Process Management**
   ```bash
   # Using Gunicorn
   gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
   ```

## 📚 Dependencies

### Core Dependencies
- **Flask 3.0.0**: Web framework
- **Flask-Login 0.6.3**: User session management
- **Flask-WTF 1.2.1**: Form handling and CSRF protection
- **Flask-Limiter 3.5.0**: Rate limiting
- **Flask-Talisman 1.1.0**: Security headers and HTTPS enforcement
- **Werkzeug 3.0.1**: Password hashing and utilities
- **WTForms 3.1.1**: Form validation
- **SQLAlchemy 2.0.23**: Database ORM
- **cryptography 41.0.8**: Encryption utilities

### Development Dependencies
- **python-dotenv**: Environment variable management
- **email-validator**: Email validation
- **bcrypt**: Password hashing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

### Code Style Guidelines
- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Write docstrings for functions and classes
- Maintain consistent indentation and formatting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔒 Security Disclosure

If you discover a security vulnerability, please email security@cybercrypto.com instead of using the issue tracker. We take security seriously and will respond promptly to security reports.

## 📞 Support

For support and questions:
- Email: support@cybercrypto.com
- Create an issue on GitHub
- Join our community discussions

## 🙏 Acknowledgments

- Flask community for excellent documentation and examples
- OWASP for security best practices
- The cybersecurity community for inspiration and feedback

---

**Built with ❤️ for the cybersecurity community**
