# Cloudflare Pages Deployment Guide

This guide will walk you through deploying your SizeGenetics auto-content website to Cloudflare Pages.

## Prerequisites

- GitHub account
- Cloudflare account (free tier is sufficient)
- Your Openrouter API key: `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`

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `sizegenetics-website`)
5. Make sure it's set to "Public" (required for free Cloudflare Pages)
6. Click "Create repository"

## Step 2: Upload Your Website Files

### Option A: Using GitHub Web Interface

1. In your new repository, click "uploading an existing file"
2. Drag and drop all files from the `sizegenetics-website` folder
3. Write a commit message like "Initial website setup"
4. Click "Commit changes"

### Option B: Using Git Command Line

```bash
git clone https://github.com/YOUR_USERNAME/sizegenetics-website.git
cd sizegenetics-website
# Copy all files from the project folder here
git add .
git commit -m "Initial website setup"
git push origin main
```

## Step 3: Set Up GitHub Secrets

1. In your GitHub repository, click "Settings" tab
2. In the left sidebar, click "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secret:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
5. Click "Add secret"

## Step 4: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sign in or create a free account
3. Click "Workers & Pages" in the left sidebar
4. Click "Create application"
5. Select the "Pages" tab
6. Click "Connect to Git"

### Connect Your Repository

1. Click "Connect GitHub" and authorize Cloudflare
2. Select your repository (`sizegenetics-website`)
3. Click "Begin setup"

### Configure Build Settings

1. **Project name**: `sizegenetics-hub` (or your preferred name)
2. **Production branch**: `main`
3. **Build command**: Leave empty (we're using static files)
4. **Build output directory**: `src`
5. **Root directory**: Leave empty

### Environment Variables (Optional)

If you want to use environment variables in your build:
1. Click "Add variable"
2. Add any custom variables you need

### Deploy

1. Click "Save and Deploy"
2. Wait for the deployment to complete (usually 1-2 minutes)
3. Your website will be available at a URL like `https://sizegenetics-hub.pages.dev`

## Step 5: Set Up Custom Domain (Optional)

1. In your Cloudflare Pages project dashboard
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain name
5. Follow the DNS configuration instructions

## Step 6: Verify Automated Content Generation

1. Go to your GitHub repository
2. Click "Actions" tab
3. You should see the "Generate Content" workflow
4. The workflow will run automatically daily at 9 AM UTC
5. You can also trigger it manually by clicking "Run workflow"

## Step 7: Test Your Website

1. Visit your Cloudflare Pages URL
2. Verify the website loads correctly
3. Check that the generated article is displayed
4. Test the article page by clicking "Read More"
5. Verify mobile responsiveness

## Automatic Updates

Your website will now:
- Generate new content daily at 9 AM UTC
- Automatically commit new articles to GitHub
- Trigger automatic redeployment on Cloudflare Pages
- Keep the latest 20 articles

## Monitoring and Maintenance

### Check Content Generation

1. Monitor GitHub Actions for successful runs
2. Check your repository for new commits
3. Verify new articles appear on your website

### Monitor API Usage

1. Check your Openrouter dashboard for API usage
2. Monitor for any rate limiting or errors
3. Ensure you have sufficient API credits

### Performance Monitoring

1. Use Cloudflare Analytics to monitor traffic
2. Check page load speeds and performance
3. Monitor for any errors or issues

## Troubleshooting

### Common Issues

**Content not generating:**
- Check GitHub Actions logs
- Verify API key is correct
- Check Openrouter API status

**Deployment failures:**
- Check Cloudflare Pages build logs
- Verify repository permissions
- Check file structure

**Website not loading:**
- Check DNS settings
- Verify Cloudflare Pages status
- Check for any configuration errors

### Getting Help

- **Cloudflare Pages**: [Documentation](https://developers.cloudflare.com/pages/)
- **GitHub Actions**: [Documentation](https://docs.github.com/en/actions)
- **Openrouter API**: [Documentation](https://openrouter.ai/docs)

## Security Best Practices

1. Never commit API keys to your repository
2. Use GitHub Secrets for sensitive data
3. Regularly rotate API keys
4. Monitor for unauthorized access
5. Keep dependencies updated

## Cost Considerations

- **Cloudflare Pages**: Free tier includes unlimited sites and bandwidth
- **GitHub**: Free for public repositories
- **Openrouter API**: Using free tier model to minimize costs
- **Total monthly cost**: Essentially free with current setup

## Next Steps

After successful deployment:
1. Share your website URL
2. Monitor content generation
3. Consider adding analytics
4. Customize styling if needed
5. Add more content topics
6. Consider upgrading to paid tiers for additional features

Your SizeGenetics auto-content website is now live and will automatically generate and publish new content daily!

