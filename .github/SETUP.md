# GitHub Actions CI/CD Setup Guide

Quick guide to get your CI/CD pipelines up and running.

## 🚀 Quick Setup (5 minutes)

### 1. Repository Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name | Value | Description |
|-------------|--------|-------------|
| `DOCKER_USERNAME` | `your-dockerhub-username` | Your Docker Hub username |
| `DOCKER_PASSWORD` | `your-dockerhub-token` | Docker Hub access token (recommended) or password |

### 2. Docker Hub Setup

1. Create a Docker Hub account at [hub.docker.com](https://hub.docker.com)
2. Create a repository named `acquisitions` (or match your GitHub repo name)
3. Generate an access token:
   - Go to Account Settings → Security → Access Tokens
   - Create new token with Read/Write/Delete permissions
   - Use this token as `DOCKER_PASSWORD` secret

### 3. Verify Workflows

Push any change to trigger the workflows:

```bash
git add .
git commit -m "feat: setup CI/CD pipelines"
git push origin main
```

## 📋 Workflow Status

After pushing, check the **Actions** tab in your GitHub repository:

### Expected Workflows:
- ✅ **Lint and Format** - Code quality checks
- ✅ **Tests** - Test execution with coverage
- 🐳 **Docker Build and Push** - Container builds (main branch only)

## 🔧 Local Testing

Before pushing, test locally:

```bash
# Check code quality
npm run lint
npm run format:check

# Run tests
npm test

# Test Docker build
docker build -t test-image .
```

## 📝 Next Steps

1. **Branch Protection**: Set up branch protection rules
2. **Notifications**: Configure workflow failure notifications  
3. **Coverage**: Review test coverage reports in artifacts
4. **Docker**: Check your images on Docker Hub

## 🆘 Troubleshooting

### Workflows not running?
- Check if workflows are in `.github/workflows/` directory
- Verify branch names match (`main`, `staging`)

### Docker build failing?
- Verify Docker Hub secrets are set correctly
- Check if Docker Hub repository exists
- Test build locally first

### Tests failing?
- Ensure all dependencies are in `package.json`
- Check if database migrations are working
- Test locally with `npm test`

## 📚 Documentation

For detailed information, see:
- [CI/CD.md](../CI_CD.md) - Complete pipeline documentation
- [DOCKER.md](../DOCKER.md) - Docker setup and usage
- [API_TESTING.md](../API_TESTING.md) - API testing guide

## ✨ Features Included

- 🔧 **Code Quality**: ESLint + Prettier
- 🧪 **Testing**: Jest with coverage reports
- 🐳 **Docker**: Multi-platform builds (amd64/arm64)
- 📊 **Reporting**: Step summaries and PR comments
- 🔒 **Security**: Container vulnerability scanning
- 🚀 **Deployment**: Automated Docker Hub publishing

Your CI/CD pipeline is now ready! 🎉