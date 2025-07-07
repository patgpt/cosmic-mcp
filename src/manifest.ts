// Import Tool type from official MCP SDK
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

// Define comprehensive tools for Cosmic JS CRUD operations
export const tools: Tool[] = [
  {
    name: 'list_objects',
    description:
      'List objects from your Cosmic bucket. Optionally filter by object type, with pagination support.',
    inputSchema: {
      type: 'object',
      properties: {
        type_slug: {
          type: 'string',
          description: 'Filter by object type slug (e.g., "posts", "pages")',
        },
        limit: {
          type: 'number',
          description:
            'Maximum number of objects to return (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000,
        },
        skip: {
          type: 'number',
          description: 'Number of objects to skip for pagination (default: 0)',
          default: 0,
          minimum: 0,
        },
        sort: {
          type: 'string',
          description:
            'Sort field and direction (e.g., "created_at", "-created_at")',
          default: '-created_at',
        },
        status: {
          type: 'string',
          description: 'Filter by object status',
          enum: ['published', 'draft', 'any'],
          default: 'published',
        },
        locale: {
          type: 'string',
          description: 'Filter by locale code (e.g., "en", "es")',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_object',
    description: 'Get a specific object by ID or slug from your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Object ID to retrieve',
        },
        slug: {
          type: 'string',
          description: 'Object slug to retrieve',
        },
        type_slug: {
          type: 'string',
          description: 'Object type slug (required when using slug)',
        },
        locale: {
          type: 'string',
          description: 'Locale code to retrieve (e.g., "en", "es")',
        },
      },
      additionalProperties: false,
      anyOf: [
        {
          required: ['id'],
        },
        {
          required: ['slug', 'type_slug'],
        },
      ],
    },
  },
  {
    name: 'create_object',
    description: 'Create a new object in your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      required: ['title', 'type_slug'],
      properties: {
        title: {
          type: 'string',
          description: 'Object title',
          minLength: 1,
          maxLength: 200,
        },
        type_slug: {
          type: 'string',
          description: 'Object type slug (e.g., "posts", "pages")',
          minLength: 1,
        },
        slug: {
          type: 'string',
          description:
            'Custom slug for the object (auto-generated if not provided)',
          pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        },
        content: {
          type: 'string',
          description: 'Object content (HTML or Markdown)',
        },
        status: {
          type: 'string',
          description: 'Object status',
          enum: ['published', 'draft'],
          default: 'draft',
        },
        metadata: {
          type: 'object',
          description: 'Object metadata (custom fields)',
          additionalProperties: true,
        },
        locale: {
          type: 'string',
          description: 'Locale code (e.g., "en", "es")',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'update_object',
    description: 'Update an existing object in your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Object ID to update',
        },
        slug: {
          type: 'string',
          description: 'Object slug to update',
        },
        type_slug: {
          type: 'string',
          description: 'Object type slug (required when using slug)',
        },
        title: {
          type: 'string',
          description: 'Updated object title',
          minLength: 1,
          maxLength: 200,
        },
        content: {
          type: 'string',
          description: 'Updated object content (HTML or Markdown)',
        },
        status: {
          type: 'string',
          description: 'Updated object status',
          enum: ['published', 'draft'],
        },
        metadata: {
          type: 'object',
          description: 'Updated object metadata (custom fields)',
          additionalProperties: true,
        },
        locale: {
          type: 'string',
          description: 'Locale code (e.g., "en", "es")',
        },
      },
      additionalProperties: false,
      anyOf: [
        {
          required: ['id'],
        },
        {
          required: ['slug', 'type_slug'],
        },
      ],
    },
  },
  {
    name: 'delete_object',
    description: 'Delete an object from your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Object ID to delete',
        },
        slug: {
          type: 'string',
          description: 'Object slug to delete',
        },
        type_slug: {
          type: 'string',
          description: 'Object type slug (required when using slug)',
        },
      },
      additionalProperties: false,
      anyOf: [
        {
          required: ['id'],
        },
        {
          required: ['slug', 'type_slug'],
        },
      ],
    },
  },
  {
    name: 'list_object_types',
    description: 'List all object types in your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'upload_media',
    description: 'Upload media files to your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      required: ['file_data', 'filename'],
      properties: {
        file_data: {
          type: 'string',
          description: 'Base64 encoded file data',
        },
        filename: {
          type: 'string',
          description: 'Name of the file including extension',
          minLength: 1,
        },
        folder: {
          type: 'string',
          description: 'Folder path to upload to (optional)',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'list_media',
    description: 'List media files in your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description:
            'Maximum number of media items to return (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000,
        },
        skip: {
          type: 'number',
          description:
            'Number of media items to skip for pagination (default: 0)',
          default: 0,
          minimum: 0,
        },
        folder: {
          type: 'string',
          description: 'Filter by folder path',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'delete_media',
    description: 'Delete a media file from your Cosmic bucket.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: 'Media file ID to delete',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'search_objects',
    description: 'Search objects in your Cosmic bucket using text search.',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: {
          type: 'string',
          description: 'Search query text',
          minLength: 1,
        },
        type_slug: {
          type: 'string',
          description: 'Limit search to specific object type',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000,
        },
        locale: {
          type: 'string',
          description: 'Search within specific locale',
        },
      },
      additionalProperties: false,
    },
  },
] as const;

// Export the tools for the MCP server
export const toolList = {
  type: 'tool_list' as const,
  tools,
};
