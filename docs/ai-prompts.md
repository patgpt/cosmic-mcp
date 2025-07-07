# AI Assistant Prompts for Cosmic MCP

This guide provides example prompts that you can use with AI assistants (like Claude, ChatGPT, or others) to interact with your Cosmic CMS through the MCP server.

## 📋 Prerequisites

Before using these prompts, ensure you have:

1. ✅ Cosmic MCP server configured in your AI client
2. ✅ Valid Cosmic bucket credentials set up
3. ✅ The MCP connection is active

## 🎯 Basic Content Operations

### Listing Content

**Prompt:** "List all published blog posts from my Cosmic bucket, show me the first 10 results."

**What happens:** The AI will use `list_objects` with `type_slug: "posts"`, `status: "published"`, `limit: 10`

---

**Prompt:** "Show me all content types available in my Cosmic bucket."

**What happens:** The AI will use `list_object_types` to display all available content types

---

**Prompt:** "Get all draft pages that need review."

**What happens:** The AI will use `list_objects` with `type_slug: "pages"`, `status: "draft"`

### Retrieving Specific Content

**Prompt:** "Get the blog post with slug 'my-first-post' and show me its content."

**What happens:** The AI will use `get_object` with `slug: "my-first-post"`, `type_slug: "posts"`

---

**Prompt:** "Find the page with ID '64f8a123b456c789' and display its metadata."

**What happens:** The AI will use `get_object` with `id: "64f8a123b456c789"`

## ✍️ Content Creation

### Creating Blog Posts

**Prompt:** "Create a new blog post titled 'Getting Started with Cosmic CMS' with content about how to set up a new project. Make it published and add some SEO metadata."

**What happens:** The AI will use `create_object` with:

```json
{
  "title": "Getting Started with Cosmic CMS",
  "type_slug": "posts",
  "content": "[Generated content about Cosmic CMS setup]",
  "status": "published",
  "metadata": {
    "seo_title": "Getting Started with Cosmic CMS - Complete Guide",
    "meta_description": "Learn how to set up your first Cosmic CMS project...",
    "tags": ["cosmic", "cms", "tutorial"]
  }
}
```

---

**Prompt:** "Draft a new product page for 'Wireless Headphones Pro' with price $199.99, description, and mark it as draft for review."

**What happens:** The AI will create a product object with appropriate metadata

### Creating Landing Pages

**Prompt:** "Create a landing page for our new service 'AI Consulting' with sections for hero, features, testimonials, and CTA. Use slug 'ai-consulting-services'."

**What happens:** The AI will create a structured page with organized content sections

## 🔍 Content Search and Discovery

### Text Search

**Prompt:** "Search for all content containing 'artificial intelligence' or 'machine learning' across all content types."

**What happens:** The AI will use `search_objects` with `query: "artificial intelligence machine learning"`

---

**Prompt:** "Find all blog posts about 'React' or 'JavaScript' development."

**What happens:** The AI will use `search_objects` with `type_slug: "posts"`, `query: "React JavaScript development"`

### Content Analysis

**Prompt:** "Analyze my content library and tell me how many posts I have by category, what topics I write about most, and suggest content gaps."

**What happens:** The AI will:

1. List all posts using `list_objects`
2. Analyze metadata and content
3. Provide insights and recommendations

## 📝 Content Updates

### Bulk Updates

**Prompt:** "Update all draft blog posts to add a 'needs-review' tag in their metadata."

**What happens:** The AI will:

1. List all draft posts
2. Update each one using `update_object` to add the tag

---

**Prompt:** "Find the post about 'Next.js Tutorial' and update its content to include information about the latest Next.js 14 features."

**What happens:** The AI will find and update the specific post with new content

### SEO Optimization

**Prompt:** "Review all my published blog posts and suggest SEO improvements for titles and meta descriptions."

**What happens:** The AI will analyze existing content and suggest optimizations

## 🖼️ Media Management

### Uploading Media

**Prompt:** "I have a base64 encoded image for my blog post header. Upload it to the 'blog-headers' folder and name it 'cosmic-cms-guide-header.jpg'."

**What happens:** The AI will use `upload_media` with the provided data

---

**Prompt:** "List all images in my media library and organize them by folder."

**What happens:** The AI will use `list_media` and organize the results

### Media Organization

**Prompt:** "Show me all media files larger than 1MB and suggest which ones could be optimized."

**What happens:** The AI will analyze media files and provide optimization suggestions

## 🏗️ Content Architecture

### Content Type Management

**Prompt:** "Help me design a content structure for an e-commerce site. I need product pages, category pages, and blog posts."

**What happens:** The AI will suggest content types and their field structures

---

**Prompt:** "Create a content strategy for a portfolio website with projects, testimonials, and about pages."

**What happens:** The AI will help plan the content architecture

## 🔄 Content Workflows

### Publishing Workflows

**Prompt:** "Show me all content that's ready for publishing (status: draft) and has been reviewed (has 'reviewed' tag)."

**What happens:** The AI will filter content based on status and metadata

---

**Prompt:** "Create a weekly content report showing what was published, updated, and created this week."

**What happens:** The AI will analyze content by dates and provide a summary

### Content Maintenance

**Prompt:** "Find all blog posts older than 6 months and suggest which ones need updating based on their topics."

**What happens:** The AI will analyze content freshness and suggest updates

## 🚀 Advanced Use Cases

### Content Migration

**Prompt:** "Help me migrate content from my old CMS. I'll provide you with the data structure and you can create the corresponding Cosmic objects."

**What happens:** The AI will help map and create content in Cosmic

### API Integration

**Prompt:** "Create a content syndication strategy where I can automatically cross-post my Cosmic blog posts to other platforms."

**What happens:** The AI will help design an integration workflow

### Performance Analysis

**Prompt:** "Analyze my content performance by looking at which topics and content types I create most, and suggest a content calendar."

**What happens:** The AI will provide data-driven content insights

## 💡 Pro Tips for AI Prompts

### Be Specific

❌ "Update my content"
✅ "Update the blog post with slug 'react-tutorial' to add a new section about React 18 features"

### Provide Context

❌ "Create a page"
✅ "Create a landing page for our SaaS product with hero section, features list, pricing table, and contact form"

### Use Batch Operations

❌ "Update this post, then that post, then another post"
✅ "Update all posts tagged 'tutorial' to add a 'last-updated' field with today's date"

### Leverage Search

❌ "Find my post about JavaScript"
✅ "Search for posts containing 'JavaScript ES6' or 'modern JavaScript' and show me the most recent ones"

## 🔧 Troubleshooting Prompts

**Prompt:** "Check if my Cosmic MCP connection is working by listing the available content types."

**Prompt:** "Verify that I can create content by making a test post and then deleting it."

**Prompt:** "Show me the structure of my 'posts' content type so I know what fields are available."

---

## 📚 Next Steps

- Try these prompts with your AI assistant
- Adapt them to your specific content types and workflow
- Combine multiple operations in a single prompt for complex tasks
- Use the AI to help automate your content management workflows

Remember: The AI assistant will use the appropriate MCP tools based on your requests, handling all the technical details while you focus on your content strategy!
