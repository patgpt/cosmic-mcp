import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Cosmic MCP Server',
  description:
    'A robust, production-ready Model Context Protocol (MCP) server for interacting with the Cosmic headless CMS',
  base: '/cosmic-mcp/',
  head: [
    ['link', { rel: 'icon', href: '/cosmic-mcp/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#667eea' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    [
      'meta',
      {
        property: 'og:title',
        content: 'Cosmic MCP Server | AI-Powered Content Management',
      },
    ],
    ['meta', { property: 'og:site_name', content: 'Cosmic MCP Server' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://patgpt.github.io/cosmic-mcp/logo.svg',
      },
    ],
    [
      'meta',
      { property: 'og:url', content: 'https://patgpt.github.io/cosmic-mcp/' },
    ],
  ],
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

    logo: '/logo.svg',
  },
});
