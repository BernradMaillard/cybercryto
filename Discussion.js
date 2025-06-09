// Discussion page specific functionality
let currentFilter = 'all';
let currentSort = 'recent';
let currentPage = 1;
const itemsPerPage = 10;
let filteredDiscussions = [];

// Extended discussions data for the discussions page
const allDiscussions = [
    {
        id: 1,
        title: "Zero-day vulnerability discovered in popular VPN client",
        excerpt: "A critical vulnerability has been found that allows remote code execution. This affects millions of users worldwide and requires immediate attention.",
        content: "A critical zero-day vulnerability (CVE-2024-XXXX) has been discovered in a widely-used VPN client that could allow attackers to execute arbitrary code on affected systems. The vulnerability exists in the client's connection handling mechanism and can be exploited when connecting to malicious VPN servers. Security researchers estimate that over 50 million users could be affected by this vulnerability. Immediate patching is recommended for all users.",
        category: "threat-analysis",
        author: "SecResearcher",
        date: "2024-06-08",
        replies: 45,
        views: 847,
        isPinned: true,
        tags: ["zero-day", "vpn", "critical", "cve"]
    },
    {
        id: 2,
        title: "Best practices for implementing AES-256 in production",
        excerpt: "Looking for recommendations on secure AES implementation patterns for enterprise applications.",
        content: "I'm working on implementing AES-256 encryption for our enterprise application and would love to get some expert advice on best practices. Specifically, I'm looking for guidance on key management, initialization vectors, and secure implementation patterns that have been proven in production environments.",
        category: "cryptography",
        author: "CryptoExpert",
        date: "2024-06-08",
        replies: 31,
        views: 532,
        isPinned: false,
        tags: ["aes", "encryption", "production", "best-practices"]
    },
    {
        id: 3,
        title: "CISSP vs CEH: Which certification should I pursue first?",
        excerpt: "I'm new to cybersecurity and trying to decide between these certifications for career advancement.",
        content: "I'm relatively new to the cybersecurity field (about 6 months experience) and I'm looking to advance my career through certifications. I've been researching CISSP and CEH certifications but I'm not sure which one would be more beneficial to pursue first. What are your experiences with these certifications?",
        category: "career-guidance",
        author: "AspiringSec",
        date: "2024-06-08",
        replies: 67,
        views: 1234,
        isPinned: false,
        tags: ["cissp", "ceh", "certification", "career"]
    },
    {
        id: 4,
        title: "Python script for automated penetration testing",
        excerpt: "Sharing a Python framework I've been working on for automated security testing workflows.",
        content: "I've been developing a Python framework for automating common penetration testing tasks. The framework includes modules for reconnaissance, vulnerability scanning, and exploitation. I'd love to get feedback from the community and see if others would find this useful. The code is available on GitHub.",
        category: "tools-scripts",
        author: "PenTester",
        date: "2024-06-07",
        replies: 28,
        views: 756,
        isPinned: false,
        tags: ["python", "automation", "pentest", "tools"]
    },
    {
        id: 5,
        title: "Understanding the latest ransomware attack vectors",
        excerpt: "Analysis of recent ransomware campaigns and their infection methods.",
        content: "Recent ransomware campaigns have been employing increasingly sophisticated attack vectors. This post analyzes the latest trends including supply chain attacks, zero-day exploits, and social engineering techniques used by ransomware groups.",
        category: "threat-analysis",
        author: "ThreatAnalyst",
        date: "2024-06-06",
        replies: 52,
        views: 923,
        isPinned: false,
        tags: ["ransomware", "attack-vectors", "analysis"]
    },
    {
        id: 6,
        title: "Securing IoT devices in enterprise environments",
        excerpt: "Best practices for IoT security implementation in corporate networks.",
        content: "With the proliferation of IoT devices in enterprise environments, security teams face new challenges. This discussion covers best practices for device authentication, network segmentation, and monitoring of IoT ecosystems.",
        category: "general-security",
        author: "IoTExpert",
        date: "2024-06-06",
        replies: 23,
        views: 445,
        isPinned: false,
        tags: ["iot", "enterprise", "network-security"]
    },
    {
        id: 7,
        title: "Complete guide to blockchain security auditing",
        excerpt: "Step-by-step process for conducting thorough blockchain security audits.",
        content: "A comprehensive guide covering the methodology for conducting security audits of blockchain applications, including smart contract analysis, consensus mechanism evaluation, and common vulnerability patterns.",
        category: "learning-resources",
        author: "BlockchainGuru",
        date: "2024-06-05",
        replies: 18,
        views: 312,
        isPinned: false,
        tags: ["blockchain", "audit", "smart-contracts"]
    },
    {
        id: 8,
        title: "Multi-factor authentication implementation challenges",
        excerpt: "Discussing common challenges when implementing MFA in large organizations.",
        content: "Organizations often face significant challenges when implementing multi-factor authentication across diverse systems and user bases. Let's discuss common pitfalls and solutions.",
        category: "general-security",
        author: "MFASpecialist",
        date: "2024-06-05",
        replies: 35,
        views: 678,
        isPinned: false,
        tags: ["mfa", "authentication", "implementation"]
    },
    {
        id: 9,
        title: "Quantum computing threats to current cryptography",
        excerpt: "How quantum computing will impact current cryptographic standards and what we can do to prepare.",
        content: "Quantum computing poses a significant threat to current cryptographic standards. This post explores the timeline for quantum threats and discusses post-quantum cryptography solutions.",
        category: "cryptography",
        author: "QuantumSec",
        date: "2024-06-04",
        replies: 42,
        views: 891,
        isPinned: false,
        tags: ["quantum", "post-quantum", "cryptography"]
    },
    {
        id: 10,
        title: "Building a career in incident response",
        excerpt: "Tips and insights for professionals looking to specialize in cybersecurity incident response.",
        content: "Incident response is a critical specialization in cybersecurity. This post covers the skills needed, typical career paths, and advice for getting started in this field.",
        category: "career-guidance",
        author: "IRManager",
        date: "2024-06-04",
        replies: 29,
        views: 567,
        isPinned: false,
        tags: ["incident-response", "career", "specialization"]
    }
];

// Initialize discussions page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('discussions.html')) {
        loadDiscussions();
        updatePaginationInfo();
    }
});

// Filter discussions by category
function filterByCategory(category) {
    currentFilter = category;
    currentPage = 1;

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    loadDiscussions();
    updatePaginationInfo();
}

// Sort discussions
function sortDiscussions() {
    currentSort = document.getElementById('sortSelect').value;
    currentPage = 1;
    loadDiscussions();
    updatePaginationInfo();
}

// Load and display discussions
function loadDiscussions() {
    // Filter discussions
    filteredDiscussions = currentFilter === 'all'
        ? [...allDiscussions]
        : allDiscussions.filter(d => d.category === currentFilter);

    // Sort discussions
    switch (currentSort) {
        case 'recent':
            filteredDiscussions.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'popular':
            filteredDiscussions.sort((a, b) => (b.views + b.replies) - (a.views + a.replies));
            break;
        case 'replies':
            filteredDiscussions.sort((a, b) => b.replies - a.replies);
            break;
        case 'views':
            filteredDiscussions.sort((a, b) => b.views - a.views);
            break;
    }

    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDiscussions = filteredDiscussions.slice(startIndex, endIndex);

    // Render discussions
    const discussionList = document.getElementById('discussionList');
    discussionList.innerHTML = paginatedDiscussions.map(discussion => createDiscussionHTML(discussion)).join('');
}

// Create HTML for a discussion item
function createDiscussionHTML(discussion) {
    const categoryName = getCategoryDisplayName(discussion.category);
    const timeAgo = getTimeAgo(discussion.date);
    const authorInitials = discussion.author.substring(0, 2).toUpperCase();

    return `
        <div class="discussion-item ${discussion.isPinned ? 'pinned' : ''}" onclick="openDiscussionDetail(${discussion.id})">
            <div class="discussion-avatar">
                <div class="avatar-circle">${authorInitials}</div>
            </div>
            <div class="discussion-content">
                <div class="discussion-header">
                    <div class="discussion-tags">
                        ${discussion.isPinned ? '<span class="tag pinned-tag">Pinned</span>' : ''}
                        <span class="tag category-tag">${categoryName}</span>
                        ${discussion.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span class="discussion-time">${timeAgo}</span>
                </div>
                <h3 class="discussion-title">${discussion.title}</h3>
                <p class="discussion-excerpt">${discussion.excerpt}</p>
                <div class="discussion-meta">
                    <span class="author">By ${discussion.author}</span>
                    <div class="discussion-stats">
                        <span class="stat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                            </svg>
                            ${discussion.replies}
                        </span>
                        <span class="stat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            ${discussion.views}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get category display name
function getCategoryDisplayName(category) {
    const categoryMap = {
        'threat-analysis': 'Threat Analysis',
        'cryptography': 'Cryptography',
        'career-guidance': 'Career Guidance',
        'tools-scripts': 'Tools & Scripts',
        'learning-resources': 'Learning Resources',
        'general-security': 'General Security'
    };
    return categoryMap[category] || category;
}

// Get time ago string
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString();
}

// Pagination functions
function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredDiscussions.length / itemsPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    // Update button states
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadDiscussions();
        updatePaginationInfo();
        scrollToTop();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredDiscussions.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        loadDiscussions();
        updatePaginationInfo();
        scrollToTop();
    }
}

function scrollToTop() {
    document.querySelector('.discussion-list-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// New discussion modal
function openNewDiscussionModal() {
    if (!isLoggedIn) {
        showNotification('Please log in to create a discussion', 'error');
        openLoginModal();
        return;
    }
    document.getElementById('newDiscussionModal').style.display = 'block';
}

function createNewDiscussion(event) {
    event.preventDefault();

    const title = document.getElementById('discussionTitle').value;
    const category = document.getElementById('discussionCategory').value;
    const content = document.getElementById('discussionContent').value;
    const isPinned = document.getElementById('discussionPinned').checked;

    if (!currentUser) {
        showNotification('Please log in to create a discussion', 'error');
        return;
    }

    // Create new discussion object
    const newDiscussion = {
        id: allDiscussions.length + 1,
        title: title,
        excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        content: content,
        category: category,
        author: currentUser.username || currentUser.name,
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        views: 1,
        isPinned: isPinned && currentUser.role === 'admin', // Only admins can pin
        tags: extractTags(content)
    };

    // Add to discussions array
    allDiscussions.unshift(newDiscussion);

    // Reload discussions
    loadDiscussions();
    updatePaginationInfo();

    // Close modal and reset form
    closeModal('newDiscussionModal');
    document.getElementById('newDiscussionForm').reset();

    showNotification('Discussion created successfully!', 'success');
}

// Extract tags from content (simple implementation)
function extractTags(content) {
    const commonWords = ['and', 'or', 'but', 'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'with'];
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const relevantWords = words.filter(word =>
        word.length > 3 &&
        !commonWords.includes(word) &&
        isNaN(word)
    );

    // Get most frequent words as tags
    const wordCount = {};
    relevantWords.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([word]) => word);
}

// Open discussion detail (placeholder)
function openDiscussionDetail(discussionId) {
    const discussion = allDiscussions.find(d => d.id === discussionId);
    if (discussion) {
        // Increment view count
        discussion.views++;

        // In a real app, this would navigate to a detailed discussion page
        showNotification(`Opening discussion: ${discussion.title}`, 'info');
    }
}
