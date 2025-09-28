# CI/CD Pipeline Documentation

This document describes the GitHub Actions CI/CD pipelines for the Acquisitions API project.

## Overview

The project uses three main GitHub Actions workflows to ensure code quality, run tests, and build/deploy Docker images:

1. **🔧 Lint and Format** - Code quality checks
2. **🧪 Tests** - Automated testing with coverage
3. **🐳 Docker Build and Push** - Container builds and deployment

## Workflows

### 1. Lint and Format (`lint-and-format.yml`)

**Triggers:**
- Push to `main` or `staging` branches
- Pull requests to `main` or `staging` branches

**Features:**
- ✅ Node.js 20.x with npm caching
- ✅ ESLint code quality checks
- ✅ Prettier formatting validation
- ✅ Clear error annotations with fix suggestions
- ✅ Step-by-step summaries with actionable guidance

**What it does:**
1. Installs dependencies with `npm ci`
2. Runs ESLint (`npm run lint`)
3. Runs Prettier check (`npm run format:check`)
4. Provides fix suggestions if issues are found
5. Creates annotations for easy problem identification

**Fix commands suggested:**
```bash
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Auto-format with Prettier
```

### 2. Tests (`tests.yml`)

**Triggers:**
- Push to `main` or `staging` branches
- Pull requests to `main` or `staging` branches

**Features:**
- ✅ Node.js 20.x with npm caching
- ✅ PostgreSQL 15 test database
- ✅ Environment variables setup
- ✅ Database migrations
- ✅ Coverage reporting
- ✅ Test failure annotations
- ✅ PR comments with results

**Environment Variables:**
- `NODE_ENV=test`
- `NODE_OPTIONS=--experimental-vm-modules`
- `DATABASE_URL=postgres://test:test@localhost:5432/acquisitions_test`
- `JWT_SECRET=test-jwt-secret-key-for-testing`

**What it does:**
1. Sets up PostgreSQL test database
2. Installs dependencies and runs migrations
3. Executes tests with coverage (`npm run test:coverage`)
4. Uploads coverage reports as artifacts (30-day retention)
5. Creates detailed summaries and PR comments
6. Annotates test failures for easy debugging

### 3. Docker Build and Push (`docker-build-and-push.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger via `workflow_dispatch`

**Features:**
- ✅ Multi-platform builds (linux/amd64, linux/arm64)
- ✅ Docker Hub integration
- ✅ Automated tagging with metadata
- ✅ Build caching for efficiency
- ✅ Security scanning
- ✅ Deployment tracking

**Generated Tags:**
- `latest` - For main branch
- `main` - Branch name
- `main-abc1234` - Branch with short commit SHA
- `prod-YYYYMMDD-HHmmss` - Production timestamp
- Custom suffix (if provided via workflow_dispatch)

**What it does:**
1. Sets up Docker Buildx for multi-platform builds
2. Logs into Docker Hub using secrets
3. Extracts metadata and generates tags
4. Builds and pushes production image
5. Updates Docker Hub description
6. Runs security scans
7. Creates deployment records

## Required Secrets

Configure these secrets in your GitHub repository settings:

### Docker Hub Secrets
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token

## Setup Instructions

### 1. Repository Secrets

Go to your repository → Settings → Secrets and variables → Actions → Repository secrets:

```
DOCKER_USERNAME = your-dockerhub-username
DOCKER_PASSWORD = your-dockerhub-password-or-token
```

### 2. Docker Hub Repository

Ensure your Docker Hub repository exists:
- Repository name should match your GitHub repository
- Example: `weebpapi/acquisitions`

### 3. Branch Protection (Optional)

Set up branch protection rules for `main` branch:
- Require status checks: `Lint and Format Code`, `Run Tests`
- Require up-to-date branches
- Require pull request reviews

## Workflow Status

### Success Indicators

**Lint and Format:**
- ✅ All ESLint rules pass
- ✅ Code is properly formatted with Prettier

**Tests:**
- ✅ All tests pass
- ✅ Coverage reports generated
- ✅ Database migrations successful

**Docker:**
- ✅ Multi-platform build successful
- ✅ Images pushed to Docker Hub
- ✅ Security scan passed

### Failure Scenarios

**Common Lint/Format Issues:**
```bash
# Fix ESLint issues
npm run lint:fix

# Fix formatting
npm run format
```

**Common Test Issues:**
```bash
# Run tests locally
npm test

# Check database connection
npm run db:migrate
```

**Common Docker Issues:**
```bash
# Test build locally
docker build -t test-image .

# Check secrets configuration
# Verify DOCKER_USERNAME and DOCKER_PASSWORD
```

## Monitoring and Notifications

### GitHub Actions Tab
- View workflow runs and logs
- Download artifacts (coverage reports)
- Monitor build times and success rates

### Step Summaries
Each workflow generates detailed summaries:
- Success/failure status
- Coverage information (tests)
- Image tags and usage instructions (docker)
- Troubleshooting guidance

### PR Comments
Test workflow automatically comments on PRs with:
- Test results
- Coverage percentages
- Links to detailed reports

## Local Development

### Running Checks Locally

Before pushing, run these commands locally:

```bash
# Install dependencies
npm ci

# Check code quality
npm run lint
npm run format:check

# Run tests
npm test

# Build Docker image
docker build -t acquisitions-local .
```

### Pre-commit Hooks (Recommended)

Consider setting up pre-commit hooks to run checks automatically:

```bash
# Install husky for Git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run format:check"
```

## Artifacts and Reports

### Test Coverage Reports
- **Location:** Workflow artifacts
- **Retention:** 30 days
- **Format:** HTML, LCOV, JSON
- **Download:** From GitHub Actions workflow run page

### Docker Images
- **Registry:** Docker Hub
- **Repository:** `docker.io/{username}/{repository}`
- **Retention:** Based on Docker Hub plan
- **Platforms:** linux/amd64, linux/arm64

## Advanced Configuration

### Custom Tags

Use workflow_dispatch to create custom tags:

1. Go to Actions → Docker Build and Push
2. Click "Run workflow"
3. Enter custom suffix (optional)
4. Run workflow

### Environment-specific Builds

For staging/development builds, create additional workflows:

```yaml
# .github/workflows/docker-staging.yml
name: Docker Staging Build

on:
  push:
    branches: [staging]

# Similar to docker-build-and-push.yml but with staging-specific configs
```

### Integration with External Services

Add steps for external integrations:

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/staging'
  # Add deployment steps here
```

## Performance Optimization

### Cache Strategy
- **npm:** Cached by Node.js setup action
- **Docker:** GitHub Actions cache for layers
- **Dependencies:** Cached between runs

### Build Time Improvements
- Multi-stage Dockerfile for faster builds
- Buildx caching reduces rebuild time
- Parallel linting and formatting checks

## Troubleshooting

### Workflow Not Triggering
- Check branch names in workflow files
- Verify push/PR targets correct branches
- Ensure workflows are in `.github/workflows/`

### Permission Issues
- Check repository secrets are set correctly
- Verify Docker Hub credentials
- Ensure GitHub token has required permissions

### Build Failures
- Check logs in GitHub Actions tab
- Verify Dockerfile syntax
- Test builds locally first

### Test Database Issues
- PostgreSQL service may need more time to start
- Check DATABASE_URL format
- Verify migration files exist

## Best Practices

### Code Quality
- Always fix lint/format issues before merging
- Maintain high test coverage (aim for >80%)
- Write meaningful commit messages

### Security
- Use secrets for sensitive data
- Regularly update action versions
- Review security scan results

### Deployment
- Test Docker images locally before pushing
- Use semantic versioning for releases
- Monitor deployment success

## Support and Maintenance

### Updating Actions
Regularly update action versions in workflows:

```yaml
uses: actions/checkout@v4        # Keep up to date
uses: actions/setup-node@v4      # Check for new versions
uses: docker/build-push-action@v5  # Monitor releases
```

### Monitoring
- Set up notifications for workflow failures
- Review coverage trends over time
- Monitor Docker image sizes and security issues

This CI/CD setup ensures reliable, automated testing and deployment while maintaining code quality standards throughout the development lifecycle.