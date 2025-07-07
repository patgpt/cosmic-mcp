// Validation Error Classes

import { z } from "zod";
import { BaseError } from "./base.error";

export class ZodValidationError extends BaseError {
  readonly name = "ZodValidationError";
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(zodError: z.ZodError, context?: Record<string, unknown>) {
    const issues = zodError.issues.map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
      return `${path}${issue.message}`;
    });

    const message = `Validation failed: ${issues.join(", ")}`;

    super(message, {
      ...context,
      zodIssues: zodError.issues,
      issueCount: issues.length,
    });
  }
}

export class ToolInputValidationError extends BaseError {
  readonly name = "ToolInputValidationError";
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(toolName: string, validationError: string) {
    super(`Tool '${toolName}' input validation failed: ${validationError}`, {
      toolName,
      validationError,
    });
  }
}

export class UnknownToolError extends BaseError {
  readonly name = "UnknownToolError";
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(toolName: string) {
    super(`Unknown tool: ${toolName}`, { toolName });
  }
}

// Factory function to create validation errors from Zod errors
export function createValidationError(
  error: z.ZodError,
  context?: Record<string, unknown>
): ZodValidationError {
  return new ZodValidationError(error, context);
}

// Function to format validation errors for user display
export function formatValidationError(error: z.ZodError): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });
  return `Validation failed: ${issues.join(", ")}`;
}
