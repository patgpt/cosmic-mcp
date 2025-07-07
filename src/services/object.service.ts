// Object Service - Business logic for object operations

import { ValidationError } from "../errors/base.error";
import type {
  CreateObjectData,
  DeleteObjectQuery,
  GetObjectQuery,
  ListObjectsQuery,
  ObjectRepository,
  SearchObjectsQuery,
  UpdateObjectData,
} from "../repositories/object.repository";
import { TypeRepository } from "../repositories/type.repository";
import type { CosmicObject, CosmicResponse } from "../types/cosmic.types";
import logger from "../utils/logger";
import { defaultRateLimiter } from "../utils/rate-limiter";

export class ObjectService {
  private logger = logger.withContext({ service: "ObjectService" });

  constructor(
    private objectRepository: ObjectRepository,
    private typeRepository: TypeRepository
  ) {}

  async listObjects(
    query: ListObjectsQuery
  ): Promise<CosmicResponse<CosmicObject>> {
    this.logger.info("Listing objects", {
      typeSlug: query.typeSlug,
      limit: query.limit,
      skip: query.skip,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("list_objects");

    // Validate type slug if provided
    if (query.typeSlug) {
      const typeExists = await this.typeRepository.typeExists(query.typeSlug);
      if (!typeExists) {
        throw new ValidationError(
          `Object type '${query.typeSlug}' does not exist`,
          { typeSlug: query.typeSlug }
        );
      }
    }

    return await this.objectRepository.findMany(query);
  }

  async getObject(query: GetObjectQuery): Promise<CosmicObject> {
    this.logger.info("Getting object", {
      id: query.id,
      slug: query.slug,
      typeSlug: query.typeSlug,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("get_object");

    // Validate type slug if provided (for slug-based queries)
    if (query.typeSlug) {
      const typeExists = await this.typeRepository.typeExists(query.typeSlug);
      if (!typeExists) {
        throw new ValidationError(
          `Object type '${query.typeSlug}' does not exist`,
          { typeSlug: query.typeSlug }
        );
      }
    }

    return await this.objectRepository.findOne(query);
  }

  async createObject(data: CreateObjectData): Promise<CosmicObject> {
    this.logger.info("Creating object", {
      title: data.title,
      typeSlug: data.typeSlug,
      status: data.status,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("create_object");

    // Validate object type exists
    const typeExists = await this.typeRepository.typeExists(data.typeSlug);
    if (!typeExists) {
      throw new ValidationError(
        `Object type '${data.typeSlug}' does not exist`,
        { typeSlug: data.typeSlug }
      );
    }

    // Business rule: Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = this.generateSlugFromTitle(data.title);
    }

    // Business rule: Validate slug uniqueness for the type
    if (data.slug) {
      const existingObject = await this.checkObjectSlugExists(
        data.slug,
        data.typeSlug
      );
      if (existingObject) {
        throw new ValidationError(
          `An object with slug '${data.slug}' already exists in type '${data.typeSlug}'`,
          { slug: data.slug, typeSlug: data.typeSlug }
        );
      }
    }

    return await this.objectRepository.create(data);
  }

  async updateObject(
    query: GetObjectQuery,
    data: UpdateObjectData
  ): Promise<CosmicObject> {
    this.logger.info("Updating object", {
      id: query.id,
      slug: query.slug,
      typeSlug: query.typeSlug,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("update_object");

    // Validate type slug if provided
    if (query.typeSlug) {
      const typeExists = await this.typeRepository.typeExists(query.typeSlug);
      if (!typeExists) {
        throw new ValidationError(
          `Object type '${query.typeSlug}' does not exist`,
          { typeSlug: query.typeSlug }
        );
      }
    }

    // Business rule: Ensure the object exists before updating
    await this.objectRepository.findOne(query);

    return await this.objectRepository.update(query, data);
  }

  async deleteObject(query: DeleteObjectQuery): Promise<void> {
    this.logger.info("Deleting object", {
      id: query.id,
      slug: query.slug,
      typeSlug: query.typeSlug,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("delete_object");

    // Validate type slug if provided
    if (query.typeSlug) {
      const typeExists = await this.typeRepository.typeExists(query.typeSlug);
      if (!typeExists) {
        throw new ValidationError(
          `Object type '${query.typeSlug}' does not exist`,
          { typeSlug: query.typeSlug }
        );
      }
    }

    // Business rule: Ensure the object exists before deleting
    const findQuery: GetObjectQuery = {};
    if (query.id) findQuery.id = query.id;
    if (query.slug) findQuery.slug = query.slug;
    if (query.typeSlug) findQuery.typeSlug = query.typeSlug;

    const existingObject = await this.objectRepository.findOne(findQuery);

    // Log which object is being deleted for audit purposes
    this.logger.info("Confirmed object deletion", {
      id: existingObject.id,
      title: existingObject.title,
      type: existingObject.type,
    });

    await this.objectRepository.delete(query);
  }

  async searchObjects(
    query: SearchObjectsQuery
  ): Promise<CosmicResponse<CosmicObject>> {
    this.logger.info("Searching objects", {
      query: query.query,
      typeSlug: query.typeSlug,
      limit: query.limit,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("search_objects");

    // Validate type slug if provided
    if (query.typeSlug) {
      const typeExists = await this.typeRepository.typeExists(query.typeSlug);
      if (!typeExists) {
        throw new ValidationError(
          `Object type '${query.typeSlug}' does not exist`,
          { typeSlug: query.typeSlug }
        );
      }
    }

    // Business rule: Sanitize search query
    const sanitizedQuery = {
      ...query,
      query: this.sanitizeSearchQuery(query.query),
    };

    return await this.objectRepository.search(sanitizedQuery);
  }

  async getObjectStats(): Promise<{
    totalObjects: number;
    objectsByType: Record<string, number>;
    objectsByStatus: Record<string, number>;
  }> {
    this.logger.info("Getting object statistics");

    // Rate limiting
    defaultRateLimiter.checkAndConsume("get_stats");

    // Get all objects (might need pagination for large datasets)
    const result = await this.objectRepository.findMany({
      status: "any",
      limit: 1000, // Consider pagination for very large datasets
      skip: 0,
      sort: "created_at",
    });

    const objects = result.objects || [];

    const stats = {
      totalObjects: objects.length,
      objectsByType: {} as Record<string, number>,
      objectsByStatus: {} as Record<string, number>,
    };

    // Count by type and status
    objects.forEach((obj) => {
      // Count by type
      stats.objectsByType[obj.type] = (stats.objectsByType[obj.type] || 0) + 1;

      // Count by status
      stats.objectsByStatus[obj.status] =
        (stats.objectsByStatus[obj.status] || 0) + 1;
    });

    this.logger.info("Object statistics calculated", stats);

    return stats;
  }

  // Private helper methods for business logic

  private generateSlugFromTitle(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }

  private async checkObjectSlugExists(
    slug: string,
    typeSlug: string
  ): Promise<boolean> {
    try {
      await this.objectRepository.findOne({ slug, typeSlug });
      return true;
    } catch (error) {
      // If object not found, slug is available
      return false;
    }
  }

  private sanitizeSearchQuery(query: string): string {
    // Remove potentially harmful characters and normalize
    return query
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML/XML tags
      .substring(0, 500); // Limit query length
  }
}
