# Getting Started

Welcome to the Cosmic MCP Server! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Cosmic.js account and bucket
- Your Cosmic API credentials

## Installation

### Via NPX (Recommended)

The easiest way to get started is using npx:

```bash
npx -y cosmic-mcp
```

### Via NPM

You can also install the package globally:

```bash
npm install -g cosmic-mcp
cosmic-mcp
```

## Configuration

Create a `.env` file in your project directory with your Cosmic credentials:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

## First Steps

1. **Test the connection**: Run the server and verify it connects to your Cosmic bucket
2. **Explore the tools**: Use the MCP client to see available tools
3. **Try some examples**: Check out the [AI Assistant Prompts](./ai-prompts.md) for inspiration

## Next Steps

- [Configure your MCP client](./mcp-setup.md)
- [Explore the Tools API](./tools-reference.md)
- [Set up automated workflows](./secrets-and-workflow.md)

## Need Help?

- Check the [Tools Reference](./tools-reference.md) for detailed API documentation
- Review the [AI Prompts](./ai-prompts.md) for usage examples
- Visit the [GitHub repository](https://github.com/patgpt/cosmic-mcp) for issues and discussions
