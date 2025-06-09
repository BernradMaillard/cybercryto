// User Authentication State
let currentUser = null;
let isLoggedIn = false;

// Sample data for search functionality
const sampleDiscussions = [
    {
        id: 1,
        title: "Zero-day vulnerability discovered in popular VPN client",
        excerpt: "A critical vulnerability has been found that allows remote code execution...",
        category: "threat-analysis",
        author: "SecResearcher",
        date: "2024-06-07",
        replies: 45,
        views: 847
    },
    {
        id: 2,
        title: "Best practices for implementing AES-256 in production",
        excerpt: "Looking for recommendations on secure AES implementation patterns...",
        category: "cryptography",
        author: "CryptoExpert",
        date: "2024-06-07",
        replies: 31,
        views: 532
    },
    {
        id: 3,
        title: "CISSP vs CEH: Which certification should I pursue first?",
        excerpt: "I'm new to cybersecurity and trying to decide between these certifications...",
        category: "career-guidance",
        author: "AspiringSec",
        date: "2024-06-07",
        replies: 67,
        views: 1234
    },
    {
        id: 4,
        title: "Python script for automated penetration testing",
        excerpt: "Sharing a Python framework I've been working on for automated testing...",
        category: "tools-scripts",
        author: "PenTester",
        date: "2024-06-07",
        replies: 28,
        views: 756
    },
    {
        id: 5,
        title: "Understanding the latest ransomware attack vectors",
        excerpt: "Analysis of recent ransomware campaigns and their infection methods...",
        category: "threat-analysis",
        author: "ThreatAnalyst",
        date: "2024-06-06",
        replies: 52,
        views: 923
    },
    {
        id: 6,
        title: "Securing IoT devices in enterprise environments",
        excerpt: "Best practices for IoT security implementation in corporate networks...",
        category: "general-security",
        author: "IoTExpert",
        date: "2024-06-06",
        replies: 23,
        views: 445
    },
    {
        id: 7,
        title: "Complete guide to blockchain security auditing",
        excerpt: "Step-by-step process for conducting thorough blockchain security audits...",
        category: "learning-resources",
        author: "BlockchainGuru",
        date: "2024-06-05",
        replies: 18,
        views: 312
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in (from localStorage)
    checkLoginStatus();

    // Add event listener for search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDiscussions();
            }
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Close user menu when clicking outside
        const userMenu = document.getElementById('userMenu');
        const userAvatar = document.querySelector('.user-avatar');
        if (userMenu && !userAvatar.contains(event.target)) {
            userMenu.classList.remove('show');
        }
    });
});

// Authentication Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation (in real app, this would be server-side)
    if (email && password) {
        // Simulate successful login
        const userData = {
            name: "John Doe",
            email: email,
            username: "johndoe",
            avatar: "https://ext.same-assets.com/949748317/2189427677.svg"
        };

        loginUser(userData);
        closeModal('loginModal');

        // Clear form
        document.getElementById('loginForm').reset();

        // Show success message
        showNotification('Successfully logged in!', 'success');
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;

    // Validation
    if (!name || !email || !username || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Simulate successful registration
    const userData = {
        name: name,
        email: email,
        username: username,
        avatar: "https://ext.same-assets.com/949748317/2189427677.svg"
    };

    loginUser(userData);
    closeModal('registerModal');

    // Clear form
    document.getElementById('registerForm').reset();

    // Show success message
    showNotification('Welcome to CyberCrypto Forum!', 'success');
}

function loginUser(userData) {
    currentUser = userData;
    isLoggedIn = true;

    // Save to localStorage
    localStorage.setItem('cybercrypto_user', JSON.stringify(userData));
    localStorage.setItem('cybercrypto_logged_in', 'true');

    // Update UI
    updateAuthUI();
}

function logout() {
    currentUser = null;
    isLoggedIn = false;

    // Clear localStorage
    localStorage.removeItem('cybercrypto_user');
    localStorage.removeItem('cybercrypto_logged_in');

    // Update UI
    updateAuthUI();

    // Close user menu
    document.getElementById('userMenu').classList.remove('show');

    showNotification('Successfully logged out', 'success');
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('cybercrypto_user');
    const loggedIn = localStorage.getItem('cybercrypto_logged_in');

    if (savedUser && loggedIn === 'true') {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const guestSection = document.getElementById('guestUser');
    const userSection = document.getElementById('authenticatedUser');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (isLoggedIn && currentUser) {
        guestSection.style.display = 'none';
        userSection.style.display = 'block';
        userName.textContent = currentUser.name;
        userAvatar.src = currentUser.avatar;
    } else {
        guestSection.style.display = 'flex';
        userSection.style.display = 'none';
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('show');
}

function viewProfile() {
    // Redirect to profile page or open profile modal
    showNotification('Profile page coming soon!', 'info');
    document.getElementById('userMenu').classList.remove('show');
}

function viewSettings() {
    // Redirect to settings page or open settings modal
    showNotification('Settings page coming soon!', 'info');
    document.getElementById('userMenu').classList.remove('show');
}

// Search Functions
function searchDiscussions() {
    const searchTerm = document.getElementById('searchInput').value.trim();

    if (!searchTerm) {
        showNotification('Please enter a search term', 'error');
        return;
    }

    // Filter discussions based on search term
    const results = sampleDiscussions.filter(discussion =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    displaySearchResults(results, searchTerm);
    document.getElementById('searchModal').style.display = 'block';
}

function applySearchFilters() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;

    let results = sampleDiscussions;

    // Apply search term filter
    if (searchTerm) {
        results = results.filter(discussion =>
            discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discussion.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discussion.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply category filter
    if (categoryFilter) {
        results = results.filter(discussion => discussion.category === categoryFilter);
    }

    // Apply date filter
    if (dateFilter) {
        const today = new Date();
        const filterDate = new Date();

        switch (dateFilter) {
            case 'today':
                filterDate.setDate(today.getDate());
                break;
            case 'week':
                filterDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                filterDate.setMonth(today.getMonth() - 1);
                break;
            case 'year':
                filterDate.setFullYear(today.getFullYear() - 1);
                break;
        }

        results = results.filter(discussion => new Date(discussion.date) >= filterDate);
    }

    displaySearchResults(results, searchTerm || 'All discussions');
}

function displaySearchResults(results, searchTerm) {
    const searchResults = document.getElementById('searchResults');

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #617694;">
                <h3>No results found</h3>
                <p>Try adjusting your search terms or filters</p>
            </div>
        `;
        return;
    }

    const resultsHTML = results.map(discussion => `
        <div class="search-result-item" onclick="openDiscussion(${discussion.id})">
            <div class="search-result-title">${highlightSearchTerm(discussion.title, searchTerm)}</div>
            <div class="search-result-excerpt">${highlightSearchTerm(discussion.excerpt, searchTerm)}</div>
            <div class="search-result-meta">
                <span>By ${discussion.author} • ${formatDate(discussion.date)}</span>
                <span>${discussion.replies} replies • ${discussion.views} views</span>
            </div>
        </div>
    `).join('');

    searchResults.innerHTML = resultsHTML;
}

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || searchTerm === 'All discussions') return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(48, 169, 161, 0.3); color: #30a9a1;">$1</mark>');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString();
}

function openDiscussion(discussionId) {
    // In a real app, this would navigate to the discussion page
    showNotification(`Opening discussion ${discussionId}`, 'info');
    closeModal('searchModal');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#30a9a1';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        case 'info':
            notification.style.backgroundColor = '#3982d4';
            break;
        default:
            notification.style.backgroundColor = '#617694';
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Navigation Functions
function navigateToPage(page) {
    // In a real single-page application, you would handle routing here
    // For now, we'll just show a notification
    showNotification(`Navigating to ${page} page`, 'info');
}

// Utility Functions
function generateAvatar(name) {
    // Generate a simple avatar based on initials
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['#30a9a1', '#3982d4', '#e74c3c', '#2ecc71', '#f39c12'];
    const color = colors[name.length % colors.length];

    return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="${color}"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${initials}</text>
        </svg>
    `)}`;
}
