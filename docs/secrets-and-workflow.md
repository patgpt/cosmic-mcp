# Secrets and Workflow Setup Guide

This guide walks you through setting up GitHub secrets and configuring the CI/CD workflows for the Cosmic MCP project.

## 🔐 GitHub Secrets Setup

### Required Secrets

Your repository needs the following secrets for automated workflows:

#### 1. NPM Publishing Secrets

| Secret Name | Description                             | How to Get                                            |
| ----------- | --------------------------------------- | ----------------------------------------------------- |
| `NPM_TOKEN` | NPM authentication token for publishing | [Create NPM Access Token](#creating-npm-access-token) |

#### 2. Code Quality Secrets (Optional)

| Secret Name     | Description                       | How to Get                               |
| --------------- | --------------------------------- | ---------------------------------------- |
| `CODECOV_TOKEN` | Token for code coverage reporting | [Get Codecov Token](#setting-up-codecov) |

### Creating NPM Access Token

1. **Login to NPM**

   ```bash
   npm login
   ```

2. **Create Access Token**
   - Go to [npmjs.com](https://www.npmjs.com/) and login
   - Click on your profile → "Access Tokens"
   - Click "Generate New Token"
   - Choose "Automation" type for CI/CD
   - Copy the generated token

3. **Add to GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your NPM token
   - Click "Add secret"

### Setting Up Codecov

1. **Sign up for Codecov**
   - Go to [codecov.io](https://codecov.io/)
   - Sign in with your GitHub account
   - Add your repository

2. **Get Repository Token**
   - In Codecov dashboard, go to your repository
   - Copy the repository token

3. **Add to GitHub Secrets**
   - Name: `CODECOV_TOKEN`
   - Value: Paste your Codecov token

## 🔧 Workflow Configuration

### Current Workflows

The project includes three main workflows:

#### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**

- Runs tests across Node.js 18.x and 20.x
- Performs linting and type checking
- Generates code coverage reports
- Uploads coverage to Codecov

**Configuration:**

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

#### 2. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**

- Push to `main` branch (excluding commits with 'skip ci')

**What it does:**

- Automatically determines version bump based on commit messages
- Updates CHANGELOG.md
- Creates GitHub release
- Publishes to NPM
- Commits version changes back to repository

**Configuration:**

```yaml
name: Release
on:
  push:
    branches:
      - main
```

#### 3. Code Quality Workflow (`.github/workflows/code-quality.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Weekly schedule (Mondays at 9 AM UTC)

**What it does:**

- Security audits
- Dependency vulnerability scanning
- Code analysis
- Performance monitoring

## 📝 Commit Message Convention

The release workflow uses **Conventional Commits** to automatically determine version bumps:

### Commit Types

| Type        | Description           | Version Bump  |
| ----------- | --------------------- | ------------- |
| `feat:`     | New feature           | Minor (1.1.0) |
| `fix:`      | Bug fix               | Patch (1.0.1) |
| `docs:`     | Documentation changes | Patch (1.0.1) |
| `style:`    | Code style changes    | Patch (1.0.1) |
| `refactor:` | Code refactoring      | Patch (1.0.1) |
| `test:`     | Adding tests          | Patch (1.0.1) |
| `chore:`    | Maintenance tasks     | Patch (1.0.1) |

### Breaking Changes

Add `BREAKING CHANGE:` in the commit body or `!` after type for major version bump:

```
feat!: redesign API interface

BREAKING CHANGE: The API now uses different parameter names
```

### Examples

```bash
# Minor version bump (new feature)
git commit -m "feat: add new search functionality to MCP tools"

# Patch version bump (bug fix)
git commit -m "fix: resolve connection timeout in Cosmic client"

# Major version bump (breaking change)
git commit -m "feat!: change MCP tool parameter structure"

# No version bump (documentation)
git commit -m "docs: update API examples in README"
```

## 🚀 Release Process

### Automatic Releases

1. **Make Changes**
   - Create feature branch: `git checkout -b feat/new-feature`
   - Make your changes
   - Commit with conventional commit messages

2. **Create Pull Request**
   - Push branch: `git push origin feat/new-feature`
   - Create PR to `main` branch
   - CI workflow runs automatically

3. **Merge to Main**
   - Once PR is approved and merged
   - Release workflow triggers automatically
   - Version is bumped based on commit messages
   - Package is published to NPM
   - GitHub release is created

### Manual Release (if needed)

If you need to trigger a release manually:

1. **Update Version**

   ```bash
   npm version patch  # or minor, major
   ```

2. **Push Changes**

   ```bash
   git push origin main --tags
   ```

3. **Publish to NPM**
   ```bash
   npm publish
   ```

## 🔍 Monitoring Workflows

### Viewing Workflow Status

1. **GitHub Actions Tab**
   - Go to your repository on GitHub
   - Click "Actions" tab
   - View running/completed workflows

2. **Status Badges**
   - Check README.md for status badges
   - Green = passing, Red = failing

### Common Issues and Solutions

#### NPM Publish Fails

**Error:** `403 Forbidden`
**Solution:**

- Check NPM_TOKEN is valid
- Ensure you have publish permissions
- Verify package name is available

#### Tests Fail

**Error:** Test failures in CI
**Solution:**

- Run tests locally: `bun test`
- Fix failing tests
- Commit and push fixes

#### Build Fails

**Error:** Build errors in CI
**Solution:**

- Run build locally: `bun run build`
- Fix TypeScript errors
- Commit and push fixes

## 📊 Workflow Optimization

### Performance Tips

1. **Cache Dependencies**
   - Workflows already include dependency caching
   - Reduces build times significantly

2. **Parallel Jobs**
   - Tests run on multiple Node.js versions in parallel
   - Faster feedback on compatibility

3. **Conditional Execution**
   - Release only runs on main branch
   - Code quality runs on schedule to avoid overload

### Security Best Practices

1. **Secrets Management**
   - Never commit secrets to repository
   - Use GitHub Secrets for sensitive data
   - Rotate tokens regularly

2. **Dependency Security**
   - Dependabot automatically updates dependencies
   - Security audit runs weekly
   - Vulnerability scanning on PRs

3. **Access Control**
   - Limit who can modify workflows
   - Require PR reviews for main branch
   - Use branch protection rules

## 🛠️ Customizing Workflows

### Adding New Workflows

1. **Create Workflow File**

   ```bash
   touch .github/workflows/my-workflow.yml
   ```

2. **Basic Structure**

   ```yaml
   name: My Workflow
   on:
     push:
       branches: [main]

   jobs:
     my-job:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Setup Bun
           uses: oven-sh/setup-bun@v1
         - name: Install dependencies
           run: bun install
         - name: Run my task
           run: bun run my-task
   ```

### Modifying Existing Workflows

1. **Edit Workflow Files**
   - Located in `.github/workflows/`
   - Use YAML syntax
   - Test changes in feature branch first

2. **Common Modifications**
   - Add new test commands
   - Change trigger conditions
   - Add deployment steps
   - Modify notification settings

## 📋 Checklist for New Repository

- [ ] Set up NPM_TOKEN secret
- [ ] Configure Codecov (optional)
- [ ] Enable branch protection on main
- [ ] Set up Dependabot alerts
- [ ] Test CI workflow with dummy commit
- [ ] Verify release workflow works
- [ ] Update README badges
- [ ] Configure notification preferences

## 🆘 Getting Help

### Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Publishing Guide](https://docs.npmjs.com/publishing-packages)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

### Common Commands

```bash
# Check workflow status
gh workflow list

# View workflow runs
gh run list

# Download workflow logs
gh run download <run-id>

# Trigger workflow manually
gh workflow run ci.yml
```

---

## 🎯 Next Steps

1. **Set up secrets** following the guide above
2. **Test the workflows** with a sample commit
3. **Configure branch protection** rules
4. **Set up monitoring** and notifications
5. **Customize workflows** for your specific needs

The automated workflows will handle versioning, testing, and publishing, allowing you to focus on developing features and improving the Cosmic MCP server!
