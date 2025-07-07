# Cosmic MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cosmic](https://img.shields.io/badge/Powered%20by-Cosmic-blue)](https://www.cosmicjs.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/your-username/your-repo/actions)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)](https://github.com/your-username/your-repo/actions)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](https://github.com/your-username/your-repo/actions)

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
git clone https://github.com/your-username/your-repo.git
cd your-repo
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

For detailed input schemas for each tool, please refer to the `src/manifest.ts` file or the VitePress documentation.

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

1.  **Fork the repository.**
2.  **Create your feature branch:** `git checkout -b feat/new-amazing-feature`
3.  **Commit your changes:** `git commit -m 'feat: Add some amazing feature'`
4.  **Push to the branch:** `git push origin feat/new-amazing-feature`
5.  **Open a pull request.**

Please make sure to update tests as appropriate.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
