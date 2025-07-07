/**
 * @fileoverview Winston Logger Utility
 *
 * This module provides a structured logging system with contextual information
 * for debugging and monitoring the Cosmic MCP server operations.
 *
 * @author Cosmic MCP Team
 * @version 2.0.0
 */

import winston from "winston";
import type { LoggerConfig } from "../types/config.types";

// Custom log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
} as const;

// Color scheme for console output
const LOG_COLORS = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
} as const;

// Add colors to winston
winston.addColors(LOG_COLORS);

// Default logger configuration
const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  level: "info",
  format: "json",
  console: true,
  file: {
    enabled: false,
    filename: "cosmic-mcp.log",
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
};

// Create logger instance
class Logger {
  private winston: winston.Logger;
  private config: LoggerConfig;

  constructor(config: LoggerConfig = DEFAULT_LOGGER_CONFIG) {
    this.config = config;
    this.winston = this.createWinstonLogger();
  }

  private createWinstonLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.console) {
      const consoleFormat =
        this.config.format === "json"
          ? winston.format.combine(
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.json()
            )
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
              winston.format.errors({ stack: true }),
              winston.format.printf(
                ({ level, message, timestamp, ...meta }) => {
                  const metaStr =
                    Object.keys(meta).length > 0
                      ? ` ${JSON.stringify(meta)}`
                      : "";
                  return `${timestamp} [${level}]: ${message}${metaStr}`;
                }
              )
            );

      transports.push(
        new winston.transports.Console({
          format: consoleFormat,
          stderrLevels: ["error"],
        })
      );
    }

    // File transport
    if (this.config.file?.enabled) {
      const fileFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      );

      transports.push(
        new winston.transports.File({
          filename: this.config.file.filename,
          format: fileFormat,
          maxsize: this.config.file.maxsize,
          maxFiles: this.config.file.maxFiles,
        })
      );
    }

    return winston.createLogger({
      levels: LOG_LEVELS,
      level: this.config.level,
      transports,
      exitOnError: false,
    });
  }

  // Log methods
  error(message: string, meta?: Record<string, unknown>): void {
    this.winston.error(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.winston.warn(message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.winston.info(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.winston.debug(message, meta);
  }

  // Context-aware logging
  withContext(context: Record<string, unknown>) {
    return {
      error: (message: string, meta?: Record<string, unknown>) =>
        this.error(message, { ...context, ...meta }),
      warn: (message: string, meta?: Record<string, unknown>) =>
        this.warn(message, { ...context, ...meta }),
      info: (message: string, meta?: Record<string, unknown>) =>
        this.info(message, { ...context, ...meta }),
      debug: (message: string, meta?: Record<string, unknown>) =>
        this.debug(message, { ...context, ...meta }),
    };
  }

  // Request correlation ID support
  withCorrelationId(correlationId: string) {
    return this.withContext({ correlationId });
  }

  // Tool-specific logging
  withTool(toolName: string) {
    return this.withContext({ tool: toolName });
  }

  // Update logger configuration
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    this.winston = this.createWinstonLogger();
  }

  // Get current configuration
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

// Create default logger instance
const logger = new Logger();

// Export default logger instance and class
export default logger;
export { Logger };
export type { LoggerConfig };

// Utility function to create logger with custom config
export function createLogger(config: LoggerConfig): Logger {
  return new Logger(config);
}
