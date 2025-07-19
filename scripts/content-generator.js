// Content Generator for SizeGenetics Website
// This script generates new articles using the Openrouter API

const fs = require('fs');
const path = require('path');

// Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const MODEL = 'deepseek/deepseek-r1-0528:free';
const API_BASE = 'https://openrouter.ai/api/v1';

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

// Generate article content using Openrouter API
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

// Generate article slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Create article object
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

// Load existing articles
function loadExistingArticles() {
    const articlesPath = path.join(__dirname, '../src/articles.json');
    
    if (fs.existsSync(articlesPath)) {
        try {
            const data = fs.readFileSync(articlesPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading existing articles:', error);
            return [];
        }
    }
    
    return [];
}

// Save articles to JSON file
function saveArticles(articles) {
    const articlesPath = path.join(__dirname, '../src/articles.json');
    const articlesDir = path.join(__dirname, '../src/articles');
    
    // Ensure directories exist
    if (!fs.existsSync(path.dirname(articlesPath))) {
        fs.mkdirSync(path.dirname(articlesPath), { recursive: true });
    }
    
    if (!fs.existsSync(articlesDir)) {
        fs.mkdirSync(articlesDir, { recursive: true });
    }
    
    // Save main articles list
    fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
    
    // Save individual article files
    articles.forEach(article => {
        const articlePath = path.join(articlesDir, `${article.id}.json`);
        fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
    });
    
    console.log(`Saved ${articles.length} articles`);
}

// Main function to generate new content
async function generateNewContent() {
    console.log('Starting content generation...');
    
    const existingArticles = loadExistingArticles();
    console.log(`Found ${existingArticles.length} existing articles`);
    
    // Select a random topic
    const randomTopic = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)];
    console.log(`Generating article for topic: ${randomTopic}`);
    
    // Generate content
    const content = await generateArticleContent(randomTopic);
    
    if (!content) {
        console.error('Failed to generate content');
        process.exit(1);
    }
    
    // Create article object
    const article = createArticle(randomTopic, content);
    console.log(`Created article: ${article.title}`);
    
    // Add to existing articles (newest first)
    const updatedArticles = [article, ...existingArticles];
    
    // Keep only the latest 20 articles
    const limitedArticles = updatedArticles.slice(0, 20);
    
    // Save articles
    saveArticles(limitedArticles);
    
    console.log('Content generation completed successfully!');
    console.log(`Article ID: ${article.id}`);
    console.log(`Article Title: ${article.title}`);
}

// Run if called directly
if (require.main === module) {
    generateNewContent().catch(error => {
        console.error('Error in content generation:', error);
        process.exit(1);
    });
}

module.exports = {
    generateNewContent,
    generateArticleContent,
    createArticle,
    loadExistingArticles,
    saveArticles
};

