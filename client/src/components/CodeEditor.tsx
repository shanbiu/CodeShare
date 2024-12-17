import React, { useEffect } from "react";
import { Card } from "antd";
import Editor from "@monaco-editor/react";
import { useTheme } from "./ThemeProvider";
import * as monaco from "monaco-editor"; // 引入 Monaco 编辑器

interface CodeEditorProps {
  title: string;
  code: string;
  language: string;
  onChange: (code: string) => void;
}

export function CodeEditor({ title, code, language, onChange }: CodeEditorProps) {
  const { isDarkMode } = useTheme();

  // 在加载编辑器时动态加载语言支持
  useEffect(() => {
    // 注册 Python 和 Java 支持
    if (language === "python") {
      monaco.languages.register({ id: "python" });
      monaco.languages.setMonarchTokensProvider("python", pythonLanguageDefinition);  // 加载语法高亮
      monaco.languages.registerCompletionItemProvider("python", pythonCompletionProvider); // 注册补全项
    } else if (language === "java") {
      monaco.languages.register({ id: "java" });
      monaco.languages.setMonarchTokensProvider("java", javaLanguageDefinition);  // 加载语法高亮
      monaco.languages.registerCompletionItemProvider("java", javaCompletionProvider); // 注册补全项
    }
  }, [language]); // 语言变化时重新加载

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

// Python 语言的语法高亮和补全项
const pythonLanguageDefinition = {
  tokenizer: {
    root: [
      // 关键字
      { regex: /\b(print|def|return|import|for|in|if|else|elif)\b/, action: { token: 'keyword' } },
      // 标识符
      { regex: /[a-zA-Z_]\w*/, action: { token: 'identifier' } },
      // 数字
      { regex: /\d+/, action: { token: 'number' } },
      // 单引号字符串
      { regex: /'([^\\']|\\.)*'/, action: { token: 'string' } },
      // 双引号字符串
      { regex: /".*?"/, action: { token: 'string' } },
      // 常量
      { regex: /\b(True|False|None)\b/, action: { token: 'constant' } },
      // 运算符
      { regex: /\b(\+|\-|\*|\/|\%|==|!=|<|>|\<=|\>=)\b/, action: { token: 'operator' } }
    ]
  }
};

const pythonCompletionProvider = {
  provideCompletionItems: (model, position) => {
    return {
      suggestions: [
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print()',
          range: model.getFullModelRange(), // 自动计算范围
        },
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'def function_name():\n    ',
          range: model.getFullModelRange(),
        }
      ]
    };
  }
};

// Java 语言的语法高亮和补全项
const javaLanguageDefinition = {
  tokenizer: {
    root: [
      // 关键字
      { regex: /\b(System|println|class|public|private|int|String|void|boolean)\b/, action: { token: 'keyword' } },
      // 标识符
      { regex: /[a-zA-Z_]\w*/, action: { token: 'identifier' } },
      // 数字
      { regex: /\d+/, action: { token: 'number' } },
      // 字符串
      { regex: /".*?"/, action: { token: 'string' } },
      // 常量
      { regex: /\b(true|false)\b/, action: { token: 'constant' } },
      // 运算符
      { regex: /\b(\+|\-|\*|\/|\%|==|!=|<|>|\<=|\>=)\b/, action: { token: 'operator' } }
    ]
  }
};

const javaCompletionProvider = {
  provideCompletionItems: (model, position) => {
    return {
      suggestions: [
        {
          label: 'System.out.println',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'System.out.println()',
          range: model.getFullModelRange(), // 自动计算范围
        },
        {
          label: 'public static void main',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'public static void main(String[] args) {\n    \n}',
          range: model.getFullModelRange(),
        }
      ]
    };
  }
};
