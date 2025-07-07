/**
 * @fileoverview Cosmic JS Specific Error Classes
 *
 * This module provides specific error classes for Cosmic JS API errors.
 * These errors are thrown when interacting with the Cosmic CMS API and provide
 * detailed context about what went wrong during API operations.
 *
 * @author Cosmic MCP Team
 * @version 2.0.0
 */

import { BaseError } from './base.error';

/**
 * General Cosmic JS API error.
 *
 * Used for unexpected API errors that don't fit into other categories.
 *
 * @extends BaseError
 */
export class CosmicError extends BaseError {
  readonly name = 'CosmicError';
  readonly statusCode = 500;
  readonly isOperational = true;
}

/**
 * Error thrown when a requested object cannot be found.
 *
 * Used for missing objects, endpoints, or any resource that doesn't exist.
 *
 * @extends BaseError
 */
export class CosmicObjectNotFoundError extends BaseError {
  readonly name = 'CosmicObjectNotFoundError';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(identifier: string, type?: string) {
    const message = type
      ? `Object with identifier '${identifier}' of type '${type}' not found`
      : `Object with identifier '${identifier}' not found`;

    super(message, { identifier, type });
  }
}

/**
 * Error thrown when a requested media object cannot be found.
 *
 * Used for missing media objects, endpoints, or any resource that doesn't exist.
 *
 * @extends BaseError
 */
export class CosmicMediaNotFoundError extends BaseError {
  readonly name = 'CosmicMediaNotFoundError';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(mediaId: string) {
    super(`Media with ID '${mediaId}' not found`, { mediaId });
  }
}

/**
 * Error thrown when authentication fails.
 *
 * Used for invalid credentials or authentication issues.
 *
 * @extends BaseError
 */
export class CosmicAuthenticationError extends BaseError {
  readonly name = 'CosmicAuthenticationError';
  readonly statusCode = 401;
  readonly isOperational = true;

  constructor(message = 'Invalid Cosmic credentials') {
    super(message);
  }
}

/**
 * Error thrown when the API quota is exceeded.
 *
 * Used when the user's API usage exceeds the allowed limit.
 *
 * @extends BaseError
 */
export class CosmicQuotaExceededError extends BaseError {
  readonly name = 'CosmicQuotaExceededError';
  readonly statusCode = 429;
  readonly isOperational = true;

  constructor(message = 'Cosmic API quota exceeded') {
    super(message);
  }
}

/**
 * Error thrown when validation fails.
 *
 * Used for invalid data or input that doesn't meet the expected format or constraints.
 *
 * @extends BaseError
 */
export class CosmicValidationError extends BaseError {
  readonly name = 'CosmicValidationError';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(message: string, validationErrors?: string[]) {
    super(message, { validationErrors });
  }
}

/**
 * Error thrown when there's a connection issue.
 *
 * Used for network errors or connection failures.
 *
 * @extends BaseError
 */
export class CosmicConnectionError extends BaseError {
  readonly name = 'CosmicConnectionError';
  readonly statusCode = 503;
  readonly isOperational = true;

  constructor(message = 'Failed to connect to Cosmic API') {
    super(message);
  }
}

/**
 * Factory function to create appropriate Cosmic errors from API responses
 *
 * @description This function analyzes error messages and HTTP status codes to determine
 * the most appropriate Cosmic error type to throw. It provides intelligent error mapping
 * based on common API response patterns.
 *
 * @param error - The error object or message from the API
 * @param context - Additional context information about the error (e.g., request parameters)
 * @returns An appropriate Cosmic error instance with proper type and context
 *
 * @example
 * ```typescript
 * try {
 *   await cosmicClient.objects.find();
 * } catch (error) {
 *   throw createCosmicError(error, { operation: 'find objects' });
 * }
 * ```
 */
export function createCosmicError(
  error: unknown,
  context?: Record<string, unknown>,
): BaseError {
  // Check if the error is an instance of Error
  if (error instanceof Error) {
    // Check for specific error patterns from Cosmic API
    if (error.message.includes('not found') || error.message.includes('404')) {
      return new CosmicObjectNotFoundError(
        (context?.['identifier'] as string) || 'unknown',
        context?.['type'] as string,
      );
    }

    // Check for unauthorized access
    if (
      error.message.includes('unauthorized') ||
      error.message.includes('401')
    ) {
      // Return a new CosmicAuthenticationError with the error message
      return new CosmicAuthenticationError(error.message);
    }

    // Check for quota exceeded
    if (error.message.includes('quota') || error.message.includes('429')) {
      // Return a new CosmicQuotaExceededError with the error message
      return new CosmicQuotaExceededError(error.message);
    }

    // Check for validation errors
    if (error.message.includes('validation') || error.message.includes('400')) {
      // Return a new CosmicValidationError with the error message
      return new CosmicValidationError(error.message);
    }

    // Check for network or connection errors
    if (
      error.message.includes('network') ||
      error.message.includes('connection')
    ) {
      // Return a new CosmicConnectionError with the error message
      return new CosmicConnectionError(error.message);
    }
  }

  // Default to generic Cosmic error.
  const message = error instanceof Error ? error.message : String(error);
  return new CosmicError(
    message,
    context,
    error instanceof Error ? error : undefined,
  );
}
