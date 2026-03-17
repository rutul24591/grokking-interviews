# Browser Caching Examples

## Example 1: Setting Cache Headers (Express.js)

```javascript
const express = require('express');
const app = express();

// Static assets with long-term caching (immutable, content-hashed filenames)
app.use('/assets', express.static('public/assets', {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// HTML pages - always revalidate
app.get('*.html', (req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});

// API responses - private, short TTL with revalidation
app.get('/api/*', (req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0, must-revalidate');
  next();
});
```

## Example 2: ETag Implementation

```javascript
const crypto = require('crypto');

function generateETag(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id);
  const body = JSON.stringify(product);
  const etag = generateETag(body);

  // Check If-None-Match header
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.set('ETag', etag);
  res.set('Cache-Control', 'private, no-cache');
  res.json(product);
});
```

## Example 3: Cache-Busting with Content Hashing (Webpack)

```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
};
```

## Example 4: Conditional Request Flow (Fetch API)

```javascript
async function fetchWithCache(url) {
  const cached = sessionStorage.getItem(`cache:${url}`);
  const etag = sessionStorage.getItem(`etag:${url}`);

  const headers = {};
  if (etag) {
    headers['If-None-Match'] = etag;
  }

  const response = await fetch(url, { headers });

  if (response.status === 304 && cached) {
    return JSON.parse(cached);
  }

  const data = await response.json();
  const newEtag = response.headers.get('ETag');

  if (newEtag) {
    sessionStorage.setItem(`etag:${url}`, newEtag);
    sessionStorage.setItem(`cache:${url}`, JSON.stringify(data));
  }

  return data;
}
```
