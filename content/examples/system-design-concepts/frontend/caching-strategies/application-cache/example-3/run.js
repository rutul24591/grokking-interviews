const appCache = { changedFile: '/styles.css', invalidated: 'entire-manifest' };
const serviceWorker = { changedFile: '/styles.css', invalidated: ['static-v3'] };
console.log({ appCache, serviceWorker });
