# Tools API Overview

The Cosmic MCP Server provides a comprehensive set of tools for interacting with your Cosmic.js headless CMS.

## Available Tools

### 📦 Object Management

- **`list_objects`** - List and filter objects from your bucket
- **`get_object`** - Retrieve a specific object by ID or slug
- **`create_object`** - Create new content objects
- **`update_object`** - Update existing objects
- **`delete_object`** - Remove objects from your bucket
- **`search_objects`** - Search through your content

### 🖼️ Media Management

- **`list_media`** - List media files in your bucket
- **`get_media`** - Get media file details
- **`upload_media`** - Upload new media files

### 🏗️ Type Management

- **`list_object_types`** - List all object types in your bucket
- **`get_object_type`** - Get details about a specific object type
- **`create_object_type`** - Create new object types

## Quick Start

1. **List your content**: Start by exploring what's in your bucket

   ```
   Use list_objects to see all your content
   ```

2. **Get specific content**: Retrieve individual items

   ```
   Use get_object with an ID or slug to get specific content
   ```

3. **Create new content**: Add new objects to your bucket
   ```
   Use create_object to add new blog posts, pages, or custom content
   ```

## Tool Categories

### Content Operations

Perfect for managing your website content, blog posts, pages, and custom objects.

### Media Operations

Handle images, videos, and other media files in your Cosmic bucket.

### Schema Operations

Manage your content structure by working with object types and their fields.

## Next Steps

- [Complete Tools Reference](../tools-reference.md) - Detailed documentation for all tools
- [Objects API](./objects.md) - Deep dive into object management
- [Media API](./media.md) - Media file operations
- [Types API](./types.md) - Object type management
- [AI Assistant Prompts](../ai-prompts.md) - Example prompts for AI assistants
