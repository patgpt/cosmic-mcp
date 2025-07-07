# MCP Client Setup

This guide shows you how to configure the Cosmic MCP Server with various MCP-compatible clients.

## Prerequisites

Before setting up the MCP server with any client, you'll need:

1. **Cosmic Account**: Sign up at [cosmicjs.com](https://www.cosmicjs.com/)
2. **Cosmic Bucket**: Create a bucket and note down your credentials
3. **API Keys**: Get your Read and Write keys from Bucket Settings → API Keys

## VS Code (Claude Dev Extension)

### Installation

1. Install the [Claude Dev extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) from the VS Code marketplace
2. Configure the MCP server in your VS Code settings

### Configuration

Add this configuration to your VS Code settings JSON (`settings.json`):

```json
{
  "mcp": {
    "servers": {
      "Cosmic": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "cosmic-mcp"],
        "env": {
          "COSMIC_BUCKET_SLUG": "your-bucket-slug",
          "COSMIC_READ_KEY": "your-read-key",
          "COSMIC_WRITE_KEY": "your-write-key",
          "DEBUG": "false"
        }
      }
    }
  }
}
```

### Usage

1. Open the Command Palette (`Cmd/Ctrl + Shift + P`)
2. Run "Claude Dev: Start New Chat"
3. The Cosmic MCP tools will be available in your conversation

## Cursor

### Configuration

Create or update the `.cursor/mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "Cosmic": {
      "command": "npx",
      "args": ["-y", "cosmic-mcp"],
      "env": {
        "COSMIC_BUCKET_SLUG": "your-bucket-slug",
        "COSMIC_READ_KEY": "your-read-key",
        "COSMIC_WRITE_KEY": "your-write-key",
        "DEBUG": "false"
      }
    }
  }
}
```

### Usage

1. Open Cursor
2. Start a new chat with Claude
3. The Cosmic MCP tools will be automatically available

## Local Development Setup

If you're developing locally or want to use a specific version of the MCP server:

### Building from Source

```bash
# Clone the repository
git clone https://github.com/patgpt/cosmic-mcp.git
cd cosmic-mcp

# Install dependencies
bun install

# Build the project
bun run build

# The server will be available at ./dist/server.js
```

### VS Code Configuration (Local)

```json
{
  "mcp": {
    "servers": {
      "Cosmic": {
        "type": "stdio",
        "command": "node",
        "args": ["/path/to/cosmic-mcp/dist/server.js"],
        "env": {
          "COSMIC_BUCKET_SLUG": "your-bucket-slug",
          "COSMIC_READ_KEY": "your-read-key",
          "COSMIC_WRITE_KEY": "your-write-key",
          "DEBUG": "true"
        }
      }
    }
  }
}
```

### Cursor Configuration (Local)

```json
{
  "mcpServers": {
    "Cosmic": {
      "command": "node",
      "args": ["/path/to/cosmic-mcp/dist/server.js"],
      "env": {
        "COSMIC_BUCKET_SLUG": "your-bucket-slug",
        "COSMIC_READ_KEY": "your-read-key",
        "COSMIC_WRITE_KEY": "your-write-key",
        "DEBUG": "true"
      }
    }
  }
}
```

## Environment Variables

| Variable             | Description                           | Required |
| -------------------- | ------------------------------------- | -------- |
| `COSMIC_BUCKET_SLUG` | Your Cosmic bucket slug               | Yes      |
| `COSMIC_READ_KEY`    | Your Cosmic read key                  | Yes      |
| `COSMIC_WRITE_KEY`   | Your Cosmic write key                 | Yes      |
| `DEBUG`              | Enable debug logging (`true`/`false`) | No       |

## Troubleshooting

### Common Issues

**Server not starting:**

- Ensure all environment variables are set correctly
- Check that your Cosmic API keys are valid
- Verify network connectivity to Cosmic API

**Tools not appearing:**

- Restart your MCP client
- Check the client logs for error messages
- Verify the MCP server configuration syntax

**Permission errors:**

- Ensure your Cosmic Write Key has the necessary permissions
- Check that your bucket exists and is accessible

### Debug Mode

Enable debug mode by setting `DEBUG=true` in your environment variables. This will provide detailed logging information to help diagnose issues.

### Logs

Check the following locations for logs:

- **VS Code**: Open the Output panel and select "Claude Dev"
- **Cursor**: Check the developer console (`Cmd/Ctrl + Shift + I`)
- **Server logs**: Available in the terminal when running locally

## Next Steps

Once you have the MCP server configured:

1. [Explore the available tools](/tools/)
2. [Learn about configuration options](/configuration)
3. [Check out the API documentation](/tools/objects)

## Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [GitHub issues](https://github.com/patgpt/cosmic-mcp/issues)
3. Create a new issue with detailed information about your setup
