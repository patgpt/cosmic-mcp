import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Cosmic MCP Server',
  description:
    'A robust, production-ready Model Context Protocol (MCP) server for interacting with the Cosmic headless CMS',
  base: '/cosmic-mcp/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Tools', link: '/tools/' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'MCP Client Setup', link: '/mcp-setup' },
          { text: 'AI Assistant Prompts', link: '/ai-prompts' },
          { text: 'Secrets & Workflows', link: '/secrets-and-workflow' },
        ],
      },
      {
        text: 'Tools API',
        items: [
          { text: 'Overview', link: '/tools/' },
          { text: 'Complete Reference', link: '/tools-reference' },
          { text: 'Objects', link: '/tools/objects' },
          { text: 'Media', link: '/tools/media' },
          { text: 'Types', link: '/tools/types' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/patgpt/cosmic-mcp' },
    ],
  },
});
