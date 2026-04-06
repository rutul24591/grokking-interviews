'use client';
import { useState, useCallback, useRef } from 'react';
import { hsvToRgb, rgbToHex, hexToRgb, relativeLuminance, contrastRatio, passesWCAG } from './lib/color-converter';
import type { HSV } from './lib/color-converter';

export function ColorPicker({ initialHex = '#3b82f6', onColorChange }: { initialHex?: string; onColorChange?: (hex: string) => void }) {
  const initialRgb = hexToRgb(initialHex) || { r: 59, g: 130, b: 246 };
  const s = initialRgb.r / 255;
  const v = Math.max(initialRgb.r, initialRgb.g, initialRgb.b) / 255;
  const [hsv, setHsv] = useState<HSV>({ h: 220, s: 0.76, v: 0.96, a: 1 });
  const [palettes, setPalettes] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('color-palettes') || '[]'); } catch { return []; } });
  const [contrastBg, setContrastBg] = useState('#ffffff');

  const rgb = hsvToRgb(hsv);
  const hex = rgbToHex(rgb);
  const lum = relativeLuminance(rgb);
  const bgLum = relativeLuminance(hexToRgb(contrastBg) || { r: 255, g: 255, b: 255 });
  const ratio = contrastRatio(lum, bgLum);
  const aaNormal = passesWCAG(ratio, 'AA', 'normal');
  const aaLarge = passesWCAG(ratio, 'AA', 'large');

  const savePalette = () => {
    const next = [...palettes, hex].slice(-10);
    setPalettes(next);
    localStorage.setItem('color-palettes', JSON.stringify(next));
  };

  return (
    <div className="space-y-4">
      {/* HSV Area */}
      <div className="w-64 h-48 rounded-lg border border-gray-300 dark:border-gray-600 relative cursor-crosshair" style={{ background: `hsl(${hsv.h}, 100%, 50%)` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute w-4 h-4 border-2 border-white rounded-full shadow" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Hue Slider */}
      <input type="range" min={0} max={360} value={hsv.h} onChange={(e) => setHsv((h) => ({ ...h, h: Number(e.target.value) }))} className="w-full h-4 rounded-full" style={{ background: 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)' }} aria-label="Hue" />

      {/* Hex Input */}
      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hex:</label>
        <input value={hex} onChange={(e) => { const rgb = hexToRgb(e.target.value); if (rgb) setHsv((h) => ({ ...h, s: rgb.r / 255, v: Math.max(rgb.r, rgb.g, rgb.b) / 255 })); }} className="px-2 py-1 border rounded text-sm w-24" />
        <div className="w-8 h-8 rounded border" style={{ backgroundColor: hex }} />
      </div>

      {/* Contrast Checker */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Contrast Checker</h4>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-xs">Background:</label>
          <input value={contrastBg} onChange={(e) => setContrastBg(e.target.value)} className="px-2 py-1 border rounded text-xs w-20" />
        </div>
        <div className="text-xs space-y-1">
          <p>Ratio: {ratio.toFixed(2)}:1</p>
          <p className={aaNormal ? 'text-green-600' : 'text-red-600'}>AA Normal: {aaNormal ? '✓ Pass' : '✗ Fail'}</p>
          <p className={aaLarge ? 'text-green-600' : 'text-red-600'}>AA Large: {aaLarge ? '✓ Pass' : '✗ Fail'}</p>
        </div>
      </div>

      {/* Palette */}
      <div>
        <div className="flex gap-1 mb-2">
          {palettes.map((c, i) => <div key={i} className="w-6 h-6 rounded border cursor-pointer" style={{ backgroundColor: c }} onClick={() => { const rgb = hexToRgb(c); if (rgb) setHsv({ h: 220, s: rgb.r / 255, v: Math.max(rgb.r, rgb.g, rgb.b) / 255, a: 1 }); }} />)}
        </div>
        <button onClick={savePalette} className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Save to Palette</button>
      </div>
    </div>
  );
}
