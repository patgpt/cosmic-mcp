/**
 * @fileoverview Abstract Base Repository
 *
 * This module provides a base class for all repositories in the application.
 * It implements common functionality like error handling, logging, and validation
 * that all repositories need, following the Repository pattern for data access.
 *
 * @author Cosmic MCP Team
 * @version 2.0.0
 */

import type { CosmicClient } from '@/types/cosmic.types';
import { createCosmicError } from '../errors/cosmic.error';
import logger from '../utils/logger';

/**
 * Abstract base class for all repositories in the application
 *
 * @description Provides a consistent interface for repository operations with logging,
 * error handling, and context. All repositories should extend this class to ensure
 * consistent behavior and proper error handling across the application.
 *
 * @abstract
 * @class BaseRepository
 *
 * @example
 * ```typescript
 * export class MyRepository extends BaseRepository {
 *   async findById(id: string): Promise<MyEntity> {
 *     this.logOperation('findById', { id });
 *     try {
 *       const result = await this.client.objects.findOne({ id });
 *       this.logSuccess('findById', { id });
 *       return result;
 *     } catch (error) {
 *       this.handleError(error, 'findById', { id });
 *     }
 *   }
 * }
 * ```
 */
export abstract class BaseRepository {
  /** Logger instance with repository context */
  protected logger = logger.withContext({
    repository: this.constructor.name,
  });

  /**
   * Creates a new repository instance
   *
   * @param client - The Cosmic client instance for API operations
   */
  constructor(protected client: CosmicClient) {}

  /**
   * Common error handling for all repositories.
   *
   * @param error - The error object
   * @param operation - The operation that failed
   * @param context - Additional context information about the error
   * @returns A never type to indicate that the function should never return
   */
  protected handleError(
    error: unknown,
    operation: string,
    context?: Record<string, unknown>,
  ): never {
    this.logger.error(`${operation} failed`, { error, context });
    throw createCosmicError(error, context);
  }

  /**
   * Common logging for successful operations.
   *
   * @param operation - The operation that succeeded
   * @param context - Additional context information about the operation
   */
  protected logSuccess(
    operation: string,
    context?: Record<string, unknown>,
  ): void {
    this.logger.info(`${operation} completed successfully`, context);
  }

  /**
   * Common logging for operations start.
   *
   * @param operation - The operation that started
   * @param context - Additional context information about the operation
   */
  protected logOperation(
    operation: string,
    context?: Record<string, unknown>,
  ): void {
    this.logger.debug(`Starting ${operation}`, context);
  }

  /**
   * Utility to sanitize input for logging (remove sensitive data).
   *
   * @param input - The input to sanitize
   * @returns The sanitized input
   */
  protected sanitizeForLogging(
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    const sanitized = { ...input };

    // Remove potentially large content for cleaner logs
    if ('content' in sanitized && typeof sanitized['content'] === 'string') {
      sanitized['content'] =
        sanitized['content'].length > 100
          ? `[CONTENT:${sanitized['content'].length} chars]`
          : sanitized['content'];
    }

    // Remove base64 file data for cleaner logs
    if (
      'file_data' in sanitized &&
      typeof sanitized['file_data'] === 'string'
    ) {
      sanitized['file_data'] =
        `[FILE_DATA:${sanitized['file_data'].length} chars]`;
    }

    return sanitized;
  }

  /**
   * Common validation for ID parameters.
   *
   * @param id - The ID to validate
   * @param operation - The operation that requires the ID
   */
  protected validateId(id: string, operation: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error(`Invalid ID provided for ${operation}`);
    }
  }

  /**
   * Common validation for required parameters.
   *
   * @param value - The value to validate
   * @param fieldName - The name of the field that is required
   * @param operation - The operation that requires the parameter
   */
  protected validateRequired(
    value: unknown,
    fieldName: string,
    operation: string,
  ): void {
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim().length === 0)
    ) {
      throw new Error(`${fieldName} is required for ${operation}`);
    }
  }
}
