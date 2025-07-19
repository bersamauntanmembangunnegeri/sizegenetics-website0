// Cloudflare Worker for automated content generation
// This worker will be triggered by a cron schedule to generate new content

const OPENROUTER_API_KEY = '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';
const MODEL = 'deepseek/deepseek-r1-0528:free';
const API_BASE = 'https://openrouter.ai/api/v1';
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN'; // User will need to provide this
const GITHUB_REPO = 'YOUR_USERNAME/sizegenetics-website'; // User will need to update this

// Article topics for SizeGenetics
const ARTICLE_TOPICS = [
    'Benefits of using SizeGenetics traction devices',
    'How to properly use SizeGenetics for best results',
    'Scientific research behind penis traction therapy',
    'SizeGenetics vs other enhancement methods comparison',
    'Safety guidelines for using enhancement devices',
    'Understanding the science of tissue expansion',
    'Common myths about male enhancement debunked',
    'Maintaining confidence during enhancement journey',
    'The psychology of male enhancement and self-esteem',
    'Proper care and maintenance of traction devices',
    'Setting realistic expectations for enhancement results',
    'The importance of consistency in enhancement routines',
    'Understanding FDA approval for medical devices',
    'How to choose the right enhancement device',
    'The role of patience in natural enhancement',
    'Combining lifestyle changes with device usage',
    'Understanding the difference between enhancement methods',
    'The importance of medical consultation before starting',
    'Building healthy habits around enhancement routines',
    'Addressing common concerns about enhancement devices'
];

export default {
    async scheduled(event, env, ctx) {
        console.log('Scheduled content generation triggered');
        
        try {
            await generateAndCommitContent();
            console.log('Content generation completed successfully');
        } catch (error) {
            console.error('Error in scheduled content generation:', error);
        }
    },

    async fetch(request, env, ctx) {
        // Handle manual triggers via HTTP requests
        if (request.method === 'POST') {
            try {
                await generateAndCommitContent();
                return new Response('Content generated successfully', { status: 200 });
            } catch (error) {
                console.error('Error generating content:', error);
                return new Response('Error generating content', { status: 500 });
            }
        }
        
        return new Response('SizeGenetics Content Generator Worker', { status: 200 });
    }
};

async function generateAndCommitContent() {
    // Select a random topic
    const randomTopic = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)];
    console.log(`Generating article for topic: ${randomTopic}`);
    
    // Generate content using OpenRouter API
    const content = await generateArticleContent(randomTopic);
    
    if (!content) {
        throw new Error('Failed to generate content');
    }
    
    // Create article object
    const article = createArticle(randomTopic, content);
    console.log(`Created article: ${article.title}`);
    
    // Get existing articles from GitHub
    const existingArticles = await getExistingArticles();
    
    // Add new article (newest first)
    const updatedArticles = [article, ...existingArticles];
    
    // Keep only the latest 20 articles
    const limitedArticles = updatedArticles.slice(0, 20);
    
    // Commit to GitHub
    await commitToGitHub(article, limitedArticles);
    
    console.log('Content committed to GitHub successfully');
}

async function generateArticleContent(topic) {
    const prompt = `Write a comprehensive, informative article about "${topic}" related to SizeGenetics and male enhancement devices. 

The article should be:
- Educational and informative
- Professional and medical in tone
- Around 800-1200 words
- Include proper headings (use ## for h2, ### for h3)
- Focus on safety, science, and realistic expectations
- Include disclaimers about consulting healthcare professionals
- Avoid overly promotional language
- Be factual and evidence-based where possible

Format the response as HTML content (just the body content, no html/head tags).`;

    try {
        const response = await fetch(`${API_BASE}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://sizegenetics-hub.pages.dev',
                'X-Title': 'SizeGenetics Content Generator'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating content:', error);
        return null;
    }
}

function createArticle(title, content) {
    const now = new Date();
    const id = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${generateSlug(title)}`;
    
    // Extract excerpt from content (first paragraph)
    const textContent = content.replace(/<[^>]*>/g, '');
    const sentences = textContent.split('.').filter(s => s.trim().length > 0);
    const excerpt = sentences.slice(0, 2).join('.') + '.';
    
    return {
        id,
        title,
        excerpt: excerpt.substring(0, 200) + (excerpt.length > 200 ? '...' : ''),
        content,
        date: now.toISOString(),
        slug: generateSlug(title)
    };
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function getExistingArticles() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/src/articles.json`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            console.log('No existing articles.json found');
            return [];
        }
        
        const data = await response.json();
        const content = atob(data.content);
        return JSON.parse(content);
    } catch (error) {
        console.error('Error fetching existing articles:', error);
        return [];
    }
}

async function commitToGitHub(article, articles) {
    // Update articles.json
    await updateFile('src/articles.json', JSON.stringify(articles, null, 2), 'Update articles list with new content');
    
    // Create individual article file
    await updateFile(`src/articles/${article.id}.json`, JSON.stringify(article, null, 2), `Add new article: ${article.title}`);
}

async function updateFile(path, content, message) {
    try {
        // Get current file (if exists) to get SHA
        let sha = null;
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                sha = data.sha;
            }
        } catch (error) {
            // File doesn't exist, that's okay
        }
        
        // Update or create file
        const updateData = {
            message,
            content: btoa(content),
            branch: 'main'
        };
        
        if (sha) {
            updateData.sha = sha;
        }
        
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update ${path}: ${response.status} ${response.statusText}`);
        }
        
        console.log(`Successfully updated ${path}`);
    } catch (error) {
        console.error(`Error updating ${path}:`, error);
        throw error;
    }
}

