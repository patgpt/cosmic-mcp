// Media Service Tests

import { ValidationError } from '@/errors/base.error';
import { MediaRepository } from '@/repositories/media.repository';
import { MediaService } from '@/services/media.service';
import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { createMockCosmicClient, mockCosmicMedia } from '../setup';

describe('MediaService', () => {
  let mediaService: MediaService;
  let mockMediaRepository: MediaRepository;

  beforeEach(() => {
    const mockClient = createMockCosmicClient();
    mockMediaRepository = new MediaRepository(mockClient as any);
    mediaService = new MediaService(mockMediaRepository);

    // Mock repository methods
    spyOn(mockMediaRepository, 'findMany').mockResolvedValue({
      media: [mockCosmicMedia],
      total: 1,
    });

    spyOn(mockMediaRepository, 'findOne').mockResolvedValue(mockCosmicMedia);
    spyOn(mockMediaRepository, 'create').mockResolvedValue(mockCosmicMedia);
    spyOn(mockMediaRepository, 'update').mockResolvedValue(mockCosmicMedia);
    spyOn(mockMediaRepository, 'delete').mockResolvedValue(undefined);
    spyOn(mockMediaRepository, 'getMediaStats').mockResolvedValue({
      totalCount: 1,
      totalSize: 1024,
    });
    spyOn(mockMediaRepository, 'getMediaByFolder').mockResolvedValue([
      mockCosmicMedia,
    ]);
  });

  describe('listMedia', () => {
    it('should list media successfully', async () => {
      const result = await mediaService.listMedia({
        limit: 10,
        skip: 0,
      });

      expect(result).toEqual({
        media: [mockCosmicMedia],
        total: 1,
      });
      expect(mockMediaRepository.findMany).toHaveBeenCalledWith({
        limit: 10,
        skip: 0,
      });
    });

    it('should list media with folder filter', async () => {
      const result = await mediaService.listMedia({
        limit: 10,
        skip: 0,
        folder: 'uploads',
      });

      expect(result).toEqual({
        media: [mockCosmicMedia],
        total: 1,
      });
      expect(mockMediaRepository.findMany).toHaveBeenCalledWith({
        limit: 10,
        skip: 0,
        folder: 'uploads',
      });
    });
  });

  describe('getMedia', () => {
    it('should get media by ID', async () => {
      const result = await mediaService.getMedia({
        id: 'test-media-id',
      });

      expect(result).toEqual(mockCosmicMedia);
      expect(mockMediaRepository.findOne).toHaveBeenCalledWith({
        id: 'test-media-id',
      });
    });
  });

  describe('uploadMedia', () => {
    const validBase64 = Buffer.from('test image data').toString('base64');

    it('should upload media successfully', async () => {
      const uploadData = {
        fileData: validBase64,
        filename: 'test-image.jpg',
        folder: 'uploads',
      };

      const result = await mediaService.uploadMedia(uploadData);

      expect(result).toEqual(mockCosmicMedia);
      expect(mockMediaRepository.create).toHaveBeenCalledWith({
        fileData: validBase64,
        filename: 'test-image.jpg',
        folder: 'uploads',
        altText: 'test image',
      });
    });

    it('should validate file data', async () => {
      const uploadData = {
        fileData: '',
        filename: 'test-image.jpg',
      };

      await expect(mediaService.uploadMedia(uploadData)).rejects.toThrow(
        ValidationError,
      );
    });

    it('should validate filename', async () => {
      const uploadData = {
        fileData: validBase64,
        filename: '',
      };

      await expect(mediaService.uploadMedia(uploadData)).rejects.toThrow(
        ValidationError,
      );
    });

    it('should validate file size', async () => {
      // Create a large base64 string (simulate file larger than 50MB)
      const largeBase64 = 'a'.repeat(70 * 1024 * 1024); // 70MB of 'a' characters

      const uploadData = {
        fileData: largeBase64,
        filename: 'large-file.jpg',
      };

      await expect(mediaService.uploadMedia(uploadData)).rejects.toThrow(
        ValidationError,
      );
    });

    it('should validate file type', async () => {
      const uploadData = {
        fileData: validBase64,
        filename: 'test-file.exe', // Executable file
      };

      await expect(mediaService.uploadMedia(uploadData)).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('updateMedia', () => {
    it('should update media successfully', async () => {
      const query = { id: 'test-media-id' };
      const updateData = {
        metadata: { description: 'Updated description' },
        altText: 'Updated alt text',
      };

      const result = await mediaService.updateMedia(query, updateData);

      expect(result).toEqual(mockCosmicMedia);
      expect(mockMediaRepository.update).toHaveBeenCalledWith(
        query,
        updateData,
      );
    });
  });

  describe('deleteMedia', () => {
    it('should delete media successfully', async () => {
      const query = { id: 'test-media-id' };

      await mediaService.deleteMedia(query);

      expect(mockMediaRepository.findOne).toHaveBeenCalledWith(query);
      expect(mockMediaRepository.delete).toHaveBeenCalledWith(query);
    });
  });

  describe('getMediaStats', () => {
    it('should get media statistics', async () => {
      const result = await mediaService.getMediaStats();

      expect(result).toHaveProperty('totalCount');
      expect(result).toHaveProperty('totalSize');
      expect(result).toHaveProperty('averageSize');
      expect(result).toHaveProperty('mediaByType');
      expect(result).toHaveProperty('mediaByFolder');
    });
  });

  describe('getMediaByFolder', () => {
    it('should get media by folder', async () => {
      const result = await mediaService.getMediaByFolder('uploads');

      expect(result).toEqual([mockCosmicMedia]);
      expect(mockMediaRepository.getMediaByFolder).toHaveBeenCalledWith(
        'uploads',
      );
    });

    it('should sanitize folder path', async () => {
      await mediaService.getMediaByFolder('/uploads/../');

      expect(mockMediaRepository.getMediaByFolder).toHaveBeenCalledWith(
        'uploads',
      );
    });
  });

  describe('optimizeMedia', () => {
    it('should optimize media and return compression stats', async () => {
      const result = await mediaService.optimizeMedia('test-media-id');

      expect(result).toHaveProperty('originalSize');
      expect(result).toHaveProperty('optimizedSize');
      expect(result).toHaveProperty('compressionRatio');
      expect(result.optimizedSize).toBeLessThan(result.originalSize);
    });
  });
});
