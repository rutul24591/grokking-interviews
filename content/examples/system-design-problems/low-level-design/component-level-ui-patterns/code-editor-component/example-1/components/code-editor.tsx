'use client';
import { useEffect, useRef } from 'react';
import { useEditor, basicSetup, EditorView } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import type { CodeLanguage } from './lib/editor-types';

export function CodeEditor({ initialContent, language, onChange }: { initialContent: string; language: CodeLanguage; onChange?: (val: string) => void }) {
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const handleChange = (val: string) => onChangeRef.current?.(val);

  const { view, container } = useEditor({
    value: initialContent,
    extensions: [basicSetup, javascript({ typescript: language === 'typescript' })],
    onChange: handleChange,
  });

  return <div ref={container} className="h-full font-mono text-sm" />;
}
