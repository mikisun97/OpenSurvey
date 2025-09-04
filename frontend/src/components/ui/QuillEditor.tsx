'use client';

import { useState, useRef, useEffect } from 'react';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export default function QuillEditor({ 
  value, 
  onChange, 
  placeholder = "내용을 입력하세요...",
  readOnly = false,
  className = ""
}: QuillEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
} 