// Object Repository Tests

import { ObjectRepository } from '@/repositories/object.repository';
import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { mockCosmicClient, mockCosmicObject } from '../setup';

describe('ObjectRepository', () => {
  let objectRepository: ObjectRepository;

  beforeEach(() => {
    objectRepository = new ObjectRepository(mockCosmicClient);
  });

  describe('findMany', () => {
    it('should find many objects successfully', async () => {
      const query = {
        typeSlug: 'test-type',
        limit: 10,
        skip: 0,
        sort: 'created_at',
        status: 'published' as const,
      };

      const mockResponse = {
        objects: [mockCosmicObject],
        total: 1,
      };

      // Create a proper chainable mock
      const chainableMock = {
        props: mock(() => chainableMock),
        sort: mock(() => chainableMock),
        limit: mock(() => chainableMock),
        skip: mock(() => chainableMock),
        status: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve(mockResponse).then(onFulfilled);
        }),
      };

      const mockFind = spyOn(mockCosmicClient.objects, 'find').mockReturnValue(
        chainableMock,
      );

      const result = await objectRepository.findMany(query);

      expect(result).toEqual(mockResponse);
      expect(mockFind).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'test-type',
          status: 'published',
        }),
      );
    });

    it('should handle empty results', async () => {
      const query = {
        typeSlug: 'test-type',
        limit: 10,
        skip: 0,
        sort: 'created_at',
        status: 'published' as const,
      };

      const mockResponse = {
        objects: [],
        total: 0,
      };

      // Create a proper chainable mock for empty results
      const chainableMock = {
        props: mock(() => chainableMock),
        sort: mock(() => chainableMock),
        limit: mock(() => chainableMock),
        skip: mock(() => chainableMock),
        status: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve(mockResponse).then(onFulfilled);
        }),
      };

      const mockFind = spyOn(mockCosmicClient.objects, 'find').mockReturnValue(
        chainableMock,
      );

      const result = await objectRepository.findMany(query);

      expect(result).toEqual(mockResponse);
      expect(mockFind).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const query = {
        typeSlug: 'test-type',
        limit: 10,
        skip: 0,
        sort: 'created_at',
        status: 'published' as const,
      };

      // Create a chainable mock that rejects
      const chainableMock = {
        props: mock(() => chainableMock),
        sort: mock(() => chainableMock),
        limit: mock(() => chainableMock),
        skip: mock(() => chainableMock),
        status: mock(() => chainableMock),
        then: mock((onFulfilled: any, onRejected: any) => {
          return Promise.reject(new Error('API Error')).then(
            onFulfilled,
            onRejected,
          );
        }),
      };

      const mockFind = spyOn(mockCosmicClient.objects, 'find').mockReturnValue(
        chainableMock,
      );

      await expect(objectRepository.findMany(query)).rejects.toThrow();
      expect(mockFind).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find object by ID', async () => {
      // Create a proper chainable mock that supports .status()
      const chainableMock = {
        props: mock(() => chainableMock),
        status: mock(() => chainableMock),
        depth: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve({ object: mockCosmicObject }).then(
            onFulfilled,
          );
        }),
      };

      spyOn(mockCosmicClient.objects, 'findOne').mockReturnValue(chainableMock);

      const result = await objectRepository.findOne({ id: 'test-id' });

      expect(result).toEqual(mockCosmicObject);
      expect(mockCosmicClient.objects.findOne).toHaveBeenCalledWith({
        id: 'test-id',
      });
    });

    it('should find object by slug and type', async () => {
      // Create a proper chainable mock that supports .status()
      const chainableMock = {
        props: mock(() => chainableMock),
        status: mock(() => chainableMock),
        depth: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve({ object: mockCosmicObject }).then(
            onFulfilled,
          );
        }),
      };

      spyOn(mockCosmicClient.objects, 'findOne').mockReturnValue(chainableMock);

      const result = await objectRepository.findOne({
        slug: 'test-object',
        typeSlug: 'test-type',
      });

      expect(result).toEqual(mockCosmicObject);
    });

    it('should throw error when object not found', async () => {
      // Create a proper chainable mock that supports .status()
      const chainableMock = {
        props: mock(() => chainableMock),
        status: mock(() => chainableMock),
        depth: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve({ object: null }).then(onFulfilled);
        }),
      };

      spyOn(mockCosmicClient.objects, 'findOne').mockReturnValue(chainableMock);

      await expect(
        objectRepository.findOne({ id: 'nonexistent-id' }),
      ).rejects.toThrow('Object with identifier');
    });
  });

  describe('create', () => {
    it('should create object successfully', async () => {
      const createData = {
        title: 'New Object',
        typeSlug: 'test-type',
        status: 'published' as const,
      };

      spyOn(mockCosmicClient.objects, 'insertOne').mockResolvedValue({
        object: mockCosmicObject,
      });

      const result = await objectRepository.create(createData);

      expect(result).toEqual(mockCosmicObject);
      expect(mockCosmicClient.objects.insertOne).toHaveBeenCalledWith({
        title: 'New Object',
        type: 'test-type',
        status: 'published',
      });
    });

    it('should handle creation errors', async () => {
      const createData = {
        title: 'New Object',
        typeSlug: 'test-type',
        status: 'published' as const,
      };

      spyOn(mockCosmicClient.objects, 'insertOne').mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(objectRepository.create(createData)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update object by ID', async () => {
      const query = { id: 'test-id' };
      const updateData = { title: 'Updated Object' };

      spyOn(mockCosmicClient.objects, 'updateOne').mockResolvedValue({
        object: { ...mockCosmicObject, title: 'Updated Object' },
      });

      const result = await objectRepository.update(query, updateData);

      expect(result.title).toBe('Updated Object');
      expect(mockCosmicClient.objects.updateOne).toHaveBeenCalledWith(
        'test-id',
        updateData,
      );
    });

    it('should update object by slug and type', async () => {
      const query = {
        slug: 'test-object',
        typeSlug: 'test-type',
      };
      const updateData = { title: 'Updated Object' };

      // Create a proper chainable mock that supports .status()
      const chainableMock = {
        props: mock(() => chainableMock),
        status: mock(() => chainableMock),
        depth: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve({ object: mockCosmicObject }).then(
            onFulfilled,
          );
        }),
      };

      spyOn(mockCosmicClient.objects, 'findOne').mockReturnValue(chainableMock);

      spyOn(mockCosmicClient.objects, 'updateOne').mockResolvedValue({
        object: { ...mockCosmicObject, title: 'Updated Object' },
      });

      const result = await objectRepository.update(query, updateData);

      expect(result.title).toBe('Updated Object');
    });
  });

  describe('delete', () => {
    it('should delete object by ID', async () => {
      const query = { id: 'test-id' };

      spyOn(mockCosmicClient.objects, 'deleteOne').mockResolvedValue({});

      await objectRepository.delete(query);

      expect(mockCosmicClient.objects.deleteOne).toHaveBeenCalledWith(
        'test-id',
      );
    });

    it('should delete object by slug and type', async () => {
      const query = {
        slug: 'test-object',
        typeSlug: 'test-type',
      };

      // Create a proper chainable mock that supports .status()
      const chainableMock = {
        props: mock(() => chainableMock),
        status: mock(() => chainableMock),
        depth: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve({ object: mockCosmicObject }).then(
            onFulfilled,
          );
        }),
      };

      spyOn(mockCosmicClient.objects, 'findOne').mockReturnValue(chainableMock);

      spyOn(mockCosmicClient.objects, 'deleteOne').mockResolvedValue({});

      await objectRepository.delete(query);

      expect(mockCosmicClient.objects.deleteOne).toHaveBeenCalledWith(
        'test-id',
      );
    });
  });

  describe('search', () => {
    it('should search objects successfully', async () => {
      const searchQuery = {
        query: 'test search',
        limit: 10,
      };

      const mockResponse = {
        objects: [mockCosmicObject],
        total: 1,
      };

      // Create a proper chainable mock for find
      const chainableMock = {
        props: mock(() => chainableMock),
        sort: mock(() => chainableMock),
        limit: mock(() => chainableMock),
        skip: mock(() => chainableMock),
        status: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve(mockResponse).then(onFulfilled);
        }),
      };

      spyOn(mockCosmicClient.objects, 'find').mockReturnValue(chainableMock);

      const result = await objectRepository.search(searchQuery);

      expect(result).toEqual(mockResponse);
      expect(mockCosmicClient.objects.find).toHaveBeenCalledWith({
        q: 'test search',
      });
    });

    it('should search with type filter', async () => {
      const searchQuery = {
        query: 'test search',
        typeSlug: 'test-type',
        limit: 10,
      };

      const mockResponse = {
        objects: [mockCosmicObject],
        total: 1,
      };

      // Create a proper chainable mock for find
      const chainableMock = {
        props: mock(() => chainableMock),
        sort: mock(() => chainableMock),
        limit: mock(() => chainableMock),
        skip: mock(() => chainableMock),
        status: mock(() => chainableMock),
        then: mock((onFulfilled: any) => {
          return Promise.resolve(mockResponse).then(onFulfilled);
        }),
      };

      spyOn(mockCosmicClient.objects, 'find').mockReturnValue(chainableMock);

      const result = await objectRepository.search(searchQuery);

      expect(result).toEqual(mockResponse);
      expect(mockCosmicClient.objects.find).toHaveBeenCalledWith({
        q: 'test search',
        type: 'test-type',
      });
    });
  });

  describe('input validation', () => {
    it('should validate required fields for creation', async () => {
      const createData = {
        title: '',
        typeSlug: 'test-type',
        status: 'published' as const,
      };

      // This should throw due to the BaseRepository's validateRequired check
      await expect(objectRepository.create(createData)).rejects.toThrow(
        'title is required for create object',
      );
    });

    it('should validate query parameters for findOne', async () => {
      // This should throw due to the custom validation in findOne
      await expect(objectRepository.findOne({ id: '' })).rejects.toThrow(
        'Either id or both slug and typeSlug must be provided',
      );
    });

    it('should validate slug and typeSlug combination', async () => {
      // This should throw due to the custom validation in findOne
      await expect(
        objectRepository.findOne({ slug: '', typeSlug: 'test-type' }),
      ).rejects.toThrow('Either id or both slug and typeSlug must be provided');
    });
  });
});
