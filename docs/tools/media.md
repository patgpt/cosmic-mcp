# Media API

Guide for managing media files in your Cosmic bucket.

## Overview

Media tools allow you to manage images, videos, documents, and other files in your Cosmic bucket. All media files are automatically optimized and served through Cosmic's CDN.

## Available Tools

### `list_media`

List media files in your bucket with filtering and pagination.

**Use Cases:**

- Browse uploaded images
- Find media by folder
- Paginate through large media libraries
- Filter by file type

**Parameters:**

- `limit` (optional): Number of files to return (max 1000)
- `skip` (optional): Skip files for pagination
- `folder` (optional): Filter by folder path
- `sort` (optional): Sort field and direction

**Example:**

```json
{
  "folder": "blog-images",
  "limit": 20,
  "sort": "-created_at"
}
```

### `get_media`

Get details about a specific media file.

**Use Cases:**

- Get image URLs and metadata
- Check file size and dimensions
- Retrieve optimization settings
- Get CDN URLs

**Parameters:**

- `id` (required): Media file ID

**Example:**

```json
{
  "id": "64f8a123b456c789"
}
```

### `upload_media`

Upload new media files to your bucket.

**Use Cases:**

- Add images to blog posts
- Upload product photos
- Store documents and PDFs
- Upload video content

**Parameters:**

- `file` (required): File data (base64 encoded)
- `filename` (required): Original filename
- `folder` (optional): Folder to upload to
- `metadata` (optional): Additional metadata

**Example:**

```json
{
  "file": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "filename": "hero-image.jpg",
  "folder": "homepage",
  "metadata": {
    "alt_text": "Hero image for homepage",
    "caption": "Beautiful sunset over mountains",
    "photographer": "John Doe"
  }
}
```

## File Types Supported

### Images

- **JPEG** (.jpg, .jpeg) - Photos and complex images
- **PNG** (.png) - Images with transparency
- **GIF** (.gif) - Animated images
- **WebP** (.webp) - Modern format with better compression
- **SVG** (.svg) - Vector graphics

### Videos

- **MP4** (.mp4) - Most common video format
- **WebM** (.webm) - Web-optimized video
- **MOV** (.mov) - QuickTime format

### Documents

- **PDF** (.pdf) - Documents and presentations
- **DOC/DOCX** (.doc, .docx) - Word documents
- **TXT** (.txt) - Plain text files

### Other

- **ZIP** (.zip) - Compressed archives
- **JSON** (.json) - Data files
- **CSV** (.csv) - Spreadsheet data

## Image Optimization

Cosmic automatically optimizes images and provides powerful transformation options:

### URL Transformations

```
https://cosmic-s3.imgix.net/your-image.jpg?w=800&h=600&fit=crop
```

**Common Parameters:**

- `w` - Width in pixels
- `h` - Height in pixels
- `fit` - Resize behavior (crop, scale, fill)
- `q` - Quality (1-100)
- `fm` - Format (jpg, png, webp, auto)
- `auto` - Auto-optimize (compress, format)

### Responsive Images

```html
<img
  src="https://cosmic-s3.imgix.net/image.jpg?w=800&auto=compress,format"
  srcset="
    https://cosmic-s3.imgix.net/image.jpg?w=400&auto=compress,format   400w,
    https://cosmic-s3.imgix.net/image.jpg?w=800&auto=compress,format   800w,
    https://cosmic-s3.imgix.net/image.jpg?w=1200&auto=compress,format 1200w
  "
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  alt="Optimized image"
/>
```

## File Organization

### Folder Structure

Organize your media with folders:

```
/
├── blog-images/
│   ├── 2024/
│   └── featured/
├── products/
│   ├── electronics/
│   └── clothing/
└── assets/
    ├── icons/
    └── logos/
```

### Naming Conventions

**Good practices:**

- Use descriptive names: `product-hero-image.jpg`
- Include dates: `2024-01-15-event-photo.jpg`
- Use hyphens instead of spaces: `team-photo.jpg`
- Include dimensions: `logo-300x100.png`

**Avoid:**

- Special characters: `image@#$.jpg`
- Spaces: `my image.jpg`
- Very long names: `this-is-a-very-long-filename-that-is-hard-to-read.jpg`

## Common Patterns

### Blog Image Workflow

1. **Upload**: `upload_media` with blog-specific folder
2. **Get URL**: Use returned URL in blog post content
3. **Optimize**: Add URL parameters for responsive images

### Product Gallery

1. **Upload multiple**: `upload_media` for each product image
2. **Organize**: Use product-specific folders
3. **Retrieve**: `list_media` with folder filter

### Asset Management

1. **List by type**: Filter media by folder
2. **Update metadata**: Add alt text and captions
3. **Clean up**: Remove unused files periodically

## Error Handling

Common issues and solutions:

- **File too large**: Check file size limits (usually 10MB)
- **Invalid format**: Verify file type is supported
- **Upload failed**: Check network connection and API key
- **Not found**: Verify media ID exists

## Best Practices

### Performance

1. **Optimize images**: Use appropriate formats and sizes
2. **Use CDN**: Always use Cosmic's CDN URLs
3. **Lazy loading**: Implement lazy loading for images
4. **WebP format**: Use modern formats when possible

### Organization

1. **Folder structure**: Keep media organized in folders
2. **Naming**: Use consistent, descriptive naming
3. **Metadata**: Add alt text and captions for accessibility
4. **Cleanup**: Remove unused media regularly

### Security

1. **File validation**: Validate file types on upload
2. **Size limits**: Enforce reasonable file size limits
3. **Access control**: Use appropriate API keys

## Related

- [Objects API](./objects.md) - Managing content objects
- [Types API](./types.md) - Object type management
- [Complete Reference](../tools-reference.md) - All tools documentation
