# Tools Reference

Complete reference for all Cosmic MCP tools with examples and use cases.

## 📦 Object Tools

### `list_objects`

Lists objects from your Cosmic bucket with filtering and pagination.

**Parameters:**

- `type_slug` (optional): Filter by object type (e.g., "posts", "pages")
- `limit` (optional): Maximum objects to return (default: 100, max: 1000)
- `skip` (optional): Number of objects to skip for pagination (default: 0)
- `sort` (optional): Sort field and direction (default: "-created_at")
- `status` (optional): Filter by status ("published", "draft", "any")
- `locale` (optional): Filter by locale code

**Examples:**

```json
// Get all published blog posts
{
  "type_slug": "posts",
  "status": "published",
  "limit": 10
}

// Get draft pages for review
{
  "type_slug": "pages",
  "status": "draft",
  "sort": "modified_at"
}

// Paginate through all content
{
  "limit": 50,
  "skip": 100,
  "sort": "-created_at"
}
```

**AI Prompt Examples:**

- "List the 5 most recent published blog posts"
- "Show me all draft content that needs review"
- "Get all pages sorted by title alphabetically"

---

### `get_object`

Retrieves a specific object by ID or slug.

**Parameters:**

- `id` (optional): Object ID to retrieve
- `slug` (optional): Object slug to retrieve
- `type_slug` (required with slug): Object type when using slug
- `locale` (optional): Locale code to retrieve

**Examples:**

```json
// Get by ID
{
  "id": "64f8a123b456c789"
}

// Get by slug
{
  "slug": "my-first-post",
  "type_slug": "posts"
}

// Get localized content
{
  "slug": "about-us",
  "type_slug": "pages",
  "locale": "es"
}
```

**AI Prompt Examples:**

- "Get the blog post with slug 'getting-started-guide'"
- "Show me the about page content"
- "Find the product with ID '64f8a123b456c789'"

---

### `create_object`

Creates a new object in your Cosmic bucket.

**Parameters:**

- `title` (required): Object title
- `type_slug` (required): Object type slug
- `slug` (optional): Custom slug (auto-generated if not provided)
- `content` (optional): Object content (HTML or Markdown)
- `status` (optional): Object status ("published" or "draft", default: "draft")
- `metadata` (optional): Custom fields object
- `locale` (optional): Locale code

**Examples:**

```json
// Create a blog post
{
  "title": "Getting Started with Cosmic CMS",
  "type_slug": "posts",
  "content": "<h1>Welcome to Cosmic!</h1><p>This is my first post...</p>",
  "status": "published",
  "metadata": {
    "seo_title": "Getting Started Guide",
    "meta_description": "Learn how to use Cosmic CMS",
    "tags": ["tutorial", "cosmic", "cms"],
    "featured_image": "https://cosmic-s3.imgix.net/image.jpg",
    "author": "John Doe"
  }
}

// Create a product page
{
  "title": "Wireless Headphones Pro",
  "type_slug": "products",
  "slug": "wireless-headphones-pro",
  "status": "draft",
  "metadata": {
    "price": 199.99,
    "category": "Electronics",
    "description": "Premium wireless headphones with noise cancellation",
    "features": ["Noise Cancellation", "30hr Battery", "Quick Charge"],
    "in_stock": true
  }
}
```

**AI Prompt Examples:**

- "Create a new blog post about React best practices"
- "Draft a product page for our new laptop model"
- "Make a landing page for our AI consulting service"

---

### `update_object`

Updates an existing object in your Cosmic bucket.

**Parameters:**

- `id` (optional): Object ID to update
- `slug` (optional): Object slug to update
- `type_slug` (required with slug): Object type when using slug
- `title` (optional): Updated title
- `content` (optional): Updated content
- `status` (optional): Updated status
- `metadata` (optional): Updated metadata
- `locale` (optional): Locale code

**Examples:**

```json
// Update content and publish
{
  "slug": "my-draft-post",
  "type_slug": "posts",
  "content": "<h1>Updated Content</h1><p>This post has been revised...</p>",
  "status": "published"
}

// Update metadata only
{
  "id": "64f8a123b456c789",
  "metadata": {
    "tags": ["updated", "featured"],
    "last_modified": "2024-01-15"
  }
}
```

**AI Prompt Examples:**

- "Update the 'about-us' page to include our new team members"
- "Change the status of all draft posts to published"
- "Add SEO metadata to the 'react-tutorial' blog post"

---

### `delete_object`

Deletes an object from your Cosmic bucket.

**Parameters:**

- `id` (optional): Object ID to delete
- `slug` (optional): Object slug to delete
- `type_slug` (required with slug): Object type when using slug

**Examples:**

```json
// Delete by ID
{
  "id": "64f8a123b456c789"
}

// Delete by slug
{
  "slug": "old-post",
  "type_slug": "posts"
}
```

**AI Prompt Examples:**

- "Delete the blog post with slug 'outdated-tutorial'"
- "Remove all test content from my bucket"
- "Delete the product page for discontinued items"

---

### `search_objects`

Searches objects using text search across content and metadata.

**Parameters:**

- `query` (required): Search query text
- `type_slug` (optional): Limit search to specific object type
- `limit` (optional): Maximum results (default: 100, max: 1000)
- `locale` (optional): Search within specific locale

**Examples:**

```json
// Search all content
{
  "query": "artificial intelligence machine learning",
  "limit": 20
}

// Search specific content type
{
  "query": "React tutorial",
  "type_slug": "posts",
  "limit": 10
}

// Search with locale
{
  "query": "productos tecnología",
  "type_slug": "products",
  "locale": "es"
}
```

**AI Prompt Examples:**

- "Search for all content about 'JavaScript frameworks'"
- "Find blog posts mentioning 'Next.js' or 'React'"
- "Search products containing 'wireless' or 'bluetooth'"

## 🎭 Object Type Tools

### `list_object_types`

Lists all object types (content types) in your Cosmic bucket.

**Parameters:** None

**Examples:**

```json
{}
```

**AI Prompt Examples:**

- "Show me all content types in my bucket"
- "What types of content can I create?"
- "List all available object types"

## 🖼️ Media Tools

### `upload_media`

Uploads media files to your Cosmic bucket.

**Parameters:**

- `file_data` (required): Base64 encoded file data
- `filename` (required): Name of the file including extension
- `folder` (optional): Folder path to upload to

**Examples:**

```json
{
  "file_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  "filename": "hero-image.jpg",
  "folder": "blog-images"
}
```

**AI Prompt Examples:**

- "Upload this image to the 'hero-images' folder"
- "Save this logo file to the media library"
- "Upload screenshots to the 'documentation' folder"

---

### `list_media`

Lists media files in your Cosmic bucket.

**Parameters:**

- `limit` (optional): Maximum media items to return (default: 100, max: 1000)
- `skip` (optional): Number of items to skip for pagination (default: 0)
- `folder` (optional): Filter by folder path

**Examples:**

```json
// List all media
{
  "limit": 50
}

// List media in specific folder
{
  "folder": "blog-images",
  "limit": 20
}

// Paginate through media
{
  "limit": 25,
  "skip": 50
}
```

**AI Prompt Examples:**

- "Show me all images in the media library"
- "List files in the 'products' folder"
- "Get all media files uploaded this month"

---

### `delete_media`

Deletes a media file from your Cosmic bucket.

**Parameters:**

- `id` (required): Media file ID to delete

**Examples:**

```json
{
  "id": "64f8a123b456c789"
}
```

**AI Prompt Examples:**

- "Delete the unused hero image from last month"
- "Remove all test images from the media library"
- "Clean up old product photos"

## 🎯 Common Use Cases

### Content Management Workflow

1. **Content Planning**

   ```
   "List all content types → Create content calendar → Draft new posts"
   ```

2. **Content Creation**

   ```
   "Create draft → Add content → Upload media → Update with media → Publish"
   ```

3. **Content Maintenance**
   ```
   "Search old content → Update outdated info → Optimize SEO → Republish"
   ```

### E-commerce Setup

1. **Product Catalog**

   ```
   "Create product type → Add products → Upload product images → Set up categories"
   ```

2. **Content Marketing**
   ```
   "Create blog posts → Add product references → Upload lifestyle images"
   ```

### Multi-language Sites

1. **Content Localization**
   ```
   "Create content in default locale → Translate → Create localized versions"
   ```

## 🔧 Advanced Tips

### Batch Operations

Use AI prompts to perform operations on multiple objects:

- "Update all draft posts to add review tags"
- "Delete all test content"
- "Publish all reviewed articles"

### Content Analysis

Leverage AI to analyze your content:

- "Analyze my content themes and suggest new topics"
- "Review SEO metadata across all posts"
- "Identify content gaps in my blog"

### Workflow Automation

Create content workflows:

- "Set up a weekly content review process"
- "Create a content approval workflow"
- "Automate content publishing schedules"

---

## 📚 Related Documentation

- [AI Assistant Prompts](./ai-prompts.md) - Example prompts for AI assistants
- [MCP Client Setup](./mcp-setup.md) - How to configure MCP clients
- [Configuration](./configuration.md) - Server configuration options
