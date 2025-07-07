// Model Context Protocol (MCP) Types - Updated to use official SDK

// Import standard MCP types from the official SDK
export type {
  CallToolRequest,
  CallToolResult,
  InitializeRequest,
  InitializeResult,
  JSONRPCError,
  JSONRPCRequest,
  JSONRPCResponse,
  ListToolsRequest,
  ListToolsResult,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Legacy MCP Message Types (for backward compatibility)
export interface MCPRequest {
  id: string;
  tool: string;
  input: unknown;
}

export interface MCPResponse {
  id: string;
  result?: unknown;
  error?: string;
}

// Specific Tool Input Types (these remain custom to our implementation)
export interface ListObjectsToolInput {
  type_slug?: string;
  limit: number;
  skip: number;
  sort: string;
  status: 'published' | 'draft' | 'any';
  locale?: string;
}

export interface GetObjectToolInput {
  id?: string;
  slug?: string;
  type_slug?: string;
  locale?: string;
}

export interface CreateObjectToolInput {
  title: string;
  type_slug: string;
  slug?: string;
  content?: string;
  status: 'published' | 'draft';
  metadata?: Record<string, unknown>;
  locale?: string;
}

export interface UpdateObjectToolInput {
  id?: string;
  slug?: string;
  type_slug?: string;
  title?: string;
  content?: string;
  status?: 'published' | 'draft';
  metadata?: Record<string, unknown>;
  locale?: string;
}

export interface DeleteObjectToolInput {
  id?: string;
  slug?: string;
  type_slug?: string;
}

export interface UploadMediaToolInput {
  file_data: string; // base64 encoded
  filename: string;
  folder?: string;
}

export interface ListMediaToolInput {
  limit: number;
  skip: number;
  folder?: string;
}

export interface DeleteMediaToolInput {
  id: string;
}

export interface SearchObjectsToolInput {
  query: string;
  type_slug?: string;
  limit: number;
  locale?: string;
}

// Tool Name Constants
export const MCP_TOOLS = {
  LIST_OBJECTS: 'list_objects',
  GET_OBJECT: 'get_object',
  CREATE_OBJECT: 'create_object',
  UPDATE_OBJECT: 'update_object',
  DELETE_OBJECT: 'delete_object',
  LIST_OBJECT_TYPES: 'list_object_types',
  UPLOAD_MEDIA: 'upload_media',
  LIST_MEDIA: 'list_media',
  DELETE_MEDIA: 'delete_media',
  SEARCH_OBJECTS: 'search_objects',
} as const;

export type MCPToolName = (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS];

// Tool Input Union Type
export type MCPToolInput =
  | ListObjectsToolInput
  | GetObjectToolInput
  | CreateObjectToolInput
  | UpdateObjectToolInput
  | DeleteObjectToolInput
  | UploadMediaToolInput
  | ListMediaToolInput
  | DeleteMediaToolInput
  | SearchObjectsToolInput
  | Record<string, never>; // for list_object_types

// Request Handler Type
export interface MCPRequestHandler {
  handle(request: MCPRequest): Promise<MCPResponse>;
}

// Tool Handler Interface
export interface MCPToolHandler<TInput = unknown, TOutput = unknown> {
  execute(input: TInput): Promise<TOutput>;
}
