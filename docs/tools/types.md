# Types API

Guide for managing object types and content schemas in your Cosmic bucket.

## Overview

Object types define the structure and fields for your content. They act as templates for creating objects like blog posts, products, or custom content types.

## Available Tools

### `list_object_types`

List all object types in your bucket.

**Use Cases:**

- Get all available content types
- Understand bucket structure
- Build dynamic forms
- Content type discovery

**Parameters:**

- None required

**Example:**

```json
{}
```

**Response includes:**

- Type slug and title
- Field definitions
- Validation rules
- Default values

### `get_object_type`

Get detailed information about a specific object type.

**Use Cases:**

- Get field definitions for forms
- Understand content structure
- Validate content before creation
- Build content editors

**Parameters:**

- `slug` (required): Object type slug

**Example:**

```json
{
  "slug": "posts"
}
```

### `create_object_type`

Create new object types to define content structure.

**Use Cases:**

- Add new content types
- Define custom schemas
- Create product catalogs
- Build content models

**Parameters:**

- `title` (required): Human-readable type name
- `slug` (required): URL-friendly identifier
- `metafields` (optional): Field definitions

**Example:**

```json
{
  "title": "Blog Posts",
  "slug": "posts",
  "metafields": [
    {
      "key": "seo_title",
      "title": "SEO Title",
      "type": "text",
      "required": false,
      "validation": {
        "maxlength": 60
      }
    },
    {
      "key": "featured_image",
      "title": "Featured Image",
      "type": "file",
      "required": true
    },
    {
      "key": "tags",
      "title": "Tags",
      "type": "text",
      "required": false,
      "multiple": true
    },
    {
      "key": "author",
      "title": "Author",
      "type": "object",
      "object_type": "authors",
      "required": true
    }
  ]
}
```

## Field Types

### Basic Fields

#### Text

```json
{
  "key": "title",
  "title": "Title",
  "type": "text",
  "required": true,
  "validation": {
    "maxlength": 100
  }
}
```

#### Textarea

```json
{
  "key": "description",
  "title": "Description",
  "type": "textarea",
  "required": false
}
```

#### Rich Text

```json
{
  "key": "content",
  "title": "Content",
  "type": "rich-text",
  "required": true
}
```

#### Number

```json
{
  "key": "price",
  "title": "Price",
  "type": "number",
  "required": true,
  "validation": {
    "min": 0,
    "max": 10000
  }
}
```

### Media Fields

#### File

```json
{
  "key": "featured_image",
  "title": "Featured Image",
  "type": "file",
  "required": true,
  "validation": {
    "mimetypes": ["image/jpeg", "image/png", "image/webp"]
  }
}
```

#### Gallery

```json
{
  "key": "product_gallery",
  "title": "Product Gallery",
  "type": "file",
  "required": false,
  "multiple": true
}
```

### Selection Fields

#### Select

```json
{
  "key": "category",
  "title": "Category",
  "type": "select-dropdown",
  "required": true,
  "options": [
    { "key": "tech", "value": "Technology" },
    { "key": "design", "value": "Design" },
    { "key": "business", "value": "Business" }
  ]
}
```

#### Radio

```json
{
  "key": "status",
  "title": "Status",
  "type": "radio-buttons",
  "required": true,
  "options": [
    { "key": "active", "value": "Active" },
    { "key": "inactive", "value": "Inactive" }
  ]
}
```

#### Checkbox

```json
{
  "key": "features",
  "title": "Features",
  "type": "check-boxes",
  "required": false,
  "multiple": true,
  "options": [
    { "key": "featured", "value": "Featured" },
    { "key": "trending", "value": "Trending" },
    { "key": "new", "value": "New" }
  ]
}
```

### Advanced Fields

#### Object Reference

```json
{
  "key": "author",
  "title": "Author",
  "type": "object",
  "object_type": "authors",
  "required": true
}
```

#### Date

```json
{
  "key": "publish_date",
  "title": "Publish Date",
  "type": "date",
  "required": false
}
```

#### JSON

```json
{
  "key": "custom_data",
  "title": "Custom Data",
  "type": "json",
  "required": false
}
```

## Common Content Types

### Blog Post

```json
{
  "title": "Blog Posts",
  "slug": "posts",
  "metafields": [
    {
      "key": "seo_title",
      "title": "SEO Title",
      "type": "text",
      "validation": { "maxlength": 60 }
    },
    {
      "key": "meta_description",
      "title": "Meta Description",
      "type": "textarea",
      "validation": { "maxlength": 160 }
    },
    {
      "key": "featured_image",
      "title": "Featured Image",
      "type": "file",
      "required": true
    },
    {
      "key": "tags",
      "title": "Tags",
      "type": "text",
      "multiple": true
    },
    {
      "key": "author",
      "title": "Author",
      "type": "object",
      "object_type": "authors"
    },
    {
      "key": "reading_time",
      "title": "Reading Time (minutes)",
      "type": "number"
    }
  ]
}
```

### Product

```json
{
  "title": "Products",
  "slug": "products",
  "metafields": [
    {
      "key": "price",
      "title": "Price",
      "type": "number",
      "required": true,
      "validation": { "min": 0 }
    },
    {
      "key": "sale_price",
      "title": "Sale Price",
      "type": "number",
      "validation": { "min": 0 }
    },
    {
      "key": "category",
      "title": "Category",
      "type": "select-dropdown",
      "required": true,
      "options": [
        { "key": "electronics", "value": "Electronics" },
        { "key": "clothing", "value": "Clothing" },
        { "key": "books", "value": "Books" }
      ]
    },
    {
      "key": "gallery",
      "title": "Product Gallery",
      "type": "file",
      "multiple": true
    },
    {
      "key": "in_stock",
      "title": "In Stock",
      "type": "radio-buttons",
      "options": [
        { "key": "yes", "value": "Yes" },
        { "key": "no", "value": "No" }
      ]
    },
    {
      "key": "features",
      "title": "Features",
      "type": "check-boxes",
      "multiple": true,
      "options": [
        { "key": "featured", "value": "Featured" },
        { "key": "bestseller", "value": "Bestseller" },
        { "key": "new", "value": "New Arrival" }
      ]
    }
  ]
}
```

### Team Member

```json
{
  "title": "Team Members",
  "slug": "team",
  "metafields": [
    {
      "key": "position",
      "title": "Position",
      "type": "text",
      "required": true
    },
    {
      "key": "bio",
      "title": "Biography",
      "type": "rich-text"
    },
    {
      "key": "photo",
      "title": "Photo",
      "type": "file",
      "required": true
    },
    {
      "key": "social_links",
      "title": "Social Links",
      "type": "json"
    },
    {
      "key": "start_date",
      "title": "Start Date",
      "type": "date"
    }
  ]
}
```

## Validation Rules

### Text Validation

```json
{
  "validation": {
    "minlength": 10,
    "maxlength": 100,
    "pattern": "^[A-Za-z0-9\\s]+$"
  }
}
```

### Number Validation

```json
{
  "validation": {
    "min": 0,
    "max": 1000,
    "step": 0.01
  }
}
```

### File Validation

```json
{
  "validation": {
    "mimetypes": ["image/jpeg", "image/png"],
    "maxsize": 5242880
  }
}
```

## Best Practices

### Schema Design

1. **Keep it simple**: Start with essential fields
2. **Use descriptive names**: Clear field titles and keys
3. **Plan relationships**: Think about object references
4. **Consider validation**: Add appropriate constraints

### Field Organization

1. **Group related fields**: Organize logically
2. **Required vs optional**: Mark required fields clearly
3. **Default values**: Provide sensible defaults
4. **Help text**: Add descriptions for complex fields

### Performance

1. **Limit fields**: Don't create excessive fields
2. **Index considerations**: Plan for search and filtering
3. **File sizes**: Set appropriate file size limits
4. **Validation**: Use client-side validation when possible

## Common Patterns

### Content Hierarchy

```
Categories → Posts → Comments
Products → Variants → Reviews
Pages → Sections → Components
```

### Multi-language Content

```json
{
  "key": "localized_content",
  "title": "Localized Content",
  "type": "json",
  "localization": true
}
```

### E-commerce Schema

```
Products → Categories
Products → Brands
Products → Reviews
Orders → Products
Users → Orders
```

## Related

- [Objects API](./objects.md) - Managing content objects
- [Media API](./media.md) - Managing media files
- [Complete Reference](../tools-reference.md) - All tools documentation
