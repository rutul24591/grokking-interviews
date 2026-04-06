'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

type DevicePreset = 'desktop' | 'tablet' | 'mobile';

interface PreviewPanelProps {
  html: string;
  className?: string;
  devicePresets?: DevicePreset[];
}

const DEVICE_CONFIG: Record<DevicePreset, { width: number; label: string; icon: string }> = {
  desktop: { width: 1024, label: 'Desktop (1024px)', icon: '🖥️' },
  tablet: { width: 768, label: 'Tablet (768px)', icon: '📱' },
  mobile: { width: 375, label: 'Mobile (375px)', icon: '📲' },
};

export function PreviewPanel({
  html,
  className = '',
  devicePresets = ['desktop', 'tablet', 'mobile'],
}: PreviewPanelProps) {
  const [activeDevice, setActiveDevice] = useState<DevicePreset>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Send updated HTML to iframe when it changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    doc.close();
  }, [html, refreshKey]);

  const currentWidth = DEVICE_CONFIG[activeDevice].width;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Device toggle bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1">
          {devicePresets.map((device) => {
            const config = DEVICE_CONFIG[device];
            const isActive = device === activeDevice;
            return (
              <button
                key={device}
                onClick={() => setActiveDevice(device)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-pressed={isActive}
                aria-label={config.label}
                title={config.label}
              >
                <span className="mr-1">{config.icon}</span>
                <span className="hidden sm:inline">{device.charAt(0).toUpperCase() + device.slice(1)}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={refresh}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
          aria-label="Refresh preview"
          title="Refresh preview"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900 p-4 flex justify-center">
        <div
          className="bg-white shadow-lg transition-all duration-300"
          style={{ width: `${currentWidth}px`, maxWidth: '100%', minHeight: '400px' }}
        >
          <iframe
            ref={iframeRef}
            key={refreshKey}
            title="Email preview"
            className="w-full h-full min-h-[400px] border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
