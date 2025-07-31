import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Card, CardContent } from '@/components/ui/card';
import './editor-styles.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <Card>
        <CardContent className="p-0">
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || '')}
            preview="edit"
            height={200}
            className="border-0"
            data-color-mode="light"
            hideToolbar={false}
            textareaProps={{
              placeholder: placeholder || "Escribe el contenido de la lección aquí...",
              style: {
                fontSize: '14px',
                lineHeight: '1.6',
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
} 