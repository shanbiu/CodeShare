import React from "react";
import {Card} from "antd";
import Editor from "@monaco-editor/react";
import { useTheme } from "./ThemeProvider";


interface CodeEditorProps {
    title: string;
    code: string;
    language: string;
    onChange: (code: string) => void;
}

export function CodeEditor({title,code, language, onChange}: CodeEditorProps) {
  const {isDarkMode} = useTheme();

  return(
    < Card >
      <div>
        <Editor
        className="h-72"
        defaultLanguage={language}
        value={code}
        theme={isDarkMode ? 'vs-dark' : 'vs-light'}
        onChange={(value)=>onChange(value || '')} // if value is null, set it to empty string
        options={{
          minimap: {
            enabled: false
          },
          fontSize:14,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
        }}
        />
      </div>
    </Card>
  )
}