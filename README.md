# Cosmic MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cosmic](https://img.shields.io/badge/Powered%20by-Cosmic-blue)](https://www.cosmicjs.com/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/patgpt/cosmic-mcp/ci.yml?branch=main)](https://github.com/patgpt/cosmic-mcp/actions)
[![Tests](https://img.shields.io/github/actions/workflow/status/patgpt/cosmic-mcp/ci.yml?branch=main&label=tests)](https://github.com/patgpt/cosmic-mcp/actions)
[![Coverage](https://img.shields.io/codecov/c/github/patgpt/cosmic-mcp)](https://codecov.io/gh/patgpt/cosmic-mcp)
[![npm version](https://img.shields.io/npm/v/cosmic-mcp)](https://www.npmjs.com/package/cosmic-mcp)
[![npm downloads](https://img.shields.io/npm/dm/cosmic-mcp)](https://www.npmjs.com/package/cosmic-mcp)

A robust, production-ready [Model Context Protocol (MCP)](https://modelcontextprotocol.dev) server for interacting with the [Cosmic](https://www.cosmicjs.com/) headless CMS. This server provides a comprehensive set of tools for creating, reading, updating, and deleting objects, types, and media in your Cosmic bucket.

## ✨ Features

- **Comprehensive Toolset:** Full CRUD operations for Cosmic objects, object types, and media.
- **Robust Architecture:** Built with a clean, three-layer architecture (Server, Services, Repositories).
- **Strongly Typed:** Written in TypeScript with strict validation using Zod for all inputs.
- **Production-Ready:** Includes centralized logging, rate-limiting, and graceful error handling.
- **Easy to Configure:** Simple setup using a `.env` file for your Cosmic credentials.
- **Extensible:** Designed to be easily extended with new tools and services.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- A [Cosmic](https://www.cosmicjs.com/) account and bucket.

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/patgpt/cosmic-mcp.git
cd cosmic-mcp
bun install
```

### 2. Configuration

Copy the example environment file and fill in your Cosmic bucket credentials. You can find these in your Cosmic dashboard under _Bucket > Settings > API Keys_.

```bash
cp .env.example .env
```

Your `.env` file should look like this:

```dotenv
# .env
COSMIC_BUCKET_SLUG="your-bucket-slug"
COSMIC_READ_KEY="your-read-key"
COSMIC_WRITE_KEY="your-write-key"
DEBUG="false" # Set to "true" for verbose logging
```

### 3. Running the Server

Start the MCP server using the following command:

```bash
bun start
```

The server will connect and be ready to receive requests from any MCP-compatible client.

### 4. Using with MCP Clients

#### For VS Code (using Claude Dev extension)

Add this configuration to your VS Code settings or Claude Dev configuration:

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

#### For Cursor

Add this configuration to your `.cursor/mcp.json` file:

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

#### Alternative: Local Development

If you're developing locally or prefer to use the local version:

**For VS Code:**
```json
{
  "mcp": {
    "servers": {
      "Cosmic": {
        "type": "stdio",
        "command": "node",
        "args": ["path/to/cosmic-mcp/dist/server.js"],
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

**For Cursor:**
```json
{
  "mcpServers": {
    "Cosmic": {
      "command": "node",
      "args": ["path/to/cosmic-mcp/dist/server.js"],
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

> **Note:** Replace `your-bucket-slug`, `your-read-key`, and `your-write-key` with your actual Cosmic bucket credentials. You can find these in your Cosmic dashboard under _Bucket > Settings > API Keys_.

---

## 🛠️ Available Tools

This MCP server exposes the following tools. All tools are designed to be called by an AI agent or other MCP client.

| Tool Name           | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `list_objects`      | List objects, with optional filtering by type, status, and pagination. |
| `get_object`        | Get a specific object by its ID or by its slug and type.               |
| `create_object`     | Create a new object.                                                   |
| `update_object`     | Update an existing object.                                             |
| `delete_object`     | Delete an object.                                                      |
| `list_object_types` | List all available object types in the bucket.                         |
| `search_objects`    | Perform a text-based search across objects.                            |
| `upload_media`      | Upload a media file.                                                   |
| `list_media`        | List all media files, with pagination.                                 |
| `delete_media`      | Delete a media file by its ID.                                         |

For detailed input schemas for each tool, please refer to the [📚 Documentation](https://patgpt.github.io/cosmic-mcp/) or the `src/manifest.ts` file.

---

## 📚 Documentation

Comprehensive documentation is available at **[https://patgpt.github.io/cosmic-mcp/](https://patgpt.github.io/cosmic-mcp/)**

The documentation includes:

- **[Getting Started Guide](https://patgpt.github.io/cosmic-mcp/getting-started.html)** - Complete setup and installation instructions
- **[Configuration Reference](https://patgpt.github.io/cosmic-mcp/configuration.html)** - All configuration options and environment variables
- **[Tools API Documentation](https://patgpt.github.io/cosmic-mcp/tools/)** - Detailed reference for all available tools
- **[AI Assistant Prompts](https://patgpt.github.io/cosmic-mcp/ai-prompts.html)** - Example prompts for effective AI interaction
- **[MCP Client Setup](https://patgpt.github.io/cosmic-mcp/mcp-setup.html)** - Configuration for VS Code, Cursor, and other MCP clients

### Local Documentation

You can also run the documentation locally:

```bash
# Install dependencies
npm install

# Start the documentation server
npm run docs:dev

# Build the documentation
npm run docs:build
```

---

## 🧪 Running Tests

This project is set up with tests to ensure reliability.

```bash
# Run all tests
bun test
```

---

## 🤝 Contributing

Contributions are welcome! If you have a suggestion or find a bug, please open an issue to discuss it.

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to this project, including:

- Development setup and workflow
- Code style and standards
- Testing requirements
- Pull request process
- Release process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
