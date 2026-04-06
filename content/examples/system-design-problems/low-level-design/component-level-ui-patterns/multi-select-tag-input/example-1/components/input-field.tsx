'use client';

import React, { forwardRef, useRef, useEffect, useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ value, onChange, onPaste, placeholder = 'Search...', ...rest }, ref) {
    const [width, setWidth] = useState(60);
    const measurementRef = useRef<HTMLSpanElement | null>(null);

    // Auto-resize input based on content
    useEffect(() => {
      if (measurementRef.current) {
        const measuredWidth = measurementRef.current.offsetWidth;
        setWidth(Math.max(60, Math.min(measuredWidth + 16, 300)));
      }
    }, [value]);

    return (
      <>
        {/* Hidden measurement span */}
        <span
          ref={measurementRef}
          className="absolute invisible whitespace-pre text-sm font-normal"
          aria-hidden="true"
        >
          {value || placeholder}
        </span>

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={onPaste}
          placeholder={placeholder}
          className={`flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted min-w-[60px]`}
          style={{ width: `${width}px` }}
          role="combobox"
          aria-expanded={value.length > 0}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          {...rest}
        />
      </>
    );
  }
);

InputField.displayName = 'InputField';
