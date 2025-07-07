#!/usr/bin/env node

// Integration test for cosmic-mcp with real Cosmic JS bucket
// Usage: node integration-test.js
// Requires: COSMIC_BUCKET_SLUG, COSMIC_READ_KEY, COSMIC_WRITE_KEY in environment

import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import { setTimeout } from 'timers/promises';

class IntegrationTester {
  constructor() {
    this.server = null;
    this.requestId = 1;
    this.responses = new Map();
    this.testObjectId = null;
    this.testSlug = `test-object-${randomBytes(8).toString('hex')}`;
  }

  async startServer() {
    console.log('🚀 Starting cosmic-mcp server for integration testing...');

    this.server = spawn('bun', ['run', 'src/server.ts'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        DEBUG: 'true',
      },
    });

    this.server.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      lines.forEach((line) => {
        try {
          const response = JSON.parse(line);
          if (response.id) {
            this.responses.set(response.id, response);
          }
          console.log('📨 Response:', JSON.stringify(response, null, 2));
        } catch (e) {
          // Handle non-JSON output from server (like startup messages or errors)
          console.log('📝 Server:', line);
        }
      });
    });

    this.server.stderr.on('data', (data) => {
      console.error('❌ Server Error:', data.toString());
    });

    // Wait for server to initialize
    await setTimeout(3000);
  }

  async sendRequest(tool, input = {}) {
    const requestId = `test-${this.requestId++}`;
    const request = {
      id: requestId,
      tool,
      input,
    };

    console.log(`\n🔧 Testing: ${tool}`);
    console.log(`📤 Request:`, JSON.stringify(request, null, 2));

    this.server.stdin.write(JSON.stringify(request) + '\n');

    // Wait for response (increased timeout for write operations)
    await setTimeout(5000);

    const response = this.responses.get(requestId);
    if (response) {
      if (response.error) {
        console.log(`❌ Error: ${response.error}`);
        return { success: false, error: response.error };
      } else {
        console.log(`✅ Success`);
        return { success: true, result: response.result };
      }
    } else {
      console.log(`⏳ No response received`);
      return { success: false, error: 'No response' };
    }
  }

  async runIntegrationTests() {
    const results = [];

    try {
      await this.startServer();

      // Test 1: List object types (should always work with read key)
      console.log('\n' + '='.repeat(60));
      console.log('TEST 1: List Object Types');
      console.log('='.repeat(60));

      const objectTypesResult = await this.sendRequest('list_object_types');
      results.push({ test: 'list_object_types', ...objectTypesResult });

      if (!objectTypesResult.success) {
        console.log(
          '⚠️  Cannot proceed with write operations - object types failed',
        );
        return results;
      }

      // Get available object types for dynamic testing
      let availableTypes = [];
      if (objectTypesResult.result && objectTypesResult.result.object_types) {
        availableTypes = objectTypesResult.result.object_types.map(
          (type) => type.slug,
        );
        console.log(`📋 Available object types: ${availableTypes.join(', ')}`);
      }

      // Test 2: List existing objects
      console.log('\n' + '='.repeat(60));
      console.log('TEST 2: List Objects');
      console.log('='.repeat(60));

      const listResult = await this.sendRequest('list_objects', {
        limit: 5,
        skip: 0,
        sort: 'created_at',
        status: 'published',
      });
      results.push({ test: 'list_objects', ...listResult });

      // Test 3: Create a test object (requires write key)
      console.log('\n' + '='.repeat(60));
      console.log('TEST 3: Create Object');
      console.log('='.repeat(60));

      // Use first available object type, or skip if none exist
      const testTypeSlug = availableTypes.length > 0 ? availableTypes[0] : null;

      if (!testTypeSlug) {
        console.log('⚠️  No object types available - skipping create test');
        results.push({
          test: 'create_object',
          success: false,
          error: 'No object types available in bucket',
        });
      } else {
        console.log(`📝 Using object type: ${testTypeSlug}`);

        const createResult = await this.sendRequest('create_object', {
          title: 'Integration Test Object',
          type_slug: testTypeSlug, // Use dynamic type instead of hardcoded "posts"
          slug: this.testSlug,
          content: 'This is a test object created by the integration test.',
          status: 'draft',
        });
        results.push({ test: 'create_object', ...createResult });

        if (createResult.success && createResult.result) {
          this.testObjectId = createResult.result.id;
          console.log(`📝 Created test object with ID: ${this.testObjectId}`);
        }
      }

      // Test 4: Get the created object
      if (this.testObjectId) {
        console.log('\n' + '='.repeat(60));
        console.log('TEST 4: Get Object by ID');
        console.log('='.repeat(60));

        const getResult = await this.sendRequest('get_object', {
          id: this.testObjectId,
        });
        results.push({ test: 'get_object_by_id', ...getResult });
      }

      // Test 5: Search for the object
      console.log('\n' + '='.repeat(60));
      console.log('TEST 5: Search Objects');
      console.log('='.repeat(60));

      const searchResult = await this.sendRequest('search_objects', {
        query: 'Integration Test',
        limit: 5,
      });
      results.push({ test: 'search_objects', ...searchResult });

      // Test 6: Update the object
      if (this.testObjectId) {
        console.log('\n' + '='.repeat(60));
        console.log('TEST 6: Update Object');
        console.log('='.repeat(60));

        const updateResult = await this.sendRequest('update_object', {
          id: this.testObjectId,
          title: 'Updated Integration Test Object',
          status: 'published',
        });
        results.push({ test: 'update_object', ...updateResult });
      }

      // Test 7: List media
      console.log('\n' + '='.repeat(60));
      console.log('TEST 7: List Media');
      console.log('='.repeat(60));

      const mediaResult = await this.sendRequest('list_media', {
        limit: 5,
        skip: 0,
      });
      results.push({ test: 'list_media', ...mediaResult });

      // Test 8: Delete the test object (cleanup)
      if (this.testObjectId) {
        console.log('\n' + '='.repeat(60));
        console.log('TEST 8: Delete Object (Cleanup)');
        console.log('='.repeat(60));

        const deleteResult = await this.sendRequest('delete_object', {
          id: this.testObjectId,
        });
        results.push({ test: 'delete_object', ...deleteResult });
      }
    } catch (error) {
      console.error('💥 Integration test failed:', error);
      results.push({ test: 'overall', success: false, error: error.message });
    }

    return results;
  }

  generateReport(results) {
    console.log('\n' + '='.repeat(80));
    console.log('INTEGRATION TEST REPORT');
    console.log('='.repeat(80));

    const passed = results.filter((r) => r.success).length;
    const total = results.length;

    console.log(`\n📊 Overall: ${passed}/${total} tests passed\n`);

    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const error = result.error ? ` (${result.error})` : '';
      console.log(`${status} ${index + 1}. ${result.test}${error}`);
    });

    if (passed === total) {
      console.log(
        '\n🎉 All integration tests passed! The MCP server is working correctly.',
      );
    } else {
      console.log(
        '\n⚠️  Some tests failed. Check your Cosmic JS credentials and bucket setup.',
      );
    }

    console.log('\n💡 Tips for failed tests:');
    console.log(
      '   - Ensure COSMIC_BUCKET_SLUG, COSMIC_READ_KEY, COSMIC_WRITE_KEY are set',
    );
    console.log(
      '   - Verify your bucket has at least one object type for create tests',
    );
    console.log('   - Check that your write key has the necessary permissions');
    console.log('   - Make sure your bucket exists and is accessible');
    console.log(
      '   - Tests dynamically use available object types, no specific types required',
    );
  }

  async stop() {
    if (this.server) {
      this.server.kill();
      console.log('\n🛑 Server stopped');
    }
  }
}

// Check required environment variables
const requiredEnvVars = ['COSMIC_BUCKET_SLUG', 'COSMIC_READ_KEY'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error('\nPlease set these variables and try again.');
  process.exit(1);
}

if (!process.env.COSMIC_WRITE_KEY) {
  console.warn('⚠️  COSMIC_WRITE_KEY not set - write operations will fail');
}

// Run the integration tests
const tester = new IntegrationTester();

process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, cleaning up...');
  await tester.stop();
  process.exit(0);
});

async function main() {
  console.log('🧪 Starting Cosmic MCP Integration Tests');
  console.log(`📦 Testing bucket: ${process.env.COSMIC_BUCKET_SLUG}`);

  const results = await tester.runIntegrationTests();
  tester.generateReport(results);

  await tester.stop();

  // Exit with error code if any tests failed
  const allPassed = results.every((r) => r.success);
  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
