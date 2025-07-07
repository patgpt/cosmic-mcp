/**
 * @fileoverview Validation Error Classes
 *
 * This module provides specific error classes for validation errors that occur
 * during input validation, tool parameter validation, and schema validation.
 * These errors help provide clear feedback about what went wrong during validation.
 *
 * @author Cosmic MCP Team
 * @version 2.0.0
 */

import { z } from 'zod';
import { BaseError } from './base.error';

/**
 * Error thrown when Zod validation fails.
 *
 * Used for invalid data or input that doesn't meet the expected format or constraints.
 *
 * @extends BaseError
 */
export class ZodValidationError extends BaseError {
  readonly name = 'ZodValidationError';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(zodError: z.ZodError, context?: Record<string, unknown>) {
    const issues = zodError.issues.map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
      return `${path}${issue.message}`;
    });

    const message = `Validation failed: ${issues.join(', ')}`;

    super(message, {
      ...context,
      zodIssues: zodError.issues,
      issueCount: issues.length,
    });
  }
}

/**
 * Error thrown when a tool input validation fails.
 *
 * Used for invalid tool input or data that doesn't meet the expected format or constraints.
 *
 * @extends BaseError
 */
export class ToolInputValidationError extends BaseError {
  readonly name = 'ToolInputValidationError';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(toolName: string, validationError: string) {
    super(`Tool '${toolName}' input validation failed: ${validationError}`, {
      toolName,
      validationError,
    });
  }
}

/**
 * Error thrown when an unknown tool is used.
 *
 * Used for tools that don't exist or are not registered.
 *
 * @extends BaseError
 */
export class UnknownToolError extends BaseError {
  readonly name = 'UnknownToolError';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(toolName: string) {
    super(`Unknown tool: ${toolName}`, { toolName });
  }
}

/**
 * Factory function to create validation errors from Zod errors.
 *
 * @param error - The Zod error object
 * @param context - Additional context information about the error
 * @returns A ZodValidationError instance
 */
export function createValidationError(
  error: z.ZodError,
  context?: Record<string, unknown>,
): ZodValidationError {
  return new ZodValidationError(error, context);
}

/**
 * Function to format validation errors for user display.
 *
 * @param error - The Zod error object
 * @returns A formatted string of validation errors
 */
export function formatValidationError(error: z.ZodError): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
    return `${path}${issue.message}`;
  });
  return `Validation failed: ${issues.join(', ')}`;
}
