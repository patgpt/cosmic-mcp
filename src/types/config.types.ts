// Configuration Types

export interface ApplicationConfig {
  bucketSlug: string;
  readKey: string;
  writeKey: string;
  debug: boolean;
}

export interface EnvironmentVariables {
  COSMIC_BUCKET_SLUG: string;
  COSMIC_READ_KEY: string;
  COSMIC_WRITE_KEY: string;
  DEBUG?: string;
}

export interface LoggerConfig {
  level: "error" | "warn" | "info" | "debug";
  format: "json" | "simple";
  console: boolean;
  file?: {
    enabled: boolean;
    filename: string;
    maxsize: number;
    maxFiles: number;
  };
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface ServerConfig {
  app: ApplicationConfig;
  logger: LoggerConfig;
  rateLimit: RateLimitConfig;
}

// Configuration validation result
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  config?: ApplicationConfig;
}
