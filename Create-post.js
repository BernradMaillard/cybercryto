// Create Post Page Functionality
let previewVisible = false;
let drafts = JSON.parse(localStorage.getItem('cybercrypto_drafts') || '[]');

// Initialize create post page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn) {
        showNotification('Please log in to create a post', 'error');
        setTimeout(() => {
            window.location.href = 'discussions.html';
        }, 2000);
        return;
    }

    // Show admin options if user is admin
    if (currentUser && currentUser.role === 'admin') {
        document.getElementById('pinOption').style.display = 'block';
    }

    // Initialize form functionality
    initializeFormHandlers();
    loadDraftIfExists();
});

// Initialize form event handlers
function initializeFormHandlers() {
    const titleInput = document.getElementById('postTitle');
    const contentTextarea = document.getElementById('postContent');
    const tagsInput = document.getElementById('postTags');
    const categorySelect = document.getElementById('postCategory');
    const form = document.getElementById('createPostForm');

    // Character counters
    titleInput.addEventListener('input', updateTitleCounter);
    contentTextarea.addEventListener('input', updateContentCounter);

    // Tag preview
    tagsInput.addEventListener('input', updateTagPreview);

    // Auto-save draft
    titleInput.addEventListener('input', autoSaveDraft);
    contentTextarea.addEventListener('input', autoSaveDraft);
    categorySelect.addEventListener('change', autoSaveDraft);
    tagsInput.addEventListener('input', autoSaveDraft);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Auto-resize textarea
    contentTextarea.addEventListener('input', autoResizeTextarea);
}

// Update title character counter
function updateTitleCounter() {
    const titleInput = document.getElementById('postTitle');
    const counter = document.getElementById('titleCounter');
    const length = titleInput.value.length;
    counter.textContent = `${length}/200`;

    if (length > 180) {
        counter.style.color = '#e74c3c';
    } else if (length > 150) {
        counter.style.color = '#f39c12';
    } else {
        counter.style.color = '#617694';
    }
}

// Update content character counter
function updateContentCounter() {
    const contentTextarea = document.getElementById('postContent');
    const counter = document.getElementById('contentCounter');
    const length = contentTextarea.value.length;
    counter.textContent = `${length.toLocaleString()} characters`;
}

// Update tag preview
function updateTagPreview() {
    const tagsInput = document.getElementById('postTags');
    const tagPreview = document.getElementById('tagPreview');
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    if (tags.length === 0) {
        tagPreview.innerHTML = '';
        return;
    }

    if (tags.length > 5) {
        tags.splice(5);
        tagsInput.value = tags.join(', ');
        showNotification('Maximum 5 tags allowed', 'error');
    }

    tagPreview.innerHTML = tags.map(tag =>
        `<span class="tag-item">${tag}</span>`
    ).join('');
}

// Auto-resize textarea
function autoResizeTextarea() {
    const textarea = document.getElementById('postContent');
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(textarea.scrollHeight, 200) + 'px';
}

// Text formatting functions
function formatText(format) {
    const textarea = document.getElementById('postContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = '';

    switch (format) {
        case 'bold':
            formattedText = `**${selectedText || 'bold text'}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText || 'italic text'}*`;
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                formattedText = `\n\`\`\`\n${selectedText || 'code block'}\n\`\`\`\n`;
            } else {
                formattedText = `\`${selectedText || 'code'}\``;
            }
            break;
        case 'link':
            const url = prompt('Enter URL:');
            if (url) {
                formattedText = `[${selectedText || 'link text'}](${url})`;
            } else {
                return;
            }
            break;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.value = newValue;

    // Set cursor position
    const newCursorPos = start + formattedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();

    updateContentCounter();
    autoResizeTextarea();
}

// Toggle preview
function togglePreview() {
    const previewDiv = document.getElementById('postPreview');
    const toggleBtn = document.getElementById('previewToggleText');

    previewVisible = !previewVisible;

    if (previewVisible) {
        updatePreview();
        previewDiv.style.display = 'block';
        toggleBtn.textContent = 'Hide Preview';
    } else {
        previewDiv.style.display = 'none';
        toggleBtn.textContent = 'Show Preview';
    }
}

// Update preview content
function updatePreview() {
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const tags = document.getElementById('postTags').value;
    const content = document.getElementById('postContent').value;
    const previewDiv = document.getElementById('postPreview');

    if (!title && !content) {
        previewDiv.innerHTML = '<div class="preview-placeholder">Type in the fields above to see a preview of your post</div>';
        return;
    }

    const categoryDisplay = getCategoryDisplayName(category);
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const previewHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <div class="preview-tags">
                    ${category ? `<span class="tag category-tag">${categoryDisplay}</span>` : ''}
                    ${tagArray.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <span class="preview-date">Just now</span>
            </div>
            <h3 class="preview-title">${title || 'Untitled Discussion'}</h3>
            <div class="preview-content-text">${formatPreviewContent(content)}</div>
            <div class="preview-meta">
                <span class="author">By ${currentUser.name}</span>
                <div class="preview-stats">
                    <span>0 replies</span>
                    <span>1 view</span>
                </div>
            </div>
        </div>
    `;

    previewDiv.innerHTML = previewHTML;
}

// Format content for preview (basic markdown-like formatting)
function formatPreviewContent(content) {
    if (!content) return '<em>No content yet...</em>';

    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n/g, '<br>');
}

// Auto-save draft
let autoSaveTimeout;
function autoSaveDraft() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        const draft = {
            id: 'current',
            title: document.getElementById('postTitle').value,
            category: document.getElementById('postCategory').value,
            tags: document.getElementById('postTags').value,
            content: document.getElementById('postContent').value,
            allowComments: document.getElementById('allowComments').checked,
            notifyReplies: document.getElementById('notifyReplies').checked,
            timestamp: new Date().toISOString()
        };

        // Only save if there's actual content
        if (draft.title || draft.content) {
            localStorage.setItem('cybercrypto_current_draft', JSON.stringify(draft));
        }
    }, 1000);
}

// Save draft manually
function saveDraft() {
    const draft = {
        id: Date.now().toString(),
        title: document.getElementById('postTitle').value || 'Untitled Draft',
        category: document.getElementById('postCategory').value,
        tags: document.getElementById('postTags').value,
        content: document.getElementById('postContent').value,
        allowComments: document.getElementById('allowComments').checked,
        notifyReplies: document.getElementById('notifyReplies').checked,
        timestamp: new Date().toISOString()
    };

    if (!draft.content && !draft.title) {
        showNotification('Cannot save empty draft', 'error');
        return;
    }

    drafts.push(draft);
    localStorage.setItem('cybercrypto_drafts', JSON.stringify(drafts));
    localStorage.removeItem('cybercrypto_current_draft');

    showNotification('Draft saved successfully!', 'success');
}

// Load draft if exists
function loadDraftIfExists() {
    const currentDraft = localStorage.getItem('cybercrypto_current_draft');
    if (currentDraft) {
        const draft = JSON.parse(currentDraft);

        if (confirm('You have an unsaved draft. Would you like to continue editing it?')) {
            loadDraft(draft);
        } else {
            localStorage.removeItem('cybercrypto_current_draft');
        }
    }
}

// Load draft into form
function loadDraft(draft) {
    document.getElementById('postTitle').value = draft.title || '';
    document.getElementById('postCategory').value = draft.category || '';
    document.getElementById('postTags').value = draft.tags || '';
    document.getElementById('postContent').value = draft.content || '';
    document.getElementById('allowComments').checked = draft.allowComments !== false;
    document.getElementById('notifyReplies').checked = draft.notifyReplies !== false;

    updateTitleCounter();
    updateContentCounter();
    updateTagPreview();
    autoResizeTextarea();
}

// Cancel post creation
function cancelPost() {
    const hasContent = document.getElementById('postTitle').value ||
                      document.getElementById('postContent').value;

    if (hasContent) {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            localStorage.removeItem('cybercrypto_current_draft');
            window.location.href = 'discussions.html';
        }
    } else {
        window.location.href = 'discussions.html';
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const tags = document.getElementById('postTags').value;
    const content = document.getElementById('postContent').value.trim();
    const allowComments = document.getElementById('allowComments').checked;
    const notifyReplies = document.getElementById('notifyReplies').checked;
    const pinPost = document.getElementById('pinPost').checked;

    // Validation
    if (!title) {
        showNotification('Please enter a title for your discussion', 'error');
        return;
    }

    if (!category) {
        showNotification('Please select a category', 'error');
        return;
    }

    if (!content) {
        showNotification('Please enter some content for your discussion', 'error');
        return;
    }

    if (title.length > 200) {
        showNotification('Title must be 200 characters or less', 'error');
        return;
    }

    // Create post object
    const newPost = {
        id: Date.now(),
        title: title,
        excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        content: content,
        category: category,
        author: currentUser.username || currentUser.name,
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        views: 1,
        isPinned: pinPost && currentUser.role === 'admin',
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        allowComments: allowComments,
        notifyReplies: notifyReplies,
        comments: []
    };

    // Save post (in real app, this would be sent to server)
    let userPosts = JSON.parse(localStorage.getItem('cybercrypto_user_posts') || '[]');
    userPosts.unshift(newPost);
    localStorage.setItem('cybercrypto_user_posts', JSON.stringify(userPosts));

    // Add to global discussions if discussions.js is loaded
    if (typeof allDiscussions !== 'undefined') {
        allDiscussions.unshift(newPost);
    }

    // Clear draft
    localStorage.removeItem('cybercrypto_current_draft');

    showNotification('Discussion published successfully!', 'success');

    // Redirect to the new post or discussions page
    setTimeout(() => {
        window.location.href = `view-post.html?id=${newPost.id}`;
    }, 1500);
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
