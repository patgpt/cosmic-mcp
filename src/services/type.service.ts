// Type Service - Business logic for object type operations

import { ValidationError } from "../errors/base.error";
import { ObjectRepository } from "../repositories/object.repository";
import type {
  CreateObjectTypeData,
  DeleteObjectTypeQuery,
  GetObjectTypeQuery,
  ListObjectTypesQuery,
  TypeRepository,
  UpdateObjectTypeData,
} from "../repositories/type.repository";
import type { CosmicObjectType, CosmicResponse } from "../types/cosmic.types";
import logger from "../utils/logger";
import { defaultRateLimiter } from "../utils/rate-limiter";

export class TypeService {
  private logger = logger.withContext({ service: "TypeService" });

  constructor(
    private typeRepository: TypeRepository,
    private objectRepository: ObjectRepository
  ) {}

  async listObjectTypes(
    query: ListObjectTypesQuery
  ): Promise<CosmicResponse<CosmicObjectType>> {
    this.logger.info("Listing object types");

    // Rate limiting
    defaultRateLimiter.checkAndConsume("list_object_types");

    return await this.typeRepository.findMany(query);
  }

  async getObjectType(query: GetObjectTypeQuery): Promise<CosmicObjectType> {
    this.logger.info("Getting object type", { slug: query.slug });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("get_object_type");

    return await this.typeRepository.findOne(query);
  }

  async createObjectType(
    data: CreateObjectTypeData
  ): Promise<CosmicObjectType> {
    this.logger.info("Creating object type", {
      title: data.title,
      slug: data.slug,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("create_object_type");

    // Business rule: Validate slug format
    this.validateSlugFormat(data.slug);

    // Business rule: Check if slug already exists
    const existingType = await this.checkTypeSlugExists(data.slug);
    if (existingType) {
      throw new ValidationError(
        `Object type with slug '${data.slug}' already exists`,
        { slug: data.slug }
      );
    }

    // Business rule: Auto-generate singular/plural if not provided
    if (!data.singular) {
      data.singular = data.title;
    }

    if (!data.plural) {
      data.plural = this.generatePluralForm(data.title);
    }

    return await this.typeRepository.create(data);
  }

  async updateObjectType(
    query: GetObjectTypeQuery,
    data: UpdateObjectTypeData
  ): Promise<CosmicObjectType> {
    this.logger.info("Updating object type", { slug: query.slug });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("update_object_type");

    // Business rule: Ensure the object type exists before updating
    await this.typeRepository.findOne(query);

    return await this.typeRepository.update(query, data);
  }

  async deleteObjectType(query: DeleteObjectTypeQuery): Promise<void> {
    this.logger.info("Deleting object type", { slug: query.slug });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("delete_object_type");

    // Business rule: Ensure the object type exists before deleting
    const existingType = await this.typeRepository.findOne(query);

    // Business rule: Check if there are objects of this type
    const objectsOfType = await this.objectRepository.findMany({
      typeSlug: query.slug,
      status: "any",
      limit: 1,
      skip: 0,
      sort: "created_at",
    });

    if (objectsOfType.objects && objectsOfType.objects.length > 0) {
      throw new ValidationError(
        `Cannot delete object type '${query.slug}' because it has ${objectsOfType.total || "existing"} objects. Delete all objects of this type first.`,
        {
          slug: query.slug,
          objectCount: objectsOfType.total || objectsOfType.objects.length,
        }
      );
    }

    // Log which object type is being deleted for audit purposes
    this.logger.info("Confirmed object type deletion", {
      slug: existingType.slug,
      title: existingType.title,
      id: existingType.id,
    });

    await this.typeRepository.delete(query);
  }

  async getObjectTypeStats(): Promise<{
    totalTypes: number;
    types: Array<{
      slug: string;
      title: string;
      objectCount: number;
    }>;
  }> {
    this.logger.info("Getting object type statistics");

    // Rate limiting
    defaultRateLimiter.checkAndConsume("get_type_stats");

    const { totalCount, types } =
      await this.typeRepository.getObjectTypeStats();

    // Get object counts for each type
    const typeStats = await Promise.all(
      types.map(async (slug) => {
        const objectsResult = await this.objectRepository.findMany({
          typeSlug: slug,
          status: "any",
          limit: 1,
          skip: 0,
          sort: "created_at",
        });

        const type = await this.typeRepository.findOne({ slug });

        return {
          slug,
          title: type.title,
          objectCount: objectsResult.total || 0,
        };
      })
    );

    const stats = {
      totalTypes: totalCount,
      types: typeStats,
    };

    this.logger.info("Object type statistics calculated", stats);

    return stats;
  }

  async validateTypeSlug(slug: string): Promise<{
    isValid: boolean;
    isAvailable: boolean;
    suggestions?: string[];
  }> {
    this.logger.info("Validating type slug", { slug });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("validate_slug");

    const validation = {
      isValid: this.isValidSlugFormat(slug),
      isAvailable: false,
      suggestions: [] as string[],
    };

    if (validation.isValid) {
      validation.isAvailable = !(await this.checkTypeSlugExists(slug));

      // If not available, generate suggestions
      if (!validation.isAvailable) {
        validation.suggestions = this.generateSlugSuggestions(slug);
      }
    }

    this.logger.info("Slug validation completed", validation);

    return validation;
  }

  async duplicateObjectType(
    sourceSlug: string,
    newSlug: string,
    newTitle: string
  ): Promise<CosmicObjectType> {
    this.logger.info("Duplicating object type", {
      sourceSlug,
      newSlug,
      newTitle,
    });

    // Rate limiting
    defaultRateLimiter.checkAndConsume("duplicate_type");

    // Get source object type
    const sourceType = await this.typeRepository.findOne({ slug: sourceSlug });

    // Validate new slug
    this.validateSlugFormat(newSlug);
    const slugExists = await this.checkTypeSlugExists(newSlug);
    if (slugExists) {
      throw new ValidationError(
        `Object type with slug '${newSlug}' already exists`,
        { slug: newSlug }
      );
    }

    // Create new object type based on source
    const newTypeData: CreateObjectTypeData = {
      title: newTitle,
      slug: newSlug,
      singular: newTitle,
      plural: this.generatePluralForm(newTitle),
    };

    if (sourceType.metafields) {
      newTypeData.options = { metafields: sourceType.metafields };
    }

    const newType = await this.typeRepository.create(newTypeData);

    this.logger.info("Object type duplicated successfully", {
      sourceSlug,
      newSlug,
      newId: newType.id,
    });

    return newType;
  }

  // Private helper methods for business logic

  private validateSlugFormat(slug: string): void {
    if (!this.isValidSlugFormat(slug)) {
      throw new ValidationError(
        "Invalid slug format. Must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.",
        { slug }
      );
    }
  }

  private isValidSlugFormat(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 50;
  }

  private async checkTypeSlugExists(slug: string): Promise<boolean> {
    return await this.typeRepository.typeExists(slug);
  }

  private generatePluralForm(title: string): string {
    const word = title.toLowerCase().trim();

    // Simple pluralization rules
    if (
      word.endsWith("y") &&
      word.length > 1 &&
      !["a", "e", "i", "o", "u"].includes(word[word.length - 2] || "")
    ) {
      return word.slice(0, -1) + "ies";
    } else if (
      word.endsWith("s") ||
      word.endsWith("sh") ||
      word.endsWith("ch") ||
      word.endsWith("x") ||
      word.endsWith("z")
    ) {
      return word + "es";
    } else if (word.endsWith("f")) {
      return word.slice(0, -1) + "ves";
    } else if (word.endsWith("fe")) {
      return word.slice(0, -2) + "ves";
    } else {
      return word + "s";
    }
  }

  private generateSlugSuggestions(baseSlug: string): string[] {
    const suggestions: string[] = [];

    // Add numbered variations
    for (let i = 2; i <= 5; i++) {
      suggestions.push(`${baseSlug}-${i}`);
    }

    // Add common suffixes
    const suffixes = ["new", "v2", "alt", "copy"];
    suffixes.forEach((suffix) => {
      suggestions.push(`${baseSlug}-${suffix}`);
    });

    return suggestions;
  }
}
