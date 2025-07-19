// Main JavaScript for SizeGenetics website
document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
    setupNavigation();
});

// Load articles from JSON data
async function loadArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    const loading = document.getElementById('loading');
    
    try {
        // Try to load articles from articles.json
        const response = await fetch('articles.json');
        if (!response.ok) {
            throw new Error('Articles not found');
        }
        
        const articles = await response.json();
        
        if (articles.length === 0) {
            articlesGrid.innerHTML = '<p class="no-articles">No articles available yet. Check back soon!</p>';
        } else {
            displayArticles(articles);
        }
        
        loading.classList.add('hidden');
    } catch (error) {
        console.log('No articles.json found, showing placeholder content');
        displayPlaceholderArticles();
        loading.classList.add('hidden');
    }
}

// Display articles in the grid
function displayArticles(articles) {
    const articlesGrid = document.getElementById('articles-grid');
    
    articlesGrid.innerHTML = articles.map(article => `
        <article class="article-card">
            <div class="article-header">
                <h3 class="article-title">${escapeHtml(article.title)}</h3>
                <div class="article-date">${formatDate(article.date)}</div>
            </div>
            <div class="article-content">
                <p class="article-excerpt">${escapeHtml(article.excerpt)}</p>
                <a href="article.html?id=${article.id}" class="read-more">Read More →</a>
            </div>
        </article>
    `).join('');
}

// Display placeholder articles when no real articles exist
function displayPlaceholderArticles() {
    const placeholderArticles = [
        {
            id: 'placeholder-1',
            title: 'Understanding SizeGenetics: A Comprehensive Guide',
            excerpt: 'Learn about the science behind SizeGenetics and how traction devices work for natural enhancement.',
            date: new Date().toISOString()
        },
        {
            id: 'placeholder-2',
            title: 'Safety First: Best Practices for Using Enhancement Devices',
            excerpt: 'Important safety guidelines and tips for proper usage of enhancement devices.',
            date: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'placeholder-3',
            title: 'Frequently Asked Questions About Natural Enhancement',
            excerpt: 'Common questions and answers about natural enhancement methods and devices.',
            date: new Date(Date.now() - 172800000).toISOString()
        }
    ];
    
    displayArticles(placeholderArticles);
}

// Setup smooth scrolling navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to generate article slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

