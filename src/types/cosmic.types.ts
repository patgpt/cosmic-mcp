/**
 * @fileoverview Cosmic JS SDK Response Types
 *
 * This module contains all TypeScript type definitions for interacting with the Cosmic CMS API.
 * It provides complete type safety for all API operations including objects, media, and metadata.
 *
 * @author Cosmic MCP Team
 * @version 2.0.0
 */

/**
 * Configuration interface for Cosmic CMS client
 * 
 * @description Defines the required configuration options for connecting to a Cosmic bucket
 */
export interface CosmicConfig {
  bucketSlug: string;
  readKey: string;
  writeKey?: string;
  apiVersion?: "v3";
  apiEnvironment?: "staging" | "production";
}

// Base Cosmic Response Structure
export interface CosmicResponse<T> {
  object?: T;
  objects?: T[];
  object_types?: CosmicObjectType[];
  media?: CosmicMedia | CosmicMedia[];
  total?: number;
  message?: string;
}

// Object Types
export interface CosmicObject {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: "published" | "draft";
  content?: string;
  created_at: string;
  modified_at: string;
  created_by?: string;
  modified_by?: string;
  metadata?: Record<string, unknown>;
  locale?: string;
  thumbnail?: string;
}

export interface CosmicObjectType {
  id: string;
  title: string;
  slug: string;
  preview_link?: string;
  priority?: number;
  metafields?: CosmicMetafield[];
  created_at: string;
  modified_at: string;
}

export interface CosmicMetafield {
  id: string;
  title: string;
  key: string;
  type: string;
  value?: unknown;
  required?: boolean;
  children?: CosmicMetafield[];
}

// Media Types
export interface CosmicMedia {
  id: string;
  name: string;
  original_name: string;
  size: number;
  type: string;
  bucket: string;
  created_at: string;
  created_by?: string;
  modified_at: string;
  modified_by?: string;
  width?: number;
  height?: number;
  alt_text?: string;
  url: string;
  imgix_url?: string;
  folder?: string;
  metadata?: Record<string, unknown>;
}

// Query Options
export interface CosmicQueryOptions {
  type?: string;
  status?: "published" | "draft" | "any";
  locale?: string;
  limit?: number;
  skip?: number;
  sort?: string;
  props?: string;
  depth?: number;
  q?: string; // search query
  folder?: string; // for media
  id?: string; // for finding by ID
  slug?: string; // for finding by slug
}

// Input Types for CRUD Operations
export interface CreateObjectInput {
  title: string;
  type: string;
  slug?: string;
  content?: string;
  status?: "published" | "draft";
  metadata?: Record<string, unknown>;
  locale?: string;
  thumbnail?: string;
}

export interface UpdateObjectInput {
  title?: string;
  content?: string;
  status?: "published" | "draft";
  metadata?: Record<string, unknown>;
  locale?: string;
  thumbnail?: string;
}

export interface CreateMediaInput {
  media: Buffer;
  filename?: string;
  folder?: string;
  metadata?: Record<string, unknown>;
  alt_text?: string;
}

// Chaining Interface Types
export interface FindChaining {
  props(props: string | string[]): FindChaining;
  sort(sort: string): FindChaining;
  skip(skip: number): FindChaining;
  limit(limit: number): FindChaining;
  status(status: string): FindChaining;
  depth(depth: number): FindChaining;
  then<T>(
    onFulfilled?: (value: CosmicResponse<CosmicObject>) => T,
    onRejected?: (reason: unknown) => T
  ): Promise<T>;
}

export interface FindOneChaining {
  props(props: string | string[]): FindOneChaining;
  status(status: string): FindOneChaining;
  depth(depth: number): FindOneChaining;
  then<T>(
    onFulfilled?: (value: CosmicResponse<CosmicObject>) => T,
    onRejected?: (reason: unknown) => T
  ): Promise<T>;
}

export interface MediaFindChaining {
  limit(limit: number): MediaFindChaining;
  skip(skip: number): MediaFindChaining;
  then<T>(
    onFulfilled?: (value: CosmicResponse<CosmicMedia>) => T,
    onRejected?: (reason: unknown) => T
  ): Promise<T>;
}

// Cosmic Client Interface
export interface CosmicClient {
  objects: {
    find(query?: CosmicQueryOptions): FindChaining;
    findOne(query: CosmicQueryOptions): FindOneChaining;
    insertOne(data: CreateObjectInput): Promise<CosmicResponse<CosmicObject>>;
    updateOne(
      id: string,
      data: UpdateObjectInput
    ): Promise<CosmicResponse<CosmicObject>>;
    deleteOne(
      id: string,
      triggerWebhook?: boolean
    ): Promise<CosmicResponse<never>>;
  };
  objectTypes: {
    find(): Promise<CosmicResponse<CosmicObjectType>>;
    findOne(slug: string): Promise<CosmicResponse<CosmicObjectType>>;
    insertOne(
      data: Record<string, unknown>
    ): Promise<CosmicResponse<CosmicObjectType>>;
    updateOne(
      slug: string,
      data: Record<string, unknown>
    ): Promise<CosmicResponse<CosmicObjectType>>;
    deleteOne(slug: string): Promise<CosmicResponse<never>>;
  };
  media: {
    find(query?: CosmicQueryOptions): MediaFindChaining;
    findOne(query: CosmicQueryOptions): Promise<CosmicResponse<CosmicMedia>>;
    insertOne(data: CreateMediaInput): Promise<CosmicResponse<CosmicMedia>>;
    updateOne(
      id: string,
      data: Record<string, unknown>
    ): Promise<CosmicResponse<CosmicMedia>>;
    deleteOne(
      id: string,
      triggerWebhook?: boolean
    ): Promise<CosmicResponse<never>>;
  };
}
