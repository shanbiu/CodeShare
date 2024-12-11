'use client'

import { useTheme } from "next-themes"
import Editor from "@monaco-editor/react"

interface CodeEditorProps {
  title: string;
  language: string;
  code: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ title, language, code, onChange }: CodeEditorProps) {
  const { theme } = useTheme()

  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="w-full h-64 border rounded">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}

