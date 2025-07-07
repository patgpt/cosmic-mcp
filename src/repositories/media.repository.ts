// Media Repository - Handles all CRUD operations for Cosmic media


import { CosmicMediaNotFoundError } from "../errors/cosmic.error";
import type {
  CreateMediaInput as CosmicCreateMediaInput,
  CosmicMedia,
  CosmicQueryOptions,
  CosmicResponse,
} from "../types/cosmic.types";
import { BaseRepository } from "./base.repository";

// Repository-specific input types
export interface ListMediaQuery extends Record<string, unknown> {
  limit: number;
  skip: number;
  folder?: string;
}

export interface GetMediaQuery extends Record<string, unknown> {
  id: string;
}

export interface CreateMediaData extends Record<string, unknown> {
  fileData: string; // base64 encoded
  filename: string;
  folder?: string;
  metadata?: Record<string, unknown>;
  altText?: string;
}

export interface UpdateMediaData extends Record<string, unknown> {
  metadata?: Record<string, unknown>;
  altText?: string;
}

export interface DeleteMediaQuery extends Record<string, unknown> {
  id: string;
}

export class MediaRepository extends BaseRepository {
  async findMany(query: ListMediaQuery): Promise<CosmicResponse<CosmicMedia>> {
    this.logOperation("findMany media", this.sanitizeForLogging(query));

    try {
      const cosmicQuery: CosmicQueryOptions = {};

      if (query.folder) {
        cosmicQuery.folder = query.folder;
      }

      const result = await this.client.media
        .find(cosmicQuery)
        .limit(query.limit)
        .skip(query.skip);

      const mediaArray = Array.isArray(result.media)
        ? result.media
        : result.media
          ? [result.media]
          : [];

      this.logSuccess("findMany media", {
        count: mediaArray.length,
      });

      return { ...result, media: mediaArray };
    } catch (error) {
      this.handleError(error, "findMany media", query);
    }
  }

  async findOne(query: GetMediaQuery): Promise<CosmicMedia> {
    this.logOperation("findOne media", this.sanitizeForLogging(query));

    try {
      this.validateId(query.id, "findOne media");

      const result = await this.client.media.findOne({
        id: query.id,
      });

      if (!result.media) {
        throw new CosmicMediaNotFoundError(query.id);
      }

      const media = Array.isArray(result.media)
        ? result.media[0]
        : result.media;

      if (!media) {
        throw new CosmicMediaNotFoundError(query.id);
      }

      this.logSuccess("findOne media", {
        id: media.id,
        name: media.name,
      });

      return media;
    } catch (error) {
      this.handleError(error, "findOne media", query);
    }
  }

  async create(data: CreateMediaData): Promise<CosmicMedia> {
    this.logOperation("create media", this.sanitizeForLogging(data));

    try {
      this.validateRequired(data.fileData, "fileData", "create media");
      this.validateRequired(data.filename, "filename", "create media");

      // Convert base64 to buffer
      const buffer = Buffer.from(data.fileData, "base64");

      const mediaData: CosmicCreateMediaInput = {
        media: buffer,
        filename: data.filename,
      };

      if (data.folder) {
        mediaData.folder = data.folder;
      }

      if (data.metadata) {
        mediaData.metadata = data.metadata;
      }

      if (data.altText) {
        mediaData.alt_text = data.altText;
      }

      const result = await this.client.media.insertOne(mediaData);

      if (!result.media) {
        throw new Error("Failed to create media - no media returned");
      }

      const media = Array.isArray(result.media)
        ? result.media[0]
        : result.media;

      if (!media) {
        throw new Error("Failed to create media - no media returned");
      }

      this.logSuccess("create media", {
        id: media.id,
        name: media.name,
        size: media.size,
      });

      return media;
    } catch (error) {
      this.handleError(error, "create media", data);
    }
  }

  async update(
    query: GetMediaQuery,
    data: UpdateMediaData
  ): Promise<CosmicMedia> {
    this.logOperation("update media", {
      ...this.sanitizeForLogging(query),
      ...this.sanitizeForLogging(data),
    });

    try {
      this.validateId(query.id, "update media");

      const updateData: Record<string, unknown> = {};

      if (data.metadata) {
        updateData["metadata"] = data.metadata;
      }

      if (data.altText !== undefined) {
        updateData["alt_text"] = data.altText;
      }

      const result = await this.client.media.updateOne(query.id, updateData);

      if (!result.media) {
        throw new Error("Failed to update media - no media returned");
      }

      const media = Array.isArray(result.media)
        ? result.media[0]
        : result.media;

      if (!media) {
        throw new Error("Failed to update media - no media returned");
      }

      this.logSuccess("update media", {
        id: media.id,
        name: media.name,
      });

      return media;
    } catch (error) {
      this.handleError(error, "update media", { query, data });
    }
  }

  async delete(query: DeleteMediaQuery): Promise<void> {
    this.logOperation("delete media", this.sanitizeForLogging(query));

    try {
      this.validateId(query.id, "delete media");

      await this.client.media.deleteOne(query.id);

      this.logSuccess("delete media", { id: query.id });
    } catch (error) {
      this.handleError(error, "delete media", query);
    }
  }

  async getMediaStats(): Promise<{ totalCount: number; totalSize: number }> {
    this.logOperation("get media stats");

    try {
      // Get all media without pagination to calculate stats
      const result = await this.client.media.find({});

      const mediaArray = Array.isArray(result.media)
        ? result.media
        : result.media
          ? [result.media]
          : [];
      const totalCount = mediaArray.length;
      const totalSize = mediaArray.reduce(
        (sum: number, media: CosmicMedia) => sum + media.size,
        0
      );

      this.logSuccess("get media stats", { totalCount, totalSize });

      return { totalCount, totalSize };
    } catch (error) {
      this.handleError(error, "get media stats");
    }
  }

  async getMediaByFolder(folder: string): Promise<CosmicMedia[]> {
    this.logOperation("get media by folder", { folder });

    try {
      this.validateRequired(folder, "folder", "get media by folder");

      const result = await this.client.media.find({ folder });

      const mediaArray = Array.isArray(result.media)
        ? result.media
        : result.media
          ? [result.media]
          : [];

      this.logSuccess("get media by folder", {
        folder,
        count: mediaArray.length,
      });

      return mediaArray;
    } catch (error) {
      this.handleError(error, "get media by folder", { folder });
    }
  }
}
