# Deployment Guide

This guide explains how to deploy the Hierarchical Table application to GitHub Pages.

## 📋 Prerequisites

- GitHub repository with the project code
- Node.js installed locally (v16 or higher)
- npm installed
- Push access to the repository

## 🚀 Deployment Methods

### Method 1: Automated Deployment with GitHub Actions (Recommended)

This method automatically deploys your application whenever you push to the `main` branch.

#### Setup Steps

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select **"GitHub Actions"**
   - Save the changes

2. **Push Your Code**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for Deployment**
   - Go to the "Actions" tab in your repository
   - Watch the deployment workflow run
   - Once complete, your site will be live!

4. **Access Your Site**
   - Your site will be available at: `https://<username>.github.io/HierarchicalTable/`
   - The URL will also be shown in the Actions workflow output

#### Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- Can also be triggered manually from the Actions tab
- Installs dependencies with `npm ci`
- Builds the project with `npm run build`
- Deploys the `dist` folder to GitHub Pages
- Runs on Ubuntu latest with Node.js 20

#### Troubleshooting

**Issue**: Workflow fails with permissions error
- **Solution**: Go to Settings → Actions → General → Workflow permissions
- Select "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"
- Save

**Issue**: 404 error when accessing the site
- **Solution**: Make sure the `base` path in `vite.config.ts` matches your repository name
- Current setting: `base: '/HierarchicalTable/'`
- If your repo name is different, update this value

**Issue**: Blank page or resources not loading
- **Solution**: Check browser console for errors
- Ensure all assets are using relative paths
- Verify the `.nojekyll` file exists in the `public` folder

### Method 2: Manual Deployment with gh-pages

This method allows you to deploy manually using the gh-pages npm package.

#### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build and Deploy**
   ```bash
   npm run deploy
   ```

   This command will:
   - Run `npm run build` to create production build
   - Deploy the `dist` folder to the `gh-pages` branch
   - Push the branch to GitHub

3. **Configure GitHub Pages**
   - Go to Settings → Pages
   - Under "Source", select **"Deploy from a branch"**
   - Select the **`gh-pages`** branch
   - Select **`/ (root)`** as the folder
   - Save the changes

4. **Access Your Site**
   - Your site will be available at: `https://<username>.github.io/HierarchicalTable/`
   - It may take a few minutes for the changes to appear

#### Manual Deployment Advantages
- Full control over when deployment happens
- Can deploy from any branch
- Useful for testing before pushing to main
- No need to configure GitHub Actions

#### Manual Deployment Commands

```bash
# Deploy to gh-pages branch
npm run deploy

# Build without deploying (for testing)
npm run build

# Preview production build locally
npm run build
npm run preview
```

## 🔧 Configuration Files

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/HierarchicalTable/', // Important: Must match your repo name
})
```

**Key Points:**
- `base` must match your GitHub repository name
- Ensures all assets load with correct paths
- Format: `/repository-name/`

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Key Points:**
- `predeploy` automatically runs before `deploy`
- `deploy` pushes the `dist` folder to `gh-pages` branch
- `-d dist` specifies the distribution folder

### .github/workflows/deploy.yml
The GitHub Actions workflow file that automates deployment.

**Key Features:**
- Triggers on push to `main` branch
- Manual trigger option (workflow_dispatch)
- Builds and deploys automatically
- Proper permissions configured

## 🌐 Custom Domain (Optional)

If you want to use a custom domain:

1. **Add CNAME File**
   Create a `CNAME` file in the `public` folder:
   ```
   your-domain.com
   ```

2. **Configure DNS**
   Add these DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

   Or for subdomain:
   ```
   Type: CNAME
   Name: www (or your subdomain)
   Value: <username>.github.io
   ```

3. **Update GitHub Pages Settings**
   - Go to Settings → Pages
   - Enter your custom domain
   - Check "Enforce HTTPS"
   - Save

4. **Update vite.config.ts**
   ```typescript
   base: '/', // For custom domain
   ```

## 🧪 Testing Deployment Locally

Before deploying, test the production build locally:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

This will:
1. Create a production build in the `dist` folder
2. Start a local server to preview the build
3. Open your browser to test the application

**Important**: The preview server will serve at the root path (`/`), not the repository path (`/HierarchicalTable/`). To test with the correct base path, you may need to:

```bash
# Build the project
npm run build

# Serve the dist folder with a static server
npx serve dist
```

Then manually navigate to `http://localhost:3000/HierarchicalTable/`

## 📊 Monitoring Deployments

### GitHub Actions
- Go to the **Actions** tab in your repository
- View deployment history and status
- Click on any workflow run to see details
- Check logs for troubleshooting

### GitHub Pages
- Go to Settings → Pages
- See deployment status and live URL
- View deployment history
- Check custom domain status

## 🔄 Updating the Deployment

### For Automated Deployment
Simply push your changes to the `main` branch:
```bash
git add .
git commit -m "Update feature X"
git push origin main
```

The deployment will happen automatically!

### For Manual Deployment
Run the deploy command:
```bash
npm run deploy
```

## 🆘 Common Issues

### Issue: Blank page after deployment
**Causes:**
- Incorrect `base` path in `vite.config.ts`
- Resources not loading due to path issues
- JavaScript errors

**Solutions:**
1. Check browser console for errors
2. Verify `base` matches repository name: `/HierarchicalTable/`
3. Ensure `.nojekyll` file exists in `public` folder
4. Clear browser cache and hard refresh

### Issue: 404 on page refresh
**Causes:**
- Single Page Application routing
- GitHub Pages serves only the root `index.html`

**Solutions:**
1. Use hash routing instead of browser routing
2. Add a custom 404.html that redirects to index.html
3. For hash routing, update your router configuration

### Issue: CSS/JS files not loading
**Causes:**
- Incorrect asset paths
- Missing base path configuration

**Solutions:**
1. Verify `base: '/HierarchicalTable/'` in vite.config.ts
2. Check that assets use relative paths
3. Clear browser cache

### Issue: Deployment workflow fails
**Causes:**
- Insufficient permissions
- Build errors
- Missing dependencies

**Solutions:**
1. Check workflow permissions in Settings → Actions
2. Review error logs in Actions tab
3. Ensure all dependencies are in package.json
4. Test build locally: `npm run build`

### Issue: Old version is still showing
**Causes:**
- Browser cache
- GitHub Pages cache
- CDN cache

**Solutions:**
1. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Wait a few minutes for GitHub Pages cache to clear
4. Check the deployment timestamp in Actions

## 🎯 Best Practices

1. **Always test locally before deploying**
   ```bash
   npm run build
   npm run preview
   ```

2. **Use automated deployment for production**
   - Push to main triggers automatic deployment
   - Consistent and reliable process

3. **Use manual deployment for testing**
   - Deploy to gh-pages branch from feature branches
   - Test changes before merging to main

4. **Monitor deployments**
   - Check Actions tab for workflow status
   - Review deployment logs for issues
   - Test live site after each deployment

5. **Keep dependencies updated**
   ```bash
   npm update
   npm audit fix
   ```

6. **Version your deployments**
   - Use git tags for releases
   - Keep changelog updated
   - Document breaking changes

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [gh-pages Package](https://github.com/tpope/gh-pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Support

If you encounter issues:
1. Check this guide for solutions
2. Review GitHub Actions logs
3. Check browser console for errors
4. Create an issue in the repository with:
   - Error messages
   - Steps to reproduce
   - Browser and OS information
   - Screenshots if applicable

---

**Happy Deploying! 🚀**

