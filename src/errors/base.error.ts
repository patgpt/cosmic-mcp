// Base Error Classes

export abstract class BaseError extends Error {
  abstract override readonly name: string;
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
    public override readonly cause?: Error
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

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

export class ApplicationError extends BaseError {
  readonly name = "ApplicationError";
  readonly statusCode = 500;
  readonly isOperational = true;
}

export class ValidationError extends BaseError {
  readonly name = "ValidationError";
  readonly statusCode = 400;
  readonly isOperational = true;
}

export class NotFoundError extends BaseError {
  readonly name = "NotFoundError";
  readonly statusCode = 404;
  readonly isOperational = true;
}

export class ConfigurationError extends BaseError {
  readonly name = "ConfigurationError";
  readonly statusCode = 500;
  readonly isOperational = false;
}

export class RateLimitError extends BaseError {
  readonly name = "RateLimitError";
  readonly statusCode = 429;
  readonly isOperational = true;
}
