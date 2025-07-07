// Object Repository - Handles all CRUD operations for Cosmic objects

import { CosmicObjectNotFoundError } from '../errors/cosmic.error';
import type {
  CreateObjectInput as CosmicCreateObjectInput,
  CosmicObject,
  CosmicQueryOptions,
  CosmicResponse,
  UpdateObjectInput as CosmicUpdateObjectInput,
} from '../types/cosmic.types';
import { BaseRepository } from './base.repository';

// Repository-specific input types
export interface ListObjectsQuery extends Record<string, unknown> {
  typeSlug?: string;
  status?: 'published' | 'draft' | 'any';
  locale?: string;
  limit: number;
  skip: number;
  sort: string;
}

export interface GetObjectQuery extends Record<string, unknown> {
  id?: string;
  slug?: string;
  typeSlug?: string;
  locale?: string;
}

export interface CreateObjectData extends Record<string, unknown> {
  title: string;
  typeSlug: string;
  slug?: string;
  content?: string;
  status: 'published' | 'draft';
  metadata?: Record<string, unknown>;
  locale?: string;
}

export interface UpdateObjectData extends Record<string, unknown> {
  title?: string;
  content?: string;
  status?: 'published' | 'draft';
  metadata?: Record<string, unknown>;
  locale?: string;
}

export interface DeleteObjectQuery extends Record<string, unknown> {
  id?: string;
  slug?: string;
  typeSlug?: string;
}

export interface SearchObjectsQuery extends Record<string, unknown> {
  query: string;
  typeSlug?: string;
  limit: number;
  locale?: string;
}

export class ObjectRepository extends BaseRepository {
  async findMany(
    query: ListObjectsQuery,
  ): Promise<CosmicResponse<CosmicObject>> {
    this.logOperation('findMany objects', this.sanitizeForLogging(query));

    try {
      const cosmicQuery: CosmicQueryOptions = {};

      if (query.typeSlug) {
        cosmicQuery.type = query.typeSlug;
      }

      if (query.status && query.status !== 'any') {
        cosmicQuery.status = query.status;
      }

      if (query.locale) {
        cosmicQuery.locale = query.locale;
      }

      const result = await this.client.objects
        .find(cosmicQuery)
        .props('id,title,slug,type,status,created_at,modified_at,metadata')
        .sort(query.sort)
        .limit(query.limit)
        .skip(query.skip);

      this.logSuccess('findMany objects', {
        count: result.objects?.length || 0,
        total: result.total,
      });

      return result;
    } catch (error) {
      this.handleError(error, 'findMany objects', query);
    }
  }

  async findOne(query: GetObjectQuery): Promise<CosmicObject> {
    this.logOperation('findOne object', this.sanitizeForLogging(query));

    try {
      const cosmicQuery: CosmicQueryOptions = {};

      if (query.id) {
        cosmicQuery.id = query.id;
      } else if (query.slug && query.typeSlug) {
        cosmicQuery.slug = query.slug;
        cosmicQuery.type = query.typeSlug;
      } else {
        throw new Error('Either id or both slug and typeSlug must be provided');
      }

      if (query.locale) {
        cosmicQuery.locale = query.locale;
      }

      const result = await this.client.objects
        .findOne(cosmicQuery)
        .status('any');

      if (!result.object) {
        const identifier = query.id || query.slug || 'unknown';
        throw new CosmicObjectNotFoundError(identifier, query.typeSlug);
      }

      this.logSuccess('findOne object', {
        id: result.object.id,
        title: result.object.title,
      });

      return result.object;
    } catch (error) {
      this.handleError(error, 'findOne object', query);
    }
  }

  async create(data: CreateObjectData): Promise<CosmicObject> {
    this.logOperation('create object', this.sanitizeForLogging(data));

    try {
      this.validateRequired(data.title, 'title', 'create object');
      this.validateRequired(data.typeSlug, 'typeSlug', 'create object');

      const objectData: CosmicCreateObjectInput = {
        title: data.title,
        type: data.typeSlug,
        status: data.status,
      };

      if (data.slug) {
        objectData.slug = data.slug;
      }

      if (data.content) {
        objectData.content = data.content;
      }

      if (data.metadata) {
        objectData.metadata = data.metadata;
      }

      if (data.locale) {
        objectData.locale = data.locale;
      }

      const result = await this.client.objects.insertOne(objectData);

      if (!result.object) {
        throw new Error('Failed to create object - no object returned');
      }

      this.logSuccess('create object', {
        id: result.object.id,
        title: result.object.title,
      });

      return result.object;
    } catch (error) {
      this.handleError(error, 'create object', data);
    }
  }

  async update(
    query: GetObjectQuery,
    data: UpdateObjectData,
  ): Promise<CosmicObject> {
    this.logOperation('update object', {
      ...this.sanitizeForLogging(query),
      ...this.sanitizeForLogging(data),
    });

    try {
      // First, find the object to get its ID
      let objectId: string;

      if (query.id) {
        objectId = query.id;
      } else if (query.slug && query.typeSlug) {
        const existingObject = await this.findOne(query);
        objectId = existingObject.id;
      } else {
        throw new Error('Either id or both slug and typeSlug must be provided');
      }

      const updateData: CosmicUpdateObjectInput = {};

      if (data.title) {
        updateData.title = data.title;
      }

      if (data.content !== undefined) {
        updateData.content = data.content;
      }

      if (data.status) {
        updateData.status = data.status;
      }

      if (data.metadata) {
        updateData.metadata = data.metadata;
      }

      if (data.locale) {
        updateData.locale = data.locale;
      }

      const result = await this.client.objects.updateOne(objectId, updateData);

      if (!result.object) {
        throw new Error('Failed to update object - no object returned');
      }

      this.logSuccess('update object', {
        id: result.object.id,
        title: result.object.title,
      });

      return result.object;
    } catch (error) {
      this.handleError(error, 'update object', { query, data });
    }
  }

  async delete(query: DeleteObjectQuery): Promise<void> {
    this.logOperation('delete object', this.sanitizeForLogging(query));

    try {
      let objectId: string;

      if (query.id) {
        objectId = query.id;
      } else if (query.slug && query.typeSlug) {
        const existingObject = await this.findOne({
          slug: query.slug,
          typeSlug: query.typeSlug,
        });
        objectId = existingObject.id;
      } else {
        throw new Error('Either id or both slug and typeSlug must be provided');
      }

      await this.client.objects.deleteOne(objectId);

      this.logSuccess('delete object', { id: objectId });
    } catch (error) {
      this.handleError(error, 'delete object', query);
    }
  }

  async search(
    query: SearchObjectsQuery,
  ): Promise<CosmicResponse<CosmicObject>> {
    this.logOperation('search objects', this.sanitizeForLogging(query));

    try {
      this.validateRequired(query.query, 'query', 'search objects');

      const cosmicQuery: CosmicQueryOptions = {
        q: query.query,
      };

      if (query.typeSlug) {
        cosmicQuery.type = query.typeSlug;
      }

      if (query.locale) {
        cosmicQuery.locale = query.locale;
      }

      const result = await this.client.objects
        .find(cosmicQuery)
        .props('id,title,slug,type,status,created_at,modified_at,metadata')
        .status('any')
        .limit(query.limit);

      this.logSuccess('search objects', {
        query: query.query,
        count: result.objects?.length || 0,
      });

      return result;
    } catch (error) {
      this.handleError(error, 'search objects', query);
    }
  }
}
