# Contributing to Cosmic MCP Server

Thank you for your interest in contributing to the Cosmic MCP Server! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A [Cosmic](https://www.cosmicjs.com/) account and bucket for testing

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/cosmic-mcp.git
   cd cosmic-mcp
   ```

3. **Install dependencies**:

   ```bash
   bun install
   ```

4. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Fill in your Cosmic bucket credentials in the `.env` file.

5. **Build the project**:

   ```bash
   bun run build
   ```

6. **Run tests** to ensure everything is working:
   ```bash
   bun test
   ```

## 🏗️ Project Structure

```
cosmic-mcp/
├── src/
│   ├── config.ts          # Configuration management
│   ├── server.ts          # Main MCP server
│   ├── manifest.ts        # Tool definitions
│   ├── validation.ts      # Input validation schemas
│   ├── errors/            # Custom error classes
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic layer
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── docs/                  # VitePress documentation
└── dist/                  # Built output
```

## 📝 Code Standards

### TypeScript Guidelines

- **Strict typing**: Use TypeScript's strict mode and avoid `any` types
- **Interface over types**: Prefer interfaces for object shapes
- **Explicit return types**: Always specify return types for functions
- **Null safety**: Use optional chaining and nullish coalescing

### Code Style

- **Formatting**: Use Prettier for consistent formatting
- **Linting**: Follow ESLint rules defined in the project
- **Naming conventions**:
  - Variables and functions: `camelCase`
  - Classes and interfaces: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case.ts`

### Architecture Principles

- **Three-layer architecture**: Repository → Service → Server
- **Dependency injection**: Use constructor injection for dependencies
- **Error handling**: Use custom error classes and proper error propagation
- **Logging**: Use the centralized logger for all logging needs
- **Validation**: Validate all inputs using Zod schemas

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

### Test Guidelines

- **Test structure**: Follow the AAA pattern (Arrange, Act, Assert)
- **Test naming**: Use descriptive test names that explain the scenario
- **Mock external dependencies**: Mock Cosmic API calls and external services
- **Test coverage**: Aim for high test coverage, especially for business logic
- **Integration tests**: Include tests that verify the full request-response cycle

### Writing Tests

```typescript
describe('ObjectService', () => {
  describe('getObject', () => {
    it('should return object when valid ID is provided', async () => {
      // Arrange
      const mockObject = { id: '123', title: 'Test Object' };
      const mockRepository = {
        getObject: jest.fn().mockResolvedValue(mockObject),
      };
      const service = new ObjectService(mockRepository);

      // Act
      const result = await service.getObject('123');

      // Assert
      expect(result).toEqual(mockObject);
      expect(mockRepository.getObject).toHaveBeenCalledWith('123');
    });
  });
});
```

## 🔧 Development Workflow

### Branch Naming

- **Feature branches**: `feat/description-of-feature`
- **Bug fixes**: `fix/description-of-bug`
- **Documentation**: `docs/description-of-change`
- **Refactoring**: `refactor/description-of-refactor`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(objects): add support for object metadata filtering
fix(validation): handle null values in object creation
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the code standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the test suite** and ensure all tests pass
6. **Build the project** and verify it works
7. **Create a pull request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots or examples if applicable
   - Checklist of changes made

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Tests added for new functionality
- [ ] All tests pass
- [ ] Documentation updated if needed
- [ ] No breaking changes (or clearly documented)

## 📚 Documentation

### Code Documentation

- **JSDoc comments**: Use JSDoc for all public APIs
- **README updates**: Update README.md for significant changes
- **Type definitions**: Keep TypeScript definitions up to date

### VitePress Documentation

The project uses VitePress for documentation. To work on docs:

```bash
# Start the docs development server
bun run docs:dev

# Build the documentation
bun run docs:build
```

## 🚀 Release Process

### Version Bumping

The project uses automated version bumping through GitHub Actions. Versions are determined by commit messages:

- `feat:` → Minor version bump (1.0.0 → 1.1.0)
- `fix:` → Patch version bump (1.0.0 → 1.0.1)
- `feat!:` or `BREAKING CHANGE:` → Major version bump (1.0.0 → 2.0.0)

### Release Workflow

1. **Merge to main**: All changes go through pull requests to main
2. **Automated testing**: CI runs tests on all pull requests
3. **Version bump**: Semantic versioning based on commit messages
4. **Release creation**: Automated release notes and GitHub release
5. **NPM publishing**: Automatic publishing to npm registry

## 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Node version, etc.)
- **Error messages** and stack traces
- **Minimal reproduction** if possible

## 💡 Feature Requests

For feature requests, please:

- **Search existing issues** to avoid duplicates
- **Describe the use case** and problem being solved
- **Propose a solution** if you have ideas
- **Consider the scope** and impact on existing functionality

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the docs for detailed information

## 🏆 Recognition

Contributors are recognized in:

- **Release notes**: Significant contributions mentioned in releases
- **README**: Contributors section (coming soon)
- **GitHub**: Contributor graphs and statistics

Thank you for contributing to the Cosmic MCP Server! 🎉
