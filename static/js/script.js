// CyberCrypto Security Forum - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSearchFunctionality();
    initFlashMessages();
    initThemeToggle();
    initScrollToTop();
    initFormEnhancements();
    initTooltips();
});

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    let searchTimeout;

    if (!searchInput || !searchBtn) return;

    // Create search results container
    const searchContainer = searchInput.parentElement;
    searchContainer.style.position = 'relative';

    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.style.display = 'none';
    searchContainer.appendChild(resultsContainer);

    // Search input handler
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();

        clearTimeout(searchTimeout);

        if (query.length < 3) {
            hideSearchResults();
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Search button handler
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query.length >= 3) {
            performSearch(query);
        }
    });

    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            hideSearchResults();
        }
    });

    // Perform search API call
    function performSearch(query) {
        searchBtn.innerHTML = '<span class="loading"></span>';

        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                searchBtn.innerHTML = '🔍';
                displaySearchResults(data.results || []);
            })
            .catch(error => {
                console.error('Search error:', error);
                searchBtn.innerHTML = '🔍';
                hideSearchResults();
            });
    }

    // Display search results
    function displaySearchResults(results) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">No results found</div>';
        } else {
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <div class="search-result-title">${escapeHtml(result.title)}</div>
                    <div class="search-result-category">${escapeHtml(result.category)}</div>
                </div>
            `).join('');
        }
        resultsContainer.style.display = 'block';
    }

    // Hide search results
    function hideSearchResults() {
        resultsContainer.style.display = 'none';
    }
}

// Flash messages functionality
function initFlashMessages() {
    const alerts = document.querySelectorAll('.alert');

    alerts.forEach(alert => {
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                alert.style.opacity = '0';
                alert.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            });
        }

        // Auto-hide success messages after 5 seconds
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.style.opacity = '0';
                    alert.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        alert.remove();
                    }, 300);
                }
            }, 5000);
        }
    });
}

// Theme toggle functionality (for future use)
function initThemeToggle() {
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background-color: var(--accent-primary);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
    `;

    document.body.appendChild(scrollBtn);

    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'auto';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.pointerEvents = 'none';
        }
    });

    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Form enhancements
function initFormEnhancements() {
    // Add loading state to form submissions
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.value || submitBtn.textContent;
                submitBtn.innerHTML = '<span class="loading"></span> Processing...';
                submitBtn.disabled = true;

                // Re-enable button after 10 seconds as fallback
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 10000);
            }
        });
    });

    // Real-time validation for common fields
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateEmail(this);
        });
    });

    const usernameFields = document.querySelectorAll('input[name="username"]');
    usernameFields.forEach(field => {
        field.addEventListener('input', function() {
            validateUsername(this);
        });
    });
}

// Tooltip functionality
function initTooltips() {
    // Add tooltips to elements with data-tooltip attribute
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        let tooltip;

        element.addEventListener('mouseenter', function() {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background-color: var(--bg-tertiary);
                color: var(--text-primary);
                padding: 0.5rem;
                border-radius: 5px;
                font-size: 0.8rem;
                z-index: 1001;
                pointer-events: none;
                white-space: nowrap;
                border: 1px solid var(--border-color);
            `;

            document.body.appendChild(tooltip);

            // Position tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });

        element.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function validateEmail(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

function validateUsername(field) {
    const username = field.value.trim();
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (username && !usernameRegex.test(username)) {
        showFieldError(field, 'Username must be 3-20 characters, letters, numbers, and underscores only');
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

function showFieldError(field, message) {
    clearFieldError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-js';
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--error-color)';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error-js');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Stats animation for homepage
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = parseInt(stat.dataset.value || stat.textContent.replace(/,/g, ''));
                const duration = 2000;
                const increment = finalValue / (duration / 16);
                let currentValue = 0;

                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(currentValue).toLocaleString();
                }, 16);

                observer.unobserve(stat);
            }
        });
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Initialize stats animation on homepage
if (window.location.pathname === '/' || window.location.pathname === '/index') {
    document.addEventListener('DOMContentLoaded', animateStats);
}

// Navigation active state management
function updateActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Update navigation on page load
document.addEventListener('DOMContentLoaded', updateActiveNavigation);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + S to focus search
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close search results
    if (e.key === 'Escape') {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
});

// Console security warning
console.log('%c🛡️ CyberCrypto Security Forum', 'color: #00C4B4; font-size: 20px; font-weight: bold;');
console.log('%cSecurity Warning: Do not paste any code here unless you understand what it does. Malicious code can compromise your account.', 'color: #FF5252; font-size: 14px;');
