# SizeGenetics Auto-Generated Content Website

This project creates an auto-generated content website for SizeGenetics that automatically posts new content using the Openrouter API and deploys to Cloudflare Pages.

## Features

- **Static Website**: Fast, responsive website built with HTML, CSS, and JavaScript
- **Auto Content Generation**: Uses Openrouter API with DeepSeek model to generate educational articles
- **Automated Publishing**: Content is automatically generated and published daily
- **Cloudflare Pages Deployment**: Fast global CDN with automatic deployments
- **Mobile Responsive**: Works perfectly on all devices

## Project Structure

```
sizegenetics-website/
├── src/                          # Website source files
│   ├── index.html               # Main homepage
│   ├── article.html             # Article page template
│   ├── styles.css               # Website styles
│   ├── script.js                # Homepage JavaScript
│   ├── article.js               # Article page JavaScript
│   ├── articles.json            # Articles index (auto-generated)
│   └── articles/                # Individual article files (auto-generated)
├── scripts/
│   └── content-generator.js     # Content generation script
├── .github/workflows/
│   └── generate-content.yml     # GitHub Actions workflow
├── cloudflare-worker.js         # Cloudflare Worker for content generation
├── wrangler.toml               # Cloudflare Worker configuration
└── package.json                # Node.js dependencies
```

## Setup Instructions

### 1. Create GitHub Repository

1. Create a new GitHub repository (e.g., `your-username/sizegenetics-website`)
2. Upload all files from this project to your repository
3. Make sure the repository is public or you have a GitHub Pro account for private repos with Pages

### 2. Set Up GitHub Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add:

- `OPENROUTER_API_KEY`: Your Openrouter API key (`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`)

### 3. Deploy to Cloudflare Pages

#### Option A: Connect GitHub Repository (Recommended)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to "Workers & Pages" > "Pages"
3. Click "Connect to Git"
4. Select your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build` (optional, leave empty for static files)
   - **Build output directory**: `src`
   - **Root directory**: `/` (leave empty)
6. Click "Save and Deploy"

#### Option B: Direct Upload

1. Zip the contents of the `src/` folder
2. Go to Cloudflare Pages dashboard
3. Click "Upload assets"
4. Upload your zip file

### 4. Set Up Automated Content Generation

You have two options for automated content generation:

#### Option A: GitHub Actions (Recommended)

The GitHub Actions workflow is already configured and will:
- Run daily at 9 AM UTC
- Generate new content using your Openrouter API key
- Commit changes to your repository
- Trigger automatic Cloudflare Pages deployment

No additional setup required - it will start working automatically!

#### Option B: Cloudflare Worker (Advanced)

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`
3. Set secrets:
   ```bash
   wrangler secret put OPENROUTER_API_KEY
   wrangler secret put GITHUB_TOKEN
   wrangler secret put GITHUB_REPO
   ```
4. Deploy worker: `wrangler deploy`

### 5. Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to your project
2. Click "Custom domains"
3. Add your domain name
4. Follow DNS configuration instructions

## Content Generation

### How It Works

1. **Daily Schedule**: Content is generated automatically every day at 9 AM UTC
2. **Topic Selection**: Random topics are selected from a predefined list of SizeGenetics-related subjects
3. **AI Generation**: Openrouter API with DeepSeek model generates comprehensive, educational articles
4. **Auto Publishing**: New articles are automatically added to the website and deployed

### Manual Content Generation

To generate content manually:

```bash
cd scripts
OPENROUTER_API_KEY="your-api-key" node content-generator.js
```

### Content Topics

The system generates articles on topics including:
- Benefits of using SizeGenetics traction devices
- Safety guidelines for using enhancement devices
- Scientific research behind penis traction therapy
- Proper usage instructions and best practices
- Comparison with other enhancement methods
- And many more educational topics

## Customization

### Changing Content Generation Schedule

Edit `.github/workflows/generate-content.yml` and modify the cron schedule:

```yaml
schedule:
  - cron: '0 9 * * *'  # Daily at 9 AM UTC
```

### Adding New Topics

Edit `scripts/content-generator.js` and add topics to the `ARTICLE_TOPICS` array.

### Styling Changes

Modify `src/styles.css` to change the website appearance.

### Content Limits

- The system keeps the latest 20 articles to prevent unlimited growth
- Each article is approximately 800-1200 words
- Articles are stored as JSON files for easy management

## Technical Details

### API Usage

- **Model**: `deepseek/deepseek-r1-0528:free`
- **API Base**: `https://openrouter.ai/api/v1`
- **Rate Limits**: Respects Openrouter API rate limits
- **Cost**: Uses free tier model to minimize costs

### Performance

- **Static Files**: Ultra-fast loading with Cloudflare CDN
- **Mobile Optimized**: Responsive design for all devices
- **SEO Friendly**: Proper meta tags and semantic HTML

### Security

- API keys are stored securely in GitHub Secrets
- No sensitive data exposed in client-side code
- HTTPS enforced by Cloudflare Pages

## Troubleshooting

### Content Not Generating

1. Check GitHub Actions logs in your repository
2. Verify your Openrouter API key is correct
3. Ensure the API key has sufficient credits

### Deployment Issues

1. Check Cloudflare Pages build logs
2. Verify your repository is connected correctly
3. Ensure build settings are configured properly

### API Errors

1. Check Openrouter API status
2. Verify your API key permissions
3. Check rate limits and usage

## Support

For issues with:
- **Cloudflare Pages**: Check [Cloudflare Documentation](https://developers.cloudflare.com/pages/)
- **GitHub Actions**: Check [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **Openrouter API**: Check [Openrouter Documentation](https://openrouter.ai/docs)

## License

This project is provided as-is for educational purposes. Please ensure compliance with all applicable terms of service and regulations.

## Disclaimer

This website is for educational and informational purposes only. It is not officially affiliated with SizeGenetics. Always consult with healthcare professionals before using any enhancement products.

