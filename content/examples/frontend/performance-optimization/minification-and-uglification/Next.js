// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // SWC minification (default since Next.js 13)
  swcMinify: true,

  // Remove console statements in production
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
    // Remove React testing library data-testid attributes
    reactRemoveProperties: {
      properties: ['^data-testid
    </ArticleLayout>
  );
}
],
    },
  },

  // Webpack customization (for advanced cases)
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Override minimizer if needed
      config.optimization.minimizer = config.optimization.minimizer.map(
        (plugin) => {
          if (plugin.constructor.name === 'TerserPlugin') {
            plugin.options.terserOptions.compress.drop_console = true;
          }
          return plugin;
        }
      );
    }
    return config;
  },

  // Analyze bundle sizes
  // npm install @next/bundle-analyzer
  // ANALYZE=true next build
};

module.exports = nextConfig;

// Next.js automatically handles:
// ✓ JavaScript minification (SWC by default)
// ✓ CSS minification (built-in)
// ✓ HTML minification (for SSR output)
// ✓ Image optimization (next/image)
// ✓ Font optimization (next/font)
// ✓ Code splitting (per-page and dynamic imports)