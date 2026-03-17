<!-- Load ONLY the polyfills the current browser needs -->
<!-- A modern Chrome gets an empty response (0KB) -->
<!-- An old Safari gets only the specific polyfills it's missing -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=Object.groupBy,Array.prototype.at,structuredClone"></script>

// Self-hosted alternative using core-js with browserslist
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',       // Only polyfill APIs actually used in code
      corejs: 3,
      browserslistEnv: 'production',
      // With a modern browserslist target, this adds very few polyfills
    }],
  ],
};

// .browserslistrc
// > 0.5%
// last 2 versions
// not dead
// not op_mini all