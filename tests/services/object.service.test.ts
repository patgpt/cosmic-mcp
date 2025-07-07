// Object Service Tests

import { ObjectRepository } from '@/repositories/object.repository';
import { TypeRepository } from '@/repositories/type.repository';
import { ObjectService } from '@/services/object.service';
import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import {
  createMockCosmicClient,
  mockCosmicObject,
  mockCosmicObjectType,
} from '../setup';

describe('ObjectService', () => {
  let objectService: ObjectService;
  let mockObjectRepository: ObjectRepository;
  let mockTypeRepository: TypeRepository;

  beforeEach(() => {
    const mockClient = createMockCosmicClient();
    mockObjectRepository = new ObjectRepository(mockClient as any);
    mockTypeRepository = new TypeRepository(mockClient as any);
    objectService = new ObjectService(mockObjectRepository, mockTypeRepository);

    // Mock repository methods
    spyOn(mockObjectRepository, 'findMany').mockResolvedValue({
      objects: [mockCosmicObject],
      total: 1,
    });

    spyOn(mockObjectRepository, 'findOne').mockResolvedValue(mockCosmicObject);
    spyOn(mockObjectRepository, 'create').mockResolvedValue(mockCosmicObject);
    spyOn(mockObjectRepository, 'update').mockResolvedValue(mockCosmicObject);
    spyOn(mockObjectRepository, 'delete').mockResolvedValue(undefined);
    spyOn(mockObjectRepository, 'search').mockResolvedValue({
      objects: [mockCosmicObject],
      total: 1,
    });

    spyOn(mockTypeRepository, 'typeExists').mockResolvedValue(true);
    spyOn(mockTypeRepository, 'findOne').mockResolvedValue(
      mockCosmicObjectType,
    );
  });

  describe('listObjects', () => {
    it('should list objects successfully', async () => {
      const result = await objectService.listObjects({
        limit: 10,
        skip: 0,
        sort: 'created_at',
        status: 'published',
      });

      expect(result).toEqual({
        objects: [mockCosmicObject],
        total: 1,
      });
      expect(mockObjectRepository.findMany).toHaveBeenCalledWith({
        limit: 10,
        skip: 0,
        sort: 'created_at',
        status: 'published',
      });
    });

    it('should validate object type exists when typeSlug is provided', async () => {
      await objectService.listObjects({
        typeSlug: 'test-type',
        limit: 10,
        skip: 0,
        sort: 'created_at',
        status: 'published',
      });

      expect(mockTypeRepository.typeExists).toHaveBeenCalledWith('test-type');
    });
  });

  describe('getObject', () => {
    it('should get object by ID', async () => {
      const result = await objectService.getObject({
        id: 'test-id',
      });

      expect(result).toEqual(mockCosmicObject);
      expect(mockObjectRepository.findOne).toHaveBeenCalledWith({
        id: 'test-id',
      });
    });

    it('should get object by slug and type', async () => {
      const result = await objectService.getObject({
        slug: 'test-object',
        typeSlug: 'test-type',
      });

      expect(result).toEqual(mockCosmicObject);
      expect(mockObjectRepository.findOne).toHaveBeenCalledWith({
        slug: 'test-object',
        typeSlug: 'test-type',
      });
    });
  });

  describe('createObject', () => {
    it('should create object successfully', async () => {
      const data = {
        title: 'New Object',
        slug: 'new-object',
        typeSlug: 'test-type',
        status: 'published' as const,
        content: 'New content',
      };

      // Mock the private checkObjectSlugExists method to return false (no existing object)
      spyOn(objectService as any, 'checkObjectSlugExists').mockResolvedValue(
        false,
      );

      const result = await objectService.createObject(data);

      expect(result).toEqual(mockCosmicObject);
      expect(mockObjectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Object',
          slug: 'new-object',
          typeSlug: 'test-type',
          status: 'published',
          content: 'New content',
        }),
      );
    });

    it('should auto-generate slug from title when not provided', async () => {
      const data = {
        title: 'Test Object Title',
        typeSlug: 'test-type',
        status: 'published' as const,
        content: 'Test content',
      };

      // Mock the private checkObjectSlugExists method to return false (no existing object)
      spyOn(objectService as any, 'checkObjectSlugExists').mockResolvedValue(
        false,
      );

      const result = await objectService.createObject(data);

      expect(result).toEqual(mockCosmicObject);
      expect(mockObjectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Object Title',
          slug: 'test-object-title',
          typeSlug: 'test-type',
          status: 'published',
          content: 'Test content',
        }),
      );
    });

    it('should throw error when slug already exists', async () => {
      const data = {
        title: 'Duplicate Object',
        slug: 'duplicate-object',
        typeSlug: 'test-type',
        status: 'published' as const,
        content: 'Duplicate content',
      };

      // Mock the private checkObjectSlugExists method to return true (existing object)
      spyOn(objectService as any, 'checkObjectSlugExists').mockResolvedValue(
        true,
      );

      await expect(objectService.createObject(data)).rejects.toThrow(
        "An object with slug 'duplicate-object' already exists",
      );
    });
  });

  describe('updateObject', () => {
    it('should update object successfully', async () => {
      const query = { id: 'test-id' };
      const updateData = {
        title: 'Updated Object',
        status: 'draft' as const,
      };

      const result = await objectService.updateObject(query, updateData);

      expect(result).toEqual(mockCosmicObject);
      expect(mockObjectRepository.findOne).toHaveBeenCalledWith(query);
      expect(mockObjectRepository.update).toHaveBeenCalledWith(
        query,
        updateData,
      );
    });
  });

  describe('deleteObject', () => {
    it('should delete object successfully', async () => {
      const query = { id: 'test-id' };

      await objectService.deleteObject(query);

      expect(mockObjectRepository.findOne).toHaveBeenCalledWith(query);
      expect(mockObjectRepository.delete).toHaveBeenCalledWith(query);
    });
  });

  describe('searchObjects', () => {
    it('should search objects successfully', async () => {
      const searchQuery = {
        query: 'test search',
        limit: 10,
      };

      const result = await objectService.searchObjects(searchQuery);

      expect(result).toEqual({
        objects: [mockCosmicObject],
        total: 1,
      });
      expect(mockObjectRepository.search).toHaveBeenCalledWith({
        query: 'test search',
        limit: 10,
      });
    });
  });

  describe('getObjectStats', () => {
    it('should get object statistics', async () => {
      const result = await objectService.getObjectStats();

      expect(result).toHaveProperty('totalObjects');
      expect(result).toHaveProperty('objectsByType');
      expect(result).toHaveProperty('objectsByStatus');
    });
  });
});
