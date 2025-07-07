// Media Service - Business logic for media operations

import { ValidationError } from "../errors/base.error";
import type {
  CreateMediaData,
  DeleteMediaQuery,
  GetMediaQuery,
  ListMediaQuery,
  MediaRepository,
  UpdateMediaData,
} from "../repositories/media.repository";
import type { CosmicMedia, CosmicResponse } from "../types/cosmic.types";
import logger from "../utils/logger";
import { defaultRateLimiter } from "../utils/rate-limiter";

export class MediaService {
  private logger = logger.withContext({ service: "MediaService" });

  // File size limits in bytes
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "audio/mp3",
    "audio/wav",
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/json",
  ];

  constructor(private mediaRepository: MediaRepository) {}

  async listMedia(query: ListMediaQuery): Promise<CosmicResponse<CosmicMedia>> {
    this.logger.info("Listing media", {
      limit: query.limit,
      skip: query.skip,
      folder: query.folder,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("list_media");

    return await this.mediaRepository.findMany(query);
  }

  async getMedia(query: GetMediaQuery): Promise<CosmicMedia> {
    this.logger.info("Getting media", { id: query.id });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("get_media");

    return await this.mediaRepository.findOne(query);
  }

  async uploadMedia(data: CreateMediaData): Promise<CosmicMedia> {
    this.logger.info("Uploading media", {
      filename: data.filename,
      folder: data.folder,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("upload_media");

    // Business rules validation
    this.validateFileData(data.fileData);
    this.validateFilename(data.filename);
    this.validateFileSize(data.fileData);

    const mimeType = this.getMimeTypeFromFilename(data.filename);
    this.validateMimeType(mimeType);

    // Business rule: Sanitize folder path
    if (data.folder) {
      data.folder = this.sanitizeFolderPath(data.folder);
    }

    // Business rule: Generate alt text from filename if not provided
    if (!data.altText) {
      data.altText = this.generateAltTextFromFilename(data.filename);
    }

    return await this.mediaRepository.create(data);
  }

  async updateMedia(
    query: GetMediaQuery,
    data: UpdateMediaData
  ): Promise<CosmicMedia> {
    this.logger.info("Updating media", { id: query.id });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("update_media");

    // Business rule: Ensure the media exists before updating
    await this.mediaRepository.findOne(query);

    return await this.mediaRepository.update(query, data);
  }

  async deleteMedia(query: DeleteMediaQuery): Promise<void> {
    this.logger.info("Deleting media", { id: query.id });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("delete_media");

    // Business rule: Ensure the media exists before deleting
    const existingMedia = await this.mediaRepository.findOne({ id: query.id });

    // Log which media is being deleted for audit purposes
    this.logger.info("Confirmed media deletion", {
      id: existingMedia.id,
      name: existingMedia.name,
      size: existingMedia.size,
      type: existingMedia.type,
    });

    await this.mediaRepository.delete(query);
  }

  async getMediaStats(): Promise<{
    totalCount: number;
    totalSize: number;
    averageSize: number;
    mediaByType: Record<string, number>;
    mediaByFolder: Record<string, number>;
  }> {
    this.logger.info("Getting media statistics");

    // Rate limiting
    defaultRateLimiter.checkAndConsume("get_stats");

    const { totalCount, totalSize } =
      await this.mediaRepository.getMediaStats();

    // Get detailed stats
    const allMedia = await this.mediaRepository.findMany({
      limit: 1000, // Consider pagination for very large datasets
      skip: 0,
    });

    const mediaArray = Array.isArray(allMedia.media) 
      ? allMedia.media 
      : (allMedia.media ? [allMedia.media] : []);

    const stats = {
      totalCount,
      totalSize,
      averageSize: totalCount > 0 ? Math.round(totalSize / totalCount) : 0,
      mediaByType: {} as Record<string, number>,
      mediaByFolder: {} as Record<string, number>,
    };

    // Count by type and folder
    mediaArray.forEach((item: CosmicMedia) => {
      // Count by type
      const fileType = this.getFileTypeCategory(item.type);
      stats.mediaByType[fileType] = (stats.mediaByType[fileType] || 0) + 1;

      // Count by folder
      const folder = item.folder || "root";
      stats.mediaByFolder[folder] = (stats.mediaByFolder[folder] || 0) + 1;
    });

    this.logger.info("Media statistics calculated", stats);

    return stats;
  }

  async getMediaByFolder(folder: string): Promise<CosmicMedia[]> {
    this.logger.info("Getting media by folder", { folder });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("get_media_folder");

    // Business rule: Sanitize folder path
    const sanitizedFolder = this.sanitizeFolderPath(folder);

    return await this.mediaRepository.getMediaByFolder(sanitizedFolder);
  }

  async optimizeMedia(id: string): Promise<{
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
  }> {
    this.logger.info("Optimizing media", { id });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("optimize_media");

    const media = await this.mediaRepository.findOne({ id });

    // This is a placeholder for media optimization logic
    // In a real implementation, you might use image optimization libraries
    const originalSize = media.size;
    const optimizedSize = Math.round(originalSize * 0.8); // Simulate 20% compression
    const compressionRatio = (originalSize - optimizedSize) / originalSize;

    this.logger.info("Media optimization completed", {
      id,
      originalSize,
      optimizedSize,
      compressionRatio,
    });

    return {
      originalSize,
      optimizedSize,
      compressionRatio,
    };
  }

  // Private helper methods for business logic

  private validateFileData(fileData: string): void {
    if (!fileData || fileData.trim().length === 0) {
      throw new ValidationError("File data is required");
    }

    // Check if it's valid base64
    try {
      Buffer.from(fileData, "base64");
    } catch (error) {
      throw new ValidationError("Invalid base64 file data");
    }
  }

  private validateFilename(filename: string): void {
    if (!filename || filename.trim().length === 0) {
      throw new ValidationError("Filename is required");
    }

    // Check for valid filename format
    const validFilenameRegex = /^[a-zA-Z0-9._-]+\.[a-zA-Z0-9]+$/;
    if (!validFilenameRegex.test(filename)) {
      throw new ValidationError("Invalid filename format");
    }

    // Check filename length
    if (filename.length > 255) {
      throw new ValidationError("Filename is too long (max 255 characters)");
    }
  }

  private validateFileSize(fileData: string): void {
    const buffer = Buffer.from(fileData, "base64");
    if (buffer.length > this.MAX_FILE_SIZE) {
      const sizeMB = Math.round(buffer.length / (1024 * 1024));
      const maxSizeMB = Math.round(this.MAX_FILE_SIZE / (1024 * 1024));
      throw new ValidationError(
        `File size (${sizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
      );
    }
  }

  private getMimeTypeFromFilename(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();

    const mimeTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      mp4: "video/mp4",
      webm: "video/webm",
      mp3: "audio/mp3",
      wav: "audio/wav",
      pdf: "application/pdf",
      txt: "text/plain",
      csv: "text/csv",
      json: "application/json",
    };

    return mimeTypeMap[extension || ""] || "application/octet-stream";
  }

  private validateMimeType(mimeType: string): void {
    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new ValidationError(
        `File type '${mimeType}' is not allowed. Allowed types: ${this.ALLOWED_MIME_TYPES.join(", ")}`
      );
    }
  }

  private sanitizeFolderPath(folder: string): string {
    return folder
      .trim()
      .replace(/[^a-zA-Z0-9/_-]/g, "") // Remove invalid characters
      .replace(/\/+/g, "/") // Replace multiple slashes with single
      .replace(/^\/|\/$/g, ""); // Remove leading/trailing slashes
  }

  private generateAltTextFromFilename(filename: string): string {
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExtension
      .replace(/[_-]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Handle camelCase
      .toLowerCase()
      .trim();
  }

  private getFileTypeCategory(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("pdf")) return "document";
    if (mimeType.startsWith("text/")) return "text";
    return "other";
  }
}
