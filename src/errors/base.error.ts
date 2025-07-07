/**
 * @fileoverview Base error classes for the Cosmic MCP server
 *
 * This module provides a hierarchy of error classes that extend the native Error class
 * with additional properties for better error handling and debugging. All custom errors
 * in the application should extend from these base classes to ensure consistent error
 * handling and reporting.
 *
 * @author Cosmic MCP Team
 * @version 2.0.0
 */

/**
 * Abstract base class for all custom errors in the application.
 *
 * Provides a consistent interface for error handling with additional context
 * and operational status information.
 *
 * @abstract
 * @extends Error
 */
export abstract class BaseError extends Error {
  /** The name of the error type */
  abstract override readonly name: string;

  /** HTTP status code associated with this error */
  abstract readonly statusCode: number;

  /** Whether this error is operational (expected) or programming error */
  abstract readonly isOperational: boolean;

  /**
   * Creates a new BaseError instance.
   *
   * @param message - The error message
   * @param context - Additional context information about the error
   * @param cause - The underlying cause of this error
   */
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
    public override readonly cause?: Error,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts the error to a JSON representation.
   *
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * General application error for unexpected conditions.
 *
 * Used for internal server errors and unexpected application states.
 *
 * @extends BaseError
 */
export class ApplicationError extends BaseError {
  readonly name = 'ApplicationError';
  readonly statusCode = 500;
  readonly isOperational = true;
}

/**
 * Error thrown when input validation fails.
 *
 * Used for invalid user input, malformed requests, or data that doesn't
 * meet the expected format or constraints.
 *
 * @extends BaseError
 */
export class ValidationError extends BaseError {
  readonly name = 'ValidationError';
  readonly statusCode = 400;
  readonly isOperational = true;
}

/**
 * Error thrown when a requested resource cannot be found.
 *
 * Used for missing objects, endpoints, or any resource that doesn't exist.
 *
 * @extends BaseError
 */
export class NotFoundError extends BaseError {
  readonly name = 'NotFoundError';
  readonly statusCode = 404;
  readonly isOperational = true;
}

/**
 * Error thrown when there's a configuration problem.
 *
 * Used for missing environment variables, invalid configuration values,
 * or setup issues that prevent the application from running properly.
 *
 * @extends BaseError
 */
export class ConfigurationError extends BaseError {
  readonly name = 'ConfigurationError';
  readonly statusCode = 500;
  readonly isOperational = false;
}

/**
 * Error thrown when rate limits are exceeded.
 *
 * Used when API rate limits are hit or when throttling is applied
 * to prevent abuse or overuse of resources.
 *
 * @extends BaseError
 */
export class RateLimitError extends BaseError {
  readonly name = 'RateLimitError';
  readonly statusCode = 429;
  readonly isOperational = true;
}
