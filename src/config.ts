/**
 * @fileoverview Configuration module for the Cosmic MCP Server
 *
 * This module handles loading and validating environment variables required for
 * connecting to the Cosmic CMS API. It provides a type-safe configuration object
 * with proper error handling for missing or invalid environment variables.
 *
 * @author Cosmic MCP Team
 * @version 2.0.0
 */

import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenvConfig();

/**
 * Zod schema for validating required environment variables
 *
 * @description Defines the structure and validation rules for environment variables
 * required by the Cosmic MCP server. All Cosmic-related variables are required,
 * while DEBUG is optional and defaults to "false".
 */
const envSchema = z.object({
  /** The slug identifier for your Cosmic bucket */
  COSMIC_BUCKET_SLUG: z.string().min(1, 'COSMIC_BUCKET_SLUG is required'),
  /** Read-only API key for accessing Cosmic content */
  COSMIC_READ_KEY: z.string().min(1, 'COSMIC_READ_KEY is required'),
  /** Write API key for creating/updating Cosmic content */
  COSMIC_WRITE_KEY: z.string().min(1, 'COSMIC_WRITE_KEY is required'),
  /** Enable debug logging (optional, defaults to "false") */
  DEBUG: z.string().optional().default('false'),
});

/**
 * Validates and parses environment variables against the defined schema
 *
 * @returns {z.infer<typeof envSchema>} Validated environment variables
 * @throws {Error} When required environment variables are missing or invalid
 *
 * @example
 * ```typescript
 * // Environment variables are automatically validated on module load
 * // If validation fails, a descriptive error is thrown
 * const env = validateEnv();
 * ```
 */
const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((issue) => issue.path.join('.'))
        .join(', ');
      throw new Error(
        `Missing required environment variables: ${missingVars}\n` +
          'Please copy .env.example to .env and fill in your Cosmic credentials.\n' +
          'Get your credentials from: https://www.cosmicjs.com/dashboard',
      );
    }
    throw error;
  }
};

// Export validated configuration
const env = validateEnv();

/**
 * Application configuration object with validated environment variables
 *
 * @description Provides a clean, type-safe interface to configuration values
 * with proper transformation (e.g., string to boolean conversion for debug flag).
 *
 * @example
 * ```typescript
 * import { config } from './config';
 *
 * // Access configuration values
 * console.log('Bucket:', config.bucketSlug);
 * console.log('Debug mode:', config.debug);
 * ```
 */
export const config = {
  /** The Cosmic bucket slug identifier */
  bucketSlug: env.COSMIC_BUCKET_SLUG,
  /** The Cosmic read API key */
  readKey: env.COSMIC_READ_KEY,
  /** The Cosmic write API key */
  writeKey: env.COSMIC_WRITE_KEY,
  /** Whether debug logging is enabled */
  debug: env.DEBUG === 'true',
};

// Log configuration (without sensitive data) if debug is enabled
if (config.debug) {
  console.log('Configuration loaded:', {
    bucketSlug: config.bucketSlug,
    readKey: config.readKey ? '***' : 'missing',
    writeKey: config.writeKey ? '***' : 'missing',
    debug: config.debug,
  });
}
