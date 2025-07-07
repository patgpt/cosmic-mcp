// Type Repository - Handles all operations for Cosmic object types

import { CosmicError } from '../errors/cosmic.error';
import type { CosmicObjectType, CosmicResponse } from '../types/cosmic.types';
import { BaseRepository } from './base.repository';

// Repository-specific input types
export interface ListObjectTypesQuery extends Record<string, unknown> {
  // Object types don't have many filtering options
}

export interface GetObjectTypeQuery extends Record<string, unknown> {
  slug: string;
}

export interface CreateObjectTypeData extends Record<string, unknown> {
  title: string;
  slug: string;
  singular?: string;
  plural?: string;
  options?: Record<string, unknown>;
}

export interface UpdateObjectTypeData extends Record<string, unknown> {
  title?: string;
  singular?: string;
  plural?: string;
  options?: Record<string, unknown>;
}

export interface DeleteObjectTypeQuery extends Record<string, unknown> {
  slug: string;
}

export class TypeRepository extends BaseRepository {
  async findMany(
    query: ListObjectTypesQuery,
  ): Promise<CosmicResponse<CosmicObjectType>> {
    this.logOperation('findMany object types', this.sanitizeForLogging(query));

    try {
      const result = await this.client.objectTypes.find();

      this.logSuccess('findMany object types', {
        count: result.object_types?.length || 0,
      });

      return result;
    } catch (error) {
      this.handleError(error, 'findMany object types', query);
    }
  }

  async findOne(query: GetObjectTypeQuery): Promise<CosmicObjectType> {
    this.logOperation('findOne object type', this.sanitizeForLogging(query));

    try {
      this.validateRequired(query.slug, 'slug', 'findOne object type');

      const result = await this.client.objectTypes.findOne(query.slug);

      if (!result.object_types?.[0]) {
        throw new CosmicError(
          `Object type with slug '${query.slug}' not found`,
          { slug: query.slug },
        );
      }

      const objectType = result.object_types[0];

      this.logSuccess('findOne object type', {
        slug: objectType.slug,
        title: objectType.title,
      });

      return objectType;
    } catch (error) {
      this.handleError(error, 'findOne object type', query);
    }
  }

  async create(data: CreateObjectTypeData): Promise<CosmicObjectType> {
    this.logOperation('create object type', this.sanitizeForLogging(data));

    try {
      this.validateRequired(data.title, 'title', 'create object type');
      this.validateRequired(data.slug, 'slug', 'create object type');

      const typeData: Record<string, unknown> = {
        title: data.title,
        slug: data.slug,
      };

      if (data.singular) {
        typeData['singular'] = data.singular;
      }

      if (data.plural) {
        typeData['plural'] = data.plural;
      }

      if (data.options) {
        typeData['options'] = data.options;
      }

      const result = await this.client.objectTypes.insertOne(typeData);

      if (!result.object_types?.[0]) {
        throw new Error(
          'Failed to create object type - no object type returned',
        );
      }

      const objectType = result.object_types[0];

      this.logSuccess('create object type', {
        slug: objectType.slug,
        title: objectType.title,
      });

      return objectType;
    } catch (error) {
      this.handleError(error, 'create object type', data);
    }
  }

  async update(
    query: GetObjectTypeQuery,
    data: UpdateObjectTypeData,
  ): Promise<CosmicObjectType> {
    this.logOperation('update object type', {
      ...this.sanitizeForLogging(query),
      ...this.sanitizeForLogging(data),
    });

    try {
      this.validateRequired(query.slug, 'slug', 'update object type');

      const updateData: Record<string, unknown> = {};

      if (data.title) {
        updateData['title'] = data.title;
      }

      if (data.singular) {
        updateData['singular'] = data.singular;
      }

      if (data.plural) {
        updateData['plural'] = data.plural;
      }

      if (data.options) {
        updateData['options'] = data.options;
      }

      const result = await this.client.objectTypes.updateOne(
        query.slug,
        updateData,
      );

      if (!result.object_types?.[0]) {
        throw new Error(
          'Failed to update object type - no object type returned',
        );
      }

      const objectType = result.object_types[0];

      this.logSuccess('update object type', {
        slug: objectType.slug,
        title: objectType.title,
      });

      return objectType;
    } catch (error) {
      this.handleError(error, 'update object type', { query, data });
    }
  }

  async delete(query: DeleteObjectTypeQuery): Promise<void> {
    this.logOperation('delete object type', this.sanitizeForLogging(query));

    try {
      this.validateRequired(query.slug, 'slug', 'delete object type');

      await this.client.objectTypes.deleteOne(query.slug);

      this.logSuccess('delete object type', { slug: query.slug });
    } catch (error) {
      this.handleError(error, 'delete object type', query);
    }
  }

  async getObjectTypeStats(): Promise<{ totalCount: number; types: string[] }> {
    this.logOperation('get object type stats');

    try {
      const result = await this.client.objectTypes.find();

      const totalCount = result.object_types?.length || 0;
      const types = result.object_types?.map((type) => type.slug) || [];

      this.logSuccess('get object type stats', { totalCount, types });

      return { totalCount, types };
    } catch (error) {
      this.handleError(error, 'get object type stats');
    }
  }

  async typeExists(slug: string): Promise<boolean> {
    this.logOperation('check if type exists', { slug });

    try {
      this.validateRequired(slug, 'slug', 'check if type exists');

      // Use findMany instead of findOne for more reliable results
      const result = await this.client.objectTypes.find();
      const exists = !!result.object_types?.some((type) => type.slug === slug);

      this.logSuccess('check if type exists', { slug, exists });

      return exists;
    } catch (error) {
      this.handleError(error, 'check if type exists', { slug });
    }
  }
}
