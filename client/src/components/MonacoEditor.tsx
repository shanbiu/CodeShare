import * as monaco from "monaco-editor";
import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";

// 配置 Monaco 编辑器的语言支持
function MonacoEditor({
  language,
  code,
  onChange,
}: {
  language: string;
  code: string;
  onChange: (value: string) => void;
}) {
  useEffect(() => {
    // 注册 Python 语言支持
    monaco.languages.register({ id: "python" });

    // 注册 Java 语言支持
    monaco.languages.register({ id: "java" });

    // 配置 Python 语言的语法规则
    monaco.languages.setMonarchTokensProvider("python", {
      tokenizer: {
        root: [
          [/\b(?:def|return|import|from|class)\b/, "keyword"],
          [/\b(?:True|False|None)\b/, "keyword.constant"],
          [/\b(?:and|or|not)\b/, "keyword.operator"],
          [/[a-zA-Z_]\w*/, "identifier"],
        ],
      },
    });

    // 配置 Java 语言的语法规则
    monaco.languages.setMonarchTokensProvider("java", {
      tokenizer: {
        root: [
          [
            /\b(?:public|private|class|interface|return|void|package)\b/,
            "keyword",
          ],
          [/\b(?:int|String|boolean)\b/, "keyword.type"],
          [/[a-zA-Z_]\w*/, "identifier"],
        ],
      },
    });

    // 为 Python 语言提供补全项
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: (model) => {
        const suggestions = [
          {
            label: "print",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "print()",
            range: model.getFullModelRange(), // 必须定义 range 属性
          },
        ];

        return { suggestions };
      },
    });

    // 为 Java 语言提供补全项
    monaco.languages.registerCompletionItemProvider("java", {
      provideCompletionItems: (model) => {
        const suggestions = [
          {
            label: "System.out.println",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "System.out.println()",
            range: model.getFullModelRange(), // 必须定义 range 属性
          },
        ];

        return { suggestions };
      },
    });
  }, []);

  return (
    <Editor
      height="400px"
      language={language}
      value={code}
      onChange={(value) => onChange(value || "")} // 处理代码变更
      theme="vs-dark"
    />
  );
}

export default MonacoEditor;
