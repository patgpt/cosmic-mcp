// Rate Limiter Utility
import { RateLimitError } from "../errors/base.error";
import type { RateLimitConfig } from "../types/config.types";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private config: RateLimitConfig) {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  // Check if request is allowed
  isAllowed(identifier: string = "global"): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry) {
      // First request
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (now > entry.resetTime) {
      // Window expired, reset
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  // Get remaining requests for identifier
  getRemainingRequests(identifier: string = "global"): number {
    const entry = this.requests.get(identifier);
    if (!entry) {
      return this.config.maxRequests;
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - entry.count);
  }

  // Get time until reset (in milliseconds)
  getTimeUntilReset(identifier: string = "global"): number {
    const entry = this.requests.get(identifier);
    if (!entry) {
      return 0;
    }

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  // Get rate limit info
  getRateLimitInfo(identifier: string = "global"): {
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter: number;
  } {
    const entry = this.requests.get(identifier);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      return {
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
        retryAfter: 0,
      };
    }

    return {
      limit: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      retryAfter:
        entry.count >= this.config.maxRequests ? entry.resetTime - now : 0,
    };
  }

  // Check and consume rate limit
  checkAndConsume(identifier: string = "global"): void {
    if (!this.isAllowed(identifier)) {
      const info = this.getRateLimitInfo(identifier);
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${Math.ceil(
          info.retryAfter / 1000
        )} seconds.`,
        {
          identifier,
          limit: info.limit,
          remaining: info.remaining,
          resetTime: info.resetTime,
          retryAfter: info.retryAfter,
        }
      );
    }
  }

  // Reset rate limit for identifier
  reset(identifier: string = "global"): void {
    this.requests.delete(identifier);
  }

  // Reset all rate limits
  resetAll(): void {
    this.requests.clear();
  }

  // Cleanup expired entries
  private cleanup(): void {
    const now = Date.now();

    for (const [identifier, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(identifier);
      }
    }
  }

  // Get current statistics
  getStats(): {
    totalIdentifiers: number;
    config: RateLimitConfig;
  } {
    return {
      totalIdentifiers: this.requests.size,
      config: { ...this.config },
    };
  }

  // Update configuration
  updateConfig(config: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Destroy rate limiter
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

// Default rate limiter configuration
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 60000, // 1 minute
  maxRequests: 100,
};

// Create default rate limiter instance
export const defaultRateLimiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

// Factory function to create rate limiter with custom config
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}
