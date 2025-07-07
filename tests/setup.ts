// Test Setup for Bun Test Framework - Updated for MCP SDK

import type {
  CosmicMedia,
  CosmicObject,
  CosmicObjectType,
} from '@/types/cosmic.types';
import logger from '@/utils/logger';
import { afterAll, afterEach, beforeAll, beforeEach, mock } from 'bun:test';

// Global test setup
beforeAll(async () => {
  logger.info('Starting test suite');

  // Set environment variables for testing
  process.env['NODE_ENV'] = 'test';
  process.env['COSMIC_BUCKET_SLUG'] = 'test-bucket';
  process.env['COSMIC_READ_KEY'] = 'test-read-key';
  process.env['COSMIC_WRITE_KEY'] = 'test-write-key';
  process.env['DEBUG'] = 'true';
});

afterAll(async () => {
  logger.info('Test suite completed');
});

// Test case setup
beforeEach(async () => {
  // Reset any global state before each test
});

afterEach(async () => {
  // Cleanup after each test
});

// Mock Data
export const mockCosmicObject: CosmicObject = {
  id: 'test-object-id',
  slug: 'test-object-slug',
  title: 'Test Object',
  content: 'Test content',
  bucket: 'test-bucket',
  type_slug: 'test-type',
  status: 'published',
  created_at: '2023-01-01T00:00:00.000Z',
  modified_at: '2023-01-01T00:00:00.000Z',
  metadata: {
    test_field: 'test_value',
  },
  locale: 'en',
  published_at: '2023-01-01T00:00:00.000Z',
};

export const mockCosmicObjectType: CosmicObjectType = {
  id: 'test-type-id',
  slug: 'test-type',
  title: 'Test Type',
  singular: 'Test Type',
  bucket: 'test-bucket',
  created_at: '2023-01-01T00:00:00.000Z',
  modified_at: '2023-01-01T00:00:00.000Z',
  metafields: [],
  options: {
    slug_field: true,
    content_editor: false,
  },
  emoji: '🧪',
  localization: false,
  locales: [],
  priority_locale: '',
  order: 0,
  folder: '',
  singleton: false,
};

export const mockCosmicMedia: CosmicMedia = {
  id: 'test-media-id',
  name: 'test-image.jpg',
  original_name: 'test-image.jpg',
  size: 1024,
  type: 'image/jpeg',
  bucket: 'test-bucket',
  created_at: '2023-01-01T00:00:00.000Z',
  location: 'https://cdn.cosmicjs.com/test-image.jpg',
  url: 'https://cdn.cosmicjs.com/test-image.jpg',
  imgix_url: 'https://cosmic-s3.imgix.net/test-image.jpg',
  folder: '',
  alt_text: 'Test image',
  caption: 'Test caption',
  metadata: {
    width: 800,
    height: 600,
  },
};

// Mock Cosmic Client
const mockObjectsFindOne = mock((query: any): any => {
  // Always return a chainable object for findOne
  // The real Cosmic SDK always returns a chainable object regardless of input
  const chainable: any = {
    props: mock(() => chainable),
    status: mock(() => chainable),
    depth: mock(() => chainable),
    then: mock((onFulfilled: any) => {
      // Return the appropriate result based on the test scenario
      let result: { object: CosmicObject | null } = {
        object: mockCosmicObject,
      };

      // Handle cases where we want to simulate "not found"
      if (
        query?.id === 'nonexistent-id' ||
        query?.slug === 'nonexistent-slug'
      ) {
        result = { object: null };
      }

      return Promise.resolve(result).then(onFulfilled);
    }),
    catch: mock((onRejected: any) => Promise.resolve().catch(onRejected)),
  };

  return chainable;
});

const mockObjectsFind = mock((query: any) => {
  const chainable: any = {
    props: mock(() => chainable),
    sort: mock(() => chainable),
    limit: mock(() => chainable),
    skip: mock(() => chainable),
    status: mock(() => chainable),
    depth: mock(() => chainable),
    then: mock((onFulfilled: any) => {
      const result = {
        objects: [mockCosmicObject],
        total: 1,
        limit: query?.limit || 100,
        skip: query?.skip || 0,
      };
      return Promise.resolve(result).then(onFulfilled);
    }),
    catch: mock((onRejected: any) => Promise.resolve().catch(onRejected)),
  };

  return chainable;
});

const mockObjectsInsertOne = mock((data: any) => {
  return Promise.resolve({
    object: {
      ...mockCosmicObject,
      ...data,
      id: 'new-object-id',
    },
  });
});

const mockObjectsUpdateOne = mock((id: string, data: any) => {
  return Promise.resolve({
    object: {
      ...mockCosmicObject,
      ...data,
      id,
    },
  });
});

const mockObjectsDeleteOne = mock((id: string) => {
  return Promise.resolve({ message: 'Object deleted successfully' });
});

// Mock object types
const mockObjectTypesFind = mock(() => {
  return Promise.resolve({
    object_types: [mockCosmicObjectType],
    total: 1,
  });
});

const mockObjectTypesFindOne = mock((slug: string) => {
  return Promise.resolve({
    object_type: mockCosmicObjectType,
  });
});

const mockObjectTypesInsertOne = mock((data: any) => {
  return Promise.resolve({
    object_type: {
      ...mockCosmicObjectType,
      ...data,
      id: 'new-type-id',
    },
  });
});

const mockObjectTypesUpdateOne = mock((slug: string, data: any) => {
  return Promise.resolve({
    object_type: {
      ...mockCosmicObjectType,
      ...data,
      slug,
    },
  });
});

const mockObjectTypesDeleteOne = mock((slug: string) => {
  return Promise.resolve({ message: 'Object type deleted successfully' });
});

// Mock media operations
const mockMediaFind = mock(() => {
  const chainable: any = {
    limit: mock(() => chainable),
    skip: mock(() => chainable),
    then: mock((onFulfilled: any) => {
      const result = {
        media: [mockCosmicMedia],
        total: 1,
        limit: 100,
        skip: 0,
      };
      return Promise.resolve(result).then(onFulfilled);
    }),
    catch: mock((onRejected: any) => Promise.resolve().catch(onRejected)),
  };

  return chainable;
});

const mockMediaFindOne = mock((query: any) => {
  return Promise.resolve({
    media: mockCosmicMedia,
  });
});

const mockMediaInsertOne = mock((data: any) => {
  return Promise.resolve({
    media: {
      ...mockCosmicMedia,
      ...data,
      id: 'new-media-id',
    },
  });
});

const mockMediaUpdateOne = mock((id: string, data: any) => {
  return Promise.resolve({
    media: {
      ...mockCosmicMedia,
      ...data,
      id,
    },
  });
});

const mockMediaDeleteOne = mock((id: string) => {
  return Promise.resolve({ message: 'Media deleted successfully' });
});

// Export the complete mock client
export const mockCosmicClient = {
  objects: {
    findOne: mockObjectsFindOne,
    find: mockObjectsFind,
    insertOne: mockObjectsInsertOne,
    updateOne: mockObjectsUpdateOne,
    deleteOne: mockObjectsDeleteOne,
  },
  objectTypes: {
    find: mockObjectTypesFind,
    findOne: mockObjectTypesFindOne,
    insertOne: mockObjectTypesInsertOne,
    updateOne: mockObjectTypesUpdateOne,
    deleteOne: mockObjectTypesDeleteOne,
  },
  media: {
    find: mockMediaFind,
    findOne: mockMediaFindOne,
    insertOne: mockMediaInsertOne,
    updateOne: mockMediaUpdateOne,
    deleteOne: mockMediaDeleteOne,
  },
};

// Legacy export for backward compatibility with service tests
export const createMockCosmicClient = () => mockCosmicClient;

// Mock the Cosmic SDK
mock.module('@cosmicjs/sdk', () => ({
  createBucketClient: mock(() => mockCosmicClient),
}));
