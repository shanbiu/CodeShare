import React, { useEffect } from "react";
import { Card } from "antd";
import Editor from "@monaco-editor/react";
import { useTheme } from "./ThemeProvider";
import * as monaco from "monaco-editor"; 

interface CodeEditorProps {
  title: string;
  code: string;
  language: string;
  onChange: (code: string) => void;
}
export function CodeEditor({ title, code, language, onChange }: CodeEditorProps) {
  const { isDarkMode } = useTheme();

  return (
    <Card>
      <div>
        <Editor
          className="h-72"
          language={language}  // 使用受控属性 language
          value={code}
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          onChange={(value) => onChange(value || '')} // 如果 value 为 null，设置为空字符串
          options={{
            minimap: {
              enabled: false
            },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
    </Card>
  );
}
