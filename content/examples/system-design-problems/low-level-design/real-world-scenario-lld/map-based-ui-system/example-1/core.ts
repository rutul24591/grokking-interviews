export type Marker = { id: string; lat: number; lng: number };

export type Bounds = { minLat: number; maxLat: number; minLng: number; maxLng: number };

export function inBounds(m: Marker, b: Bounds) {
  return m.lat >= b.minLat && m.lat <= b.maxLat && m.lng >= b.minLng && m.lng <= b.maxLng;
}

export function clusterKey(m: Marker, cellDeg: number) {
  const x = Math.floor(m.lng / cellDeg);
  const y = Math.floor(m.lat / cellDeg);
  return `${x}:${y}`;
}
