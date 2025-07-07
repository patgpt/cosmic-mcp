// Abstract Base Repository

import type { CosmicClient } from "@/types/cosmic.types";
import { createCosmicError } from "../errors/cosmic.error";
import logger from "../utils/logger";

export abstract class BaseRepository {
  protected logger = logger.withContext({
    repository: this.constructor.name,
  });

  constructor(protected client: CosmicClient) {}

  // Common error handling for all repositories
  protected handleError(
    error: unknown,
    operation: string,
    context?: Record<string, unknown>
  ): never {
    this.logger.error(`${operation} failed`, { error, context });
    throw createCosmicError(error, context);
  }

  // Common logging for successful operations
  protected logSuccess(
    operation: string,
    context?: Record<string, unknown>
  ): void {
    this.logger.info(`${operation} completed successfully`, context);
  }

  // Common logging for operations start
  protected logOperation(
    operation: string,
    context?: Record<string, unknown>
  ): void {
    this.logger.debug(`Starting ${operation}`, context);
  }

  // Utility to sanitize input for logging (remove sensitive data)
  protected sanitizeForLogging(
    input: Record<string, unknown>
  ): Record<string, unknown> {
    const sanitized = { ...input };

    // Remove potentially large content for cleaner logs
    if ("content" in sanitized && typeof sanitized["content"] === "string") {
      sanitized["content"] =
        sanitized["content"].length > 100
          ? `[CONTENT:${sanitized["content"].length} chars]`
          : sanitized["content"];
    }

    // Remove base64 file data for cleaner logs
    if (
      "file_data" in sanitized &&
      typeof sanitized["file_data"] === "string"
    ) {
      sanitized["file_data"] =
        `[FILE_DATA:${sanitized["file_data"].length} chars]`;
    }

    return sanitized;
  }

  // Common validation for ID parameters
  protected validateId(id: string, operation: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error(`Invalid ID provided for ${operation}`);
    }
  }

  // Common validation for required parameters
  protected validateRequired(
    value: unknown,
    fieldName: string,
    operation: string
  ): void {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0)
    ) {
      throw new Error(`${fieldName} is required for ${operation}`);
    }
  }
}
