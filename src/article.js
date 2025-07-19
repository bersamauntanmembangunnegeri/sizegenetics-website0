// Article page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadArticle();
});

async function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        showArticleNotFound();
        return;
    }
    
    try {
        // Try to load the specific article
        const response = await fetch(`articles/${articleId}.json`);
        if (!response.ok) {
            throw new Error('Article not found');
        }
        
        const article = await response.json();
        displayArticle(article);
        
    } catch (error) {
        console.log('Article not found, checking articles.json');
        
        try {
            // Fallback: check articles.json for the article
            const response = await fetch('articles.json');
            if (!response.ok) {
                throw new Error('Articles list not found');
            }
            
            const articles = await response.json();
            const article = articles.find(a => a.id === articleId);
            
            if (article) {
                displayArticle(article);
            } else {
                showPlaceholderArticle(articleId);
            }
            
        } catch (error) {
            showPlaceholderArticle(articleId);
        }
    }
}

function displayArticle(article) {
    const articleContent = document.getElementById('article-content');
    const loading = document.getElementById('loading');
    
    // Update page title
    document.getElementById('article-title').textContent = `${article.title} - SizeGenetics Hub`;
    document.title = `${article.title} - SizeGenetics Hub`;
    
    // Display article content
    articleContent.innerHTML = `
        <h1>${escapeHtml(article.title)}</h1>
        <div class="article-meta">
            Published on ${formatDate(article.date)}
        </div>
        <div class="article-body">
            ${article.content || article.body || `<p>${escapeHtml(article.excerpt || 'Article content will be available soon.')}</p>`}
        </div>
    `;
    
    loading.classList.add('hidden');
}

function showPlaceholderArticle(articleId) {
    const placeholderArticles = {
        'placeholder-1': {
            title: 'Understanding SizeGenetics: A Comprehensive Guide',
            content: `
                <p>SizeGenetics is a medically-approved traction device designed for natural enhancement. This comprehensive guide will help you understand how these devices work and their potential benefits.</p>
                
                <h2>How Traction Devices Work</h2>
                <p>Traction devices work on the principle of tissue expansion through gentle, consistent stretching. This process, known as cytokinesis, encourages cellular growth and division over time.</p>
                
                <h2>Safety Considerations</h2>
                <p>When using any enhancement device, safety should always be the top priority. Always follow manufacturer guidelines and consult with healthcare professionals.</p>
                
                <h2>Expected Timeline</h2>
                <p>Results typically become noticeable after several months of consistent use. Patience and consistency are key factors in achieving desired outcomes.</p>
                
                <p><strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice.</p>
            `,
            date: new Date().toISOString()
        },
        'placeholder-2': {
            title: 'Safety First: Best Practices for Using Enhancement Devices',
            content: `
                <p>Safety is paramount when using any enhancement device. This guide outlines essential best practices to ensure safe and effective use.</p>
                
                <h2>Pre-Use Preparation</h2>
                <p>Before using any device, ensure you understand the instructions completely. Clean the device thoroughly and check for any damage or wear.</p>
                
                <h2>Proper Usage Guidelines</h2>
                <p>Start with shorter sessions and gradually increase duration as your body adapts. Never exceed recommended usage times or tension levels.</p>
                
                <h2>Warning Signs to Watch For</h2>
                <p>Discontinue use immediately if you experience pain, numbness, discoloration, or any unusual symptoms. Consult a healthcare provider if concerns persist.</p>
                
                <h2>Maintenance and Care</h2>
                <p>Regular cleaning and proper storage extend device lifespan and maintain hygiene standards.</p>
                
                <p><strong>Important:</strong> Always consult with a healthcare professional before beginning any enhancement regimen.</p>
            `,
            date: new Date(Date.now() - 86400000).toISOString()
        },
        'placeholder-3': {
            title: 'Frequently Asked Questions About Natural Enhancement',
            content: `
                <p>Here are answers to the most commonly asked questions about natural enhancement methods and devices.</p>
                
                <h2>How long does it take to see results?</h2>
                <p>Results vary by individual, but most users report noticeable changes after 3-6 months of consistent use. Patience and consistency are essential.</p>
                
                <h2>Are these devices safe to use?</h2>
                <p>When used according to manufacturer instructions and under medical guidance, these devices are generally considered safe. However, individual results and experiences may vary.</p>
                
                <h2>Can I use the device while sleeping?</h2>
                <p>Most manufacturers do not recommend overnight use. Follow specific device guidelines and never exceed recommended usage times.</p>
                
                <h2>What if I experience discomfort?</h2>
                <p>Mild discomfort during initial use is normal, but pain is not. If you experience pain, reduce tension or discontinue use and consult a healthcare provider.</p>
                
                <h2>How do I maintain the device?</h2>
                <p>Regular cleaning with mild soap and water, proper storage, and periodic inspection for wear are essential for device longevity and hygiene.</p>
                
                <p><strong>Note:</strong> These answers are for informational purposes only. Always consult healthcare professionals for personalized advice.</p>
            `,
            date: new Date(Date.now() - 172800000).toISOString()
        }
    };
    
    const article = placeholderArticles[articleId];
    if (article) {
        displayArticle(article);
    } else {
        showArticleNotFound();
    }
}

function showArticleNotFound() {
    const articleContent = document.getElementById('article-content');
    const articleNotFound = document.getElementById('article-not-found');
    const loading = document.getElementById('loading');
    
    articleContent.classList.add('hidden');
    articleNotFound.classList.remove('hidden');
    loading.classList.add('hidden');
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

