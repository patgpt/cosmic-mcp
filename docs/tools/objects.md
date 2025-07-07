# Objects API

Comprehensive guide for managing content objects in your Cosmic bucket.

## Overview

Objects are the core content items in your Cosmic bucket. They can represent blog posts, pages, products, or any custom content type you've defined.

## Available Tools

### `list_objects`

List and filter objects from your bucket with pagination and sorting.

**Use Cases:**

- Get recent blog posts for a homepage
- List products by category
- Find draft content for review
- Paginate through large content sets

**Parameters:**

- `type_slug` (optional): Filter by object type
- `limit` (optional): Number of objects to return (max 1000)
- `skip` (optional): Skip objects for pagination
- `sort` (optional): Sort field and direction
- `status` (optional): Filter by status (published/draft/any)
- `locale` (optional): Filter by locale

**Example:**

```json
{
  "type_slug": "posts",
  "status": "published",
  "limit": 10,
  "sort": "-created_at"
}
```

### `get_object`

Retrieve a specific object by ID or slug.

**Use Cases:**

- Get a specific blog post for editing
- Retrieve page content for display
- Fetch product details
- Load localized content

**Parameters:**

- `id` (optional): Object ID
- `slug` (optional): Object slug
- `type_slug` (required with slug): Object type
- `locale` (optional): Locale code

**Example:**

```json
{
  "slug": "my-blog-post",
  "type_slug": "posts"
}
```

### `create_object`

Create new content objects in your bucket.

**Use Cases:**

- Publish new blog posts
- Create product pages
- Add team member profiles
- Generate landing pages

**Parameters:**

- `title` (required): Object title
- `type_slug` (required): Object type
- `slug` (optional): Custom slug (auto-generated if not provided)
- `content` (optional): HTML or Markdown content
- `status` (optional): published/draft (default: draft)
- `metadata` (optional): Custom fields object
- `locale` (optional): Locale code

**Example:**

```json
{
  "title": "Getting Started with AI",
  "type_slug": "posts",
  "content": "<h1>Welcome to AI</h1><p>This is an introduction...</p>",
  "status": "published",
  "metadata": {
    "seo_title": "AI Getting Started Guide",
    "meta_description": "Learn the basics of AI",
    "tags": ["ai", "tutorial", "beginner"],
    "featured_image": "https://cosmic-s3.imgix.net/ai-guide.jpg",
    "author": "Jane Doe",
    "reading_time": 5
  }
}
```

### `update_object`

Update existing objects in your bucket.

**Use Cases:**

- Edit blog post content
- Update product information
- Change publication status
- Modify metadata

**Parameters:**

- `id` (optional): Object ID to update
- `slug` (optional): Object slug to update
- `type_slug` (required with slug): Object type
- `title` (optional): Updated title
- `content` (optional): Updated content
- `status` (optional): Updated status
- `metadata` (optional): Updated metadata
- `locale` (optional): Locale code

**Example:**

```json
{
  "slug": "my-blog-post",
  "type_slug": "posts",
  "status": "published",
  "metadata": {
    "tags": ["ai", "tutorial", "updated"],
    "last_modified": "2024-01-15"
  }
}
```

### `delete_object`

Remove objects from your bucket.

**Use Cases:**

- Remove outdated content
- Delete draft posts
- Clean up test content
- Remove deprecated products

**Parameters:**

- `id` (optional): Object ID to delete
- `slug` (optional): Object slug to delete
- `type_slug` (required with slug): Object type

**Example:**

```json
{
  "slug": "old-blog-post",
  "type_slug": "posts"
}
```

### `search_objects`

Search through your content using text queries.

**Use Cases:**

- Find content by keywords
- Search within specific content types
- Locate content for editing
- Build search functionality

**Parameters:**

- `query` (required): Search query
- `type_slug` (optional): Limit search to specific type
- `limit` (optional): Number of results (max 1000)
- `status` (optional): Filter by status

**Example:**

```json
{
  "query": "artificial intelligence",
  "type_slug": "posts",
  "status": "published",
  "limit": 20
}
```

## Common Patterns

### Content Management Workflow

1. **List drafts**: `list_objects` with `status: "draft"`
2. **Edit content**: `get_object` → modify → `update_object`
3. **Publish**: `update_object` with `status: "published"`

### Blog Management

1. **Recent posts**: `list_objects` with `type_slug: "posts"`, `sort: "-created_at"`
2. **Post by slug**: `get_object` with `slug` and `type_slug`
3. **Search posts**: `search_objects` with `type_slug: "posts"`

### E-commerce

1. **Product catalog**: `list_objects` with `type_slug: "products"`
2. **Product details**: `get_object` with product slug
3. **Inventory updates**: `update_object` with new metadata

## Error Handling

Common error scenarios and solutions:

- **Object not found**: Check slug spelling and type_slug
- **Permission denied**: Verify write key for mutations
- **Validation error**: Check required fields and data types
- **Rate limit**: Reduce request frequency

## Best Practices

1. **Use slugs for public content**: More readable and SEO-friendly
2. **Batch operations**: Use pagination for large datasets
3. **Status management**: Use draft → published workflow
4. **Metadata structure**: Keep consistent metadata schemas
5. **Error handling**: Always handle not found and permission errors

## Related

- [Media API](./media.md) - Managing media files
- [Types API](./types.md) - Object type management
- [Complete Reference](../tools-reference.md) - All tools documentation
