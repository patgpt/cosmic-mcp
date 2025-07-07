# Configuration

This guide covers all configuration options for the Cosmic MCP Server.

## Environment Variables

The server uses the following environment variables:

### Required Variables

| Variable             | Description                   | Example                   |
| -------------------- | ----------------------------- | ------------------------- |
| `COSMIC_BUCKET_SLUG` | Your Cosmic bucket slug       | `my-awesome-site`         |
| `COSMIC_READ_KEY`    | Read-only API key             | `cosmic_read_key_123...`  |
| `COSMIC_WRITE_KEY`   | Write API key (for mutations) | `cosmic_write_key_456...` |

### Optional Variables

| Variable              | Description             | Default                    | Example                          |
| --------------------- | ----------------------- | -------------------------- | -------------------------------- |
| `COSMIC_API_URL`      | Custom API endpoint     | `https://api.cosmicjs.com` | `https://api.cosmicjs.com`       |
| `LOG_LEVEL`           | Logging level           | `info`                     | `debug`, `info`, `warn`, `error` |
| `RATE_LIMIT_REQUESTS` | Max requests per window | `100`                      | `200`                            |
| `RATE_LIMIT_WINDOW`   | Rate limit window (ms)  | `60000`                    | `30000`                          |

## Configuration File

You can also use a configuration file instead of environment variables:

### `cosmic-mcp.config.json`

```json
{
  "cosmic": {
    "bucketSlug": "my-awesome-site",
    "readKey": "cosmic_read_key_123...",
    "writeKey": "cosmic_write_key_456...",
    "apiUrl": "https://api.cosmicjs.com"
  },
  "server": {
    "logLevel": "info",
    "rateLimit": {
      "requests": 100,
      "window": 60000
    }
  }
}
```

## Logging Configuration

The server supports different logging levels:

- `debug`: Detailed debugging information
- `info`: General information (default)
- `warn`: Warning messages
- `error`: Error messages only

### Example Log Output

```bash
{"level":"info","message":"Starting Cosmic MCP Server","timestamp":"2024-01-15T10:30:00.000Z"}
{"level":"info","message":"Connected to Cosmic bucket: my-awesome-site","timestamp":"2024-01-15T10:30:01.000Z"}
{"level":"debug","message":"Processing request: list_objects","timestamp":"2024-01-15T10:30:02.000Z"}
```

## Rate Limiting

The server includes built-in rate limiting to prevent API abuse:

- **Default**: 100 requests per 60 seconds
- **Configurable**: Adjust via environment variables
- **Per-client**: Rate limits are applied per MCP client connection

### Rate Limit Headers

The server includes rate limit information in responses:

```json
{
  "rateLimit": {
    "limit": 100,
    "remaining": 95,
    "reset": 1642248600000
  }
}
```

## Security Configuration

### API Key Security

- **Never commit API keys**: Use environment variables or secure configuration files
- **Rotate keys regularly**: Update your Cosmic API keys periodically
- **Use read-only keys**: When possible, use read-only keys for read-only operations

### Network Security

- **Local connections**: The MCP server runs locally and doesn't expose network ports
- **Encrypted communication**: All communication with Cosmic API uses HTTPS
- **No data storage**: The server doesn't store or cache sensitive data

## Troubleshooting

### Common Issues

1. **Connection failed**: Check your bucket slug and API keys
2. **Rate limit exceeded**: Reduce request frequency or increase limits
3. **Permission denied**: Ensure your API key has the required permissions

### Debug Mode

Enable debug logging for troubleshooting:

```bash
LOG_LEVEL=debug npx cosmic-mcp
```

### Validation

The server validates configuration on startup:

```bash
✓ Cosmic bucket slug: my-awesome-site
✓ Read key: configured
✓ Write key: configured
✓ API connection: successful
```

## Advanced Configuration

### Custom API Endpoints

For enterprise or self-hosted Cosmic instances:

```env
COSMIC_API_URL=https://your-custom-api.com
```

### Performance Tuning

Adjust rate limits based on your usage:

```env
RATE_LIMIT_REQUESTS=500
RATE_LIMIT_WINDOW=60000
```

### Development vs Production

#### Development

```env
LOG_LEVEL=debug
RATE_LIMIT_REQUESTS=1000
```

#### Production

```env
LOG_LEVEL=warn
RATE_LIMIT_REQUESTS=100
```
