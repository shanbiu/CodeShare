import React from 'react';
import { Tabs, Select } from 'antd';
import { CodeEditor } from './CodeEditor';

interface Snippet {
  key: string;
  language: string;
  title: string;
  code: string;
}

interface CodeTabsProps {
  snippets: Snippet[];
  activeSnippet: string;
  setActiveSnippet: (key: string) => void;
  onAddSnippet: (newTabIndex: number) => void;
  onRemoveSnippet: (targetKey: string) => void;
  onUpdateSnippet: (key: string, newCode: string, newLanguage: string,newTitle: string) => void;
}

const CodeTabs: React.FC<CodeTabsProps> = ({
  snippets,
  activeSnippet,
  setActiveSnippet,
  onAddSnippet,
  onRemoveSnippet,
  onUpdateSnippet,
}) => {
  const handleLanguageChange = (key: string, value: string) => {
    // 获取当前Snippet，更新其语言
    const updatedSnippet = snippets.find((snippet) => snippet.key === key);
    if (updatedSnippet) {
      console.log(
        "updatedSnippet: ",value      );
      onUpdateSnippet(key, updatedSnippet.code, value, updatedSnippet.title); // 更新语言
    }
  };

  return (
    <Tabs
      type="editable-card"
      activeKey={activeSnippet}
      onChange={setActiveSnippet}
      onEdit={(targetKey, action) => {
        if (action === 'add') {
          onAddSnippet(snippets.length + 1);
        } else if (action === 'remove') {
          onRemoveSnippet(targetKey as string);
        }
      }}
      items={snippets.map((snippet) => ({
        key: snippet.key,
        label: snippet.title,
        children: (
          <div className="relative">
            <Select
              value={snippet.language}
              onChange={(value) => handleLanguageChange(snippet.key, value)} // 调用修改语言的函数
              className="w-28 absolute right-0 top-[-40px]"
            >
              <Select.Option value="javascript">JavaScript</Select.Option>
              <Select.Option value="python">Python</Select.Option>
              <Select.Option value="java">Java</Select.Option>
            </Select>
            <CodeEditor
              key={snippet.key}
              title={snippet.title}
              language={snippet.language}
              code={snippet.code}
              onChange={(newCode) => onUpdateSnippet(snippet.key, newCode, snippet.language, snippet.title)} // 更新代码
            />
          </div>
        ),
      }))}
    />
  );
};

export default CodeTabs;
