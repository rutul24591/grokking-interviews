export interface Marker { id: string; lat: number; lng: number; title: string; icon?: string; }
export interface Geofence { id: string; name: string; coordinates: [number, number][]; color: string; }
export interface MapState { markers: Marker[]; geofences: Geofence[]; viewport: { lat: number; lng: number; zoom: number }; selectedMarker: string | null; }
