#!/usr/bin/env node

// Main MCP Server - Migrated to use official MCP TypeScript SDK

import { createBucketClient } from '@cosmicjs/sdk';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Configuration and Types
import { config } from './config.js';
import { tools } from './manifest.js';
import type { CosmicClient } from './types/cosmic.types.js';

// Repositories
import { MediaRepository } from './repositories/media.repository.js';
import { ObjectRepository } from './repositories/object.repository.js';
import { TypeRepository } from './repositories/type.repository.js';

// Services
import { MediaService } from './services/media.service.js';
import { ObjectService } from './services/object.service.js';
import { TypeService } from './services/type.service.js';

// Utilities and Validation
import {
  validateToolInput,
  type CreateObjectInput,
  type DeleteMediaInput,
  type DeleteObjectInput,
  type GetObjectInput,
  type ListMediaInput,
  type ListObjectsInput,
  type SearchObjectsInput,
  type UpdateObjectInput,
  type UploadMediaInput,
} from './validation.js';

// Error handling and logging
import { UnknownToolError } from './errors/validation.error.js';
import logger from './utils/logger.js';
import { defaultRateLimiter } from './utils/rate-limiter.js';

// Server Configuration and Dependency Injection
class CosmicMCPServer {
  private logger = logger;
  private server: Server;

  // Dependencies
  private cosmicClient!: CosmicClient;
  private objectRepository!: ObjectRepository;
  private mediaRepository!: MediaRepository;
  private typeRepository!: TypeRepository;
  private objectService!: ObjectService;
  private mediaService!: MediaService;
  private typeService!: TypeService;

  constructor() {
    // Initialize the MCP server
    this.server = new Server(
      {
        name: 'cosmic-mcp',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.initializeDependencies();
    this.setupRequestHandlers();
  }

  private initializeDependencies(): void {
    // Initialize Cosmic client
    this.cosmicClient = createBucketClient({
      bucketSlug: config.bucketSlug,
      readKey: config.readKey,
      writeKey: config.writeKey,
    }) as unknown as CosmicClient;

    // Initialize repositories
    this.objectRepository = new ObjectRepository(this.cosmicClient);
    this.mediaRepository = new MediaRepository(this.cosmicClient);
    this.typeRepository = new TypeRepository(this.cosmicClient);

    // Initialize services with dependency injection
    this.objectService = new ObjectService(
      this.objectRepository,
      this.typeRepository,
    );
    this.mediaService = new MediaService(this.mediaRepository);
    this.typeService = new TypeService(
      this.typeRepository,
      this.objectRepository,
    );

    this.logger.info('Dependencies initialized successfully');
  }

  private setupRequestHandlers(): void {
    // Handle tools/list requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools,
      };
    });

    // Handle tools/call requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      this.logger.info('Processing tool call', {
        tool: name,
        hasArgs: !!args,
      });

      // Global rate limiting
      defaultRateLimiter.checkAndConsume(`tool_${name}`);

      try {
        // Validate input
        const validatedInput = validateToolInput(name, args);

        // Route to appropriate handler
        const result = await this.executeToolHandler(name, validatedInput);

        this.logger.info('Tool call completed successfully', {
          tool: name,
          resultType: typeof result,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        this.logger.error('Tool call failed', {
          tool: name,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // Tool Handler Methods (unchanged from original implementation)
  private async handleListObjects(input: ListObjectsInput): Promise<unknown> {
    const query: any = {
      status: input.status,
      limit: input.limit,
      skip: input.skip,
      sort: input.sort,
    };

    if (input.type_slug) query.typeSlug = input.type_slug;
    if (input.locale) query.locale = input.locale;

    return await this.objectService.listObjects(query);
  }

  private async handleGetObject(input: GetObjectInput): Promise<unknown> {
    if ('id' in input) {
      const query: any = { id: input.id };
      if (input.locale) query.locale = input.locale;
      return await this.objectService.getObject(query);
    } else {
      const query: any = { slug: input.slug, typeSlug: input.type_slug };
      if (input.locale) query.locale = input.locale;
      return await this.objectService.getObject(query);
    }
  }

  private async handleCreateObject(input: CreateObjectInput): Promise<unknown> {
    const data: any = {
      title: input.title,
      typeSlug: input.type_slug,
      status: input.status,
    };

    if (input.slug) data.slug = input.slug;
    if (input.content) data.content = input.content;
    if (input.metadata) data.metadata = input.metadata;
    if (input.locale) data.locale = input.locale;

    return await this.objectService.createObject(data);
  }

  private async handleUpdateObject(input: UpdateObjectInput): Promise<unknown> {
    const query =
      'id' in input
        ? { id: input.id }
        : { slug: input.slug, typeSlug: input.type_slug };

    const data: any = {};
    if (input.title) data.title = input.title;
    if (input.content !== undefined) data.content = input.content;
    if (input.status) data.status = input.status;
    if (input.metadata) data.metadata = input.metadata;
    if (input.locale) data.locale = input.locale;

    return await this.objectService.updateObject(query, data);
  }

  private async handleDeleteObject(input: DeleteObjectInput): Promise<unknown> {
    const query =
      'id' in input
        ? { id: input.id }
        : { slug: input.slug, typeSlug: input.type_slug };

    await this.objectService.deleteObject(query);
    return { message: 'Object deleted successfully' };
  }

  private async handleListObjectTypes(): Promise<unknown> {
    return await this.typeService.listObjectTypes({});
  }

  private async handleUploadMedia(input: UploadMediaInput): Promise<unknown> {
    const data: any = {
      fileData: input.file_data,
      filename: input.filename,
    };

    if (input.folder) data.folder = input.folder;

    return await this.mediaService.uploadMedia(data);
  }

  private async handleListMedia(input: ListMediaInput): Promise<unknown> {
    const query: any = {
      limit: input.limit,
      skip: input.skip,
    };

    if (input.folder) query.folder = input.folder;

    return await this.mediaService.listMedia(query);
  }

  private async handleDeleteMedia(input: DeleteMediaInput): Promise<unknown> {
    await this.mediaService.deleteMedia({ id: input.id });
    return { message: 'Media deleted successfully' };
  }

  private async handleSearchObjects(
    input: SearchObjectsInput,
  ): Promise<unknown> {
    const query: any = {
      query: input.query,
      limit: input.limit,
    };

    if (input.type_slug) query.typeSlug = input.type_slug;
    if (input.locale) query.locale = input.locale;

    return await this.objectService.searchObjects(query);
  }

  // Execute tool handler logic (extracted for reuse)
  private async executeToolHandler(
    toolName: string,
    validatedInput: unknown,
  ): Promise<unknown> {
    switch (toolName) {
      case 'list_objects':
        return await this.handleListObjects(validatedInput as ListObjectsInput);
      case 'get_object':
        return await this.handleGetObject(validatedInput as GetObjectInput);
      case 'create_object':
        return await this.handleCreateObject(
          validatedInput as CreateObjectInput,
        );
      case 'update_object':
        return await this.handleUpdateObject(
          validatedInput as UpdateObjectInput,
        );
      case 'delete_object':
        return await this.handleDeleteObject(
          validatedInput as DeleteObjectInput,
        );
      case 'list_object_types':
        return await this.handleListObjectTypes();
      case 'upload_media':
        return await this.handleUploadMedia(validatedInput as UploadMediaInput);
      case 'list_media':
        return await this.handleListMedia(validatedInput as ListMediaInput);
      case 'delete_media':
        return await this.handleDeleteMedia(validatedInput as DeleteMediaInput);
      case 'search_objects':
        return await this.handleSearchObjects(
          validatedInput as SearchObjectsInput,
        );
      default:
        throw new UnknownToolError(toolName);
    }
  }

  // Server lifecycle methods
  public async start(): Promise<void> {
    try {
      this.logger.info('Starting Cosmic MCP Server', {
        bucketSlug: config.bucketSlug,
        toolsCount: tools.length,
        version: '2.0.0',
      });

      // Create transport and connect
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      this.logger.info('MCP Server ready for requests');
    } catch (error) {
      this.logger.error('Server failed to start', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    this.logger.info('Stopping Cosmic MCP Server');

    // Cleanup rate limiter
    defaultRateLimiter.destroy();

    this.logger.info('Server stopped gracefully');
  }
}

// Global error handlers
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
    name: error.name,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

// Start the server
async function main() {
  const server = new CosmicMCPServer();
  await server.start();
}

if (require.main === module) {
  main().catch((error) => {
    logger.error('Fatal error starting server', error);
    process.exit(1);
  });
}
