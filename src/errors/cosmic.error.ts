// Cosmic JS Specific Error Classes

import { BaseError } from "./base.error";

export class CosmicError extends BaseError {
  readonly name = "CosmicError";
  readonly statusCode = 500;
  readonly isOperational = true;
}

export class CosmicObjectNotFoundError extends BaseError {
  readonly name = "CosmicObjectNotFoundError";
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(identifier: string, type?: string) {
    const message = type
      ? `Object with identifier '${identifier}' of type '${type}' not found`
      : `Object with identifier '${identifier}' not found`;

    super(message, { identifier, type });
  }
}

export class CosmicMediaNotFoundError extends BaseError {
  readonly name = "CosmicMediaNotFoundError";
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(mediaId: string) {
    super(`Media with ID '${mediaId}' not found`, { mediaId });
  }
}

export class CosmicAuthenticationError extends BaseError {
  readonly name = "CosmicAuthenticationError";
  readonly statusCode = 401;
  readonly isOperational = true;

  constructor(message = "Invalid Cosmic credentials") {
    super(message);
  }
}

export class CosmicQuotaExceededError extends BaseError {
  readonly name = "CosmicQuotaExceededError";
  readonly statusCode = 429;
  readonly isOperational = true;

  constructor(message = "Cosmic API quota exceeded") {
    super(message);
  }
}

export class CosmicValidationError extends BaseError {
  readonly name = "CosmicValidationError";
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(message: string, validationErrors?: string[]) {
    super(message, { validationErrors });
  }
}

export class CosmicConnectionError extends BaseError {
  readonly name = "CosmicConnectionError";
  readonly statusCode = 503;
  readonly isOperational = true;

  constructor(message = "Failed to connect to Cosmic API") {
    super(message);
  }
}

// Factory function to create appropriate Cosmic errors from API responses
export function createCosmicError(
  error: unknown,
  context?: Record<string, unknown>
): BaseError {
  if (error instanceof Error) {
    // Check for specific error patterns from Cosmic API
    if (error.message.includes("not found") || error.message.includes("404")) {
      return new CosmicObjectNotFoundError(
        (context?.['identifier'] as string) || "unknown",
        context?.['type'] as string
      );
    }

    if (
      error.message.includes("unauthorized") ||
      error.message.includes("401")
    ) {
      return new CosmicAuthenticationError(error.message);
    }

    if (error.message.includes("quota") || error.message.includes("429")) {
      return new CosmicQuotaExceededError(error.message);
    }

    if (error.message.includes("validation") || error.message.includes("400")) {
      return new CosmicValidationError(error.message);
    }

    if (
      error.message.includes("network") ||
      error.message.includes("connection")
    ) {
      return new CosmicConnectionError(error.message);
    }
  }

  // Default to generic Cosmic error
  const message = error instanceof Error ? error.message : String(error);
  return new CosmicError(
    message,
    context,
    error instanceof Error ? error : undefined
  );
}
