import { config as dotenvConfig } from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenvConfig();

// Define the schema for environment variables
const envSchema = z.object({
  COSMIC_BUCKET_SLUG: z.string().min(1, "COSMIC_BUCKET_SLUG is required"),
  COSMIC_READ_KEY: z.string().min(1, "COSMIC_READ_KEY is required"),
  COSMIC_WRITE_KEY: z.string().min(1, "COSMIC_WRITE_KEY is required"),
  DEBUG: z.string().optional().default("false"),
});

// Validate and parse environment variables
const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((issue) => issue.path.join("."))
        .join(", ");
      throw new Error(
        `Missing required environment variables: ${missingVars}\n` +
          "Please copy .env.example to .env and fill in your Cosmic credentials.\n" +
          "Get your credentials from: https://www.cosmicjs.com/dashboard"
      );
    }
    throw error;
  }
};

// Export validated configuration
const env = validateEnv();

export const config = {
  bucketSlug: env.COSMIC_BUCKET_SLUG,
  readKey: env.COSMIC_READ_KEY,
  writeKey: env.COSMIC_WRITE_KEY,
  debug: env.DEBUG === "true",
};

// Log configuration (without sensitive data) if debug is enabled
if (config.debug) {
  console.log("Configuration loaded:", {
    bucketSlug: config.bucketSlug,
    readKey: config.readKey ? "***" : "missing",
    writeKey: config.writeKey ? "***" : "missing",
    debug: config.debug,
  });
}
