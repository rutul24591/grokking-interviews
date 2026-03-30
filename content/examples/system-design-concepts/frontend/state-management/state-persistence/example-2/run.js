const v1 = { version: 1, darkMode: true, track: 'backend' };
const v2 = { version: 2, settings: { theme: v1.darkMode ? 'dark' : 'light', density: 'comfortable', pinnedTrack: v1.track } };
console.log({ before: v1, after: v2 });
