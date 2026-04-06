'use client';
import { useRef, useEffect, useState } from 'react';
import type { Marker, Geofence } from './lib/map-types';

export function MapView({ markers, geofences }: { markers: Marker[]; geofences: Geofence[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = markers.find((m) => m.id === selectedId);

  return (
    <div className="relative h-96 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
      {/* Placeholder map background */}
      <div ref={containerRef} className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400 text-sm">Map tiles rendered by Mapbox GL / Google Maps</span>
      </div>

      {/* Markers overlay */}
      {markers.map((marker) => (
        <button
          key={marker.id}
          onClick={() => setSelectedId(marker.id)}
          className="absolute w-8 h-8 -ml-4 -mt-8 text-blue-500 hover:text-blue-700 transition-colors"
          style={{ left: `${((marker.lng + 180) / 360) * 100}%`, top: `${((90 - marker.lat) / 180) * 100}%` }}
          aria-label={`Marker: ${marker.title}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
        </button>
      ))}

      {/* Info popup */}
      {selected && (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selected.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lat: {selected.lat.toFixed(4)}, Lng: {selected.lng.toFixed(4)}</p>
          <button onClick={() => setSelectedId(null)} className="mt-2 text-xs text-blue-500 hover:underline">Close</button>
        </div>
      )}
    </div>
  );
}
