// Type Service Tests

import { ValidationError } from '@/errors/base.error';
import { ObjectRepository } from '@/repositories/object.repository';
import { TypeRepository } from '@/repositories/type.repository';
import { TypeService } from '@/services/type.service';
import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import {
  createMockCosmicClient,
  mockCosmicObject,
  mockCosmicObjectType,
} from '../setup';
describe('TypeService', () => {
  let typeService: TypeService;
  let mockTypeRepository: TypeRepository;
  let mockObjectRepository: ObjectRepository;

  beforeEach(() => {
    const mockClient = createMockCosmicClient();
    mockTypeRepository = new TypeRepository(mockClient as any);
    mockObjectRepository = new ObjectRepository(mockClient as any);
    typeService = new TypeService(mockTypeRepository, mockObjectRepository);

    // Mock repository methods
    spyOn(mockTypeRepository, 'findMany').mockResolvedValue({
      object_types: [mockCosmicObjectType],
      total: 1,
    });

    spyOn(mockTypeRepository, 'findOne').mockResolvedValue(
      mockCosmicObjectType,
    );
    spyOn(mockTypeRepository, 'create').mockResolvedValue(mockCosmicObjectType);
    spyOn(mockTypeRepository, 'update').mockResolvedValue(mockCosmicObjectType);
    spyOn(mockTypeRepository, 'delete').mockResolvedValue(undefined);
    spyOn(mockTypeRepository, 'typeExists').mockResolvedValue(false);
    spyOn(mockTypeRepository, 'getObjectTypeStats').mockResolvedValue({
      totalCount: 1,
      types: ['test-type'],
    });

    spyOn(mockObjectRepository, 'findMany').mockResolvedValue({
      objects: [mockCosmicObject],
      total: 1,
    });
  });

  describe('listObjectTypes', () => {
    it('should list object types successfully', async () => {
      const result = await typeService.listObjectTypes({});

      expect(result).toEqual({
        object_types: [mockCosmicObjectType],
        total: 1,
      });
      expect(mockTypeRepository.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('getObjectType', () => {
    it('should get object type by slug', async () => {
      const result = await typeService.getObjectType({
        slug: 'test-type',
      });

      expect(result).toEqual(mockCosmicObjectType);
      expect(mockTypeRepository.findOne).toHaveBeenCalledWith({
        slug: 'test-type',
      });
    });
  });

  describe('createObjectType', () => {
    it('should create object type successfully', async () => {
      const createData = {
        title: 'New Type',
        slug: 'new-type',
        singular: 'New Type',
        plural: 'New Types',
      };

      const result = await typeService.createObjectType(createData);

      expect(result).toEqual(mockCosmicObjectType);
      expect(mockTypeRepository.typeExists).toHaveBeenCalledWith('new-type');
      expect(mockTypeRepository.create).toHaveBeenCalledWith(createData);
    });

    it('should validate slug format', async () => {
      const createData = {
        title: 'Invalid Type',
        slug: 'invalid-slug-', // Invalid: ends with hyphen
        singular: 'Invalid Type',
        plural: 'Invalid Types',
      };

      await expect(typeService.createObjectType(createData)).rejects.toThrow(
        ValidationError,
      );
    });

    it('should check slug uniqueness', async () => {
      spyOn(mockTypeRepository, 'typeExists').mockResolvedValue(true);

      const createData = {
        title: 'Duplicate Type',
        slug: 'test-type',
        singular: 'Duplicate Type',
        plural: 'Duplicate Types',
      };

      await expect(typeService.createObjectType(createData)).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('updateObjectType', () => {
    it('should update object type successfully', async () => {
      const query = { slug: 'test-type' };
      const updateData = {
        title: 'Updated Type',
        singular: 'Updated Type',
        plural: 'Updated Types',
      };

      const result = await typeService.updateObjectType(query, updateData);

      expect(result).toEqual(mockCosmicObjectType);
      expect(mockTypeRepository.update).toHaveBeenCalledWith(query, updateData);
    });
  });

  describe('deleteObjectType', () => {
    it('should delete object type successfully', async () => {
      const query = { slug: 'test-type' };

      // Mock that there are no objects of this type
      spyOn(mockObjectRepository, 'findMany').mockResolvedValue({
        objects: [],
        total: 0,
      });

      await typeService.deleteObjectType(query);

      expect(mockTypeRepository.findOne).toHaveBeenCalledWith(query);
      expect(mockTypeRepository.delete).toHaveBeenCalledWith(query);
    });

    it('should check for existing objects before deletion', async () => {
      spyOn(mockObjectRepository, 'findMany').mockResolvedValue({
        objects: [mockCosmicObject],
        total: 1,
      });

      const query = { slug: 'test-type' };

      await expect(typeService.deleteObjectType(query)).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('getObjectTypeStats', () => {
    it('should get object type statistics', async () => {
      const result = await typeService.getObjectTypeStats();

      expect(result).toHaveProperty('totalTypes');
      expect(result).toHaveProperty('types');
      expect(Array.isArray(result.types)).toBe(true);
    });
  });

  describe('validateTypeSlug', () => {
    it('should validate slug format and availability', async () => {
      const result = await typeService.validateTypeSlug('valid-slug');

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('isAvailable');
      expect(result.isValid).toBe(true);
      expect(result.isAvailable).toBe(true);
    });

    it('should return invalid for bad format', async () => {
      const result = await typeService.validateTypeSlug('invalid-slug-');

      expect(result.isValid).toBe(false);
    });

    it('should return unavailable for existing slug', async () => {
      spyOn(mockTypeRepository, 'typeExists').mockResolvedValue(true);

      const result = await typeService.validateTypeSlug('existing-slug');

      expect(result.isValid).toBe(true);
      expect(result.isAvailable).toBe(false);
      expect(result.suggestions).toBeDefined();
    });
  });

  describe('duplicateObjectType', () => {
    it('should duplicate object type successfully', async () => {
      const result = await typeService.duplicateObjectType(
        'source-type',
        'new-type',
        'New Type',
      );

      expect(result).toEqual(mockCosmicObjectType);
      expect(mockTypeRepository.findOne).toHaveBeenCalledWith({
        slug: 'source-type',
      });
      expect(mockTypeRepository.typeExists).toHaveBeenCalledWith('new-type');
      expect(mockTypeRepository.create).toHaveBeenCalled();
    });

    it("should validate new slug doesn't exist", async () => {
      spyOn(mockTypeRepository, 'typeExists').mockResolvedValue(true);

      await expect(
        typeService.duplicateObjectType(
          'source-type',
          'existing-type',
          'Existing Type',
        ),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('private helper methods', () => {
    it('should generate plural forms correctly', async () => {
      // Test by creating object types and checking the plural generation
      const testCases = [
        { singular: 'Category', expectedPlural: 'categories' },
        { singular: 'Box', expectedPlural: 'boxes' },
        { singular: 'Leaf', expectedPlural: 'leaves' },
        { singular: 'Life', expectedPlural: 'lives' },
        { singular: 'Post', expectedPlural: 'posts' },
      ];

      for (const testCase of testCases) {
        const createData = {
          title: testCase.singular,
          slug: testCase.singular.toLowerCase(),
          singular: testCase.singular,
        };

        await typeService.createObjectType(createData);

        // Check that the repository was called with the expected plural
        const calls = (mockTypeRepository.create as any).mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.plural).toBe(testCase.expectedPlural);
      }
    });
  });
});
