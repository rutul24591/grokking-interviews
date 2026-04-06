'use client';
import { useState, useCallback } from 'react';
import type { Block, BlockType } from './lib/email-types';

export function EmailBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addBlock = useCallback((type: BlockType) => {
    const id = `block-${Date.now()}`;
    setBlocks((prev) => [...prev, { id, type, config: type === 'text' ? { content: 'Edit this text' } : type === 'button' ? { label: 'Click here', url: '#' } : {} }]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const generateHTML = () => {
    return blocks.map((b) => {
      if (b.type === 'text') return `<p style="margin:0;padding:16px;font-family:Arial,sans-serif;">${(b.config.content as string) || ''}</p>`;
      if (b.type === 'button') return `<a href="${(b.config.url as string) || '#'}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:4px;">${(b.config.label as string) || 'Click'}</a>`;
      if (b.type === 'divider') return '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">';
      return '<div style="height:16px;"></div>';
    }).join('');
  };

  const selected = blocks.find((b) => b.id === selectedId);

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Block palette */}
      <div className="w-40 bg-gray-100 dark:bg-gray-800 p-3 space-y-2">
        <h3 className="font-semibold text-sm">Blocks</h3>
        {(['text', 'image', 'button', 'divider', 'spacer'] as BlockType[]).map((type) => (
          <button key={type} onClick={() => addBlock(type)} className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 capitalize">{type}</button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto bg-white border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2">
        {blocks.map((block) => (
          <div key={block.id} onClick={() => setSelectedId(block.id)} className={`p-4 border-2 rounded cursor-pointer ${selectedId === block.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}>
            {block.type === 'text' && <p className="text-gray-700 dark:text-gray-300">{(block.config.content as string) || 'Edit this text'}</p>}
            {block.type === 'button' && <button className="px-4 py-2 bg-blue-500 text-white rounded">{(block.config.label as string) || 'Click here'}</button>}
            {block.type === 'divider' && <hr className="border-gray-300 dark:border-gray-600" />}
            {block.type === 'spacer' && <div className="h-4" />}
            {block.type === 'image' && <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 text-sm">Image placeholder</div>}
            <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="mt-1 text-xs text-red-500 hover:underline">Remove</button>
          </div>
        ))}
        {blocks.length === 0 && <p className="text-center text-gray-500 py-12">Drag blocks from the palette</p>}
      </div>

      {/* Properties panel */}
      {selected && (
        <div className="w-48 bg-gray-100 dark:bg-gray-800 p-3">
          <h3 className="font-semibold text-sm mb-2">Properties</h3>
          {selected.type === 'text' && <textarea defaultValue={selected.config.content as string} className="w-full text-sm p-2 border rounded" rows={3} />}
          {selected.type === 'button' && (
            <div className="space-y-2">
              <input defaultValue={selected.config.label as string} placeholder="Label" className="w-full text-sm p-1 border rounded" />
              <input defaultValue={selected.config.url as string} placeholder="URL" className="w-full text-sm p-1 border rounded" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
