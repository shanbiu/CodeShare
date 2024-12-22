import React, { useState } from "react";
import { Tabs, Select, Input } from "antd";
import { CodeEditor } from "./CodeEditor"; // 引入 Monaco Editor 组件

import UniqueCode from "./createUniqueCode";

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
  onAddSnippet: (newTabIndex: string) => void;
  onRemoveSnippet: (targetKey: string) => void;
  onUpdateSnippet: (
    key: string,
    newCode: string,
    newLanguage: string,
    newTitle: string
  ) => void;
}

const CodeTabs: React.FC<CodeTabsProps> = ({
  snippets,
  activeSnippet,
  setActiveSnippet,
  onAddSnippet,
  onRemoveSnippet,
  onUpdateSnippet,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null); // 当前正在编辑的标签 key
  const [newTitle, setNewTitle] = useState<string>(""); // 编辑时的标题值

  const handleLanguageChange = (key: string, value: string) => {
    const updatedSnippet = snippets.find((snippet) => snippet.key === key);
    if (updatedSnippet) {
      onUpdateSnippet(key, updatedSnippet.code, value, updatedSnippet.title); // 更新语言
    }
  };

  const handleTitleEdit = (key: string, title: string) => {
    setEditingKey(key); // 设置正在编辑的标签 key
    setNewTitle(title); // 设置当前标题
  };

  const handleTitleSave = (key: string) => {
    if (newTitle.trim() === "") return; // 防止保存空标题
    const updatedSnippet = snippets.find((snippet) => snippet.key === key);
    if (updatedSnippet) {
      onUpdateSnippet(
        key,
        updatedSnippet.code,
        updatedSnippet.language,
        newTitle
      );
      setEditingKey(null); // 保存后退出编辑状态
    }
  };

  const handleAddSnippet = () => {
    const newKey = UniqueCode(); // 使用 uuid 生成唯一的 key
    onAddSnippet(newKey); // 添加新的 tab
  };

  return (
    <Tabs
      type="editable-card"
      activeKey={activeSnippet}
      onChange={setActiveSnippet}
      onEdit={(targetKey, action) => {
        if (action === "add") {
          handleAddSnippet();
        } else if (action === "remove") {
          onRemoveSnippet(targetKey as string);
        }
      }}
      items={snippets.map((snippet) => ({
        key: snippet.key,
        label:
          editingKey === snippet.key ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => handleTitleSave(snippet.key)} // 离开编辑框时保存
              onPressEnter={() => handleTitleSave(snippet.key)} // 按 Enter 键保存
              autoFocus
              style={{
                minWidth: "60px",
                maxWidth: "80px",
                border: "none",
                outline: "none",
                padding: "0 2px",
                boxSizing: "border-box",
              }}
            />
          ) : (
            <span
              onDoubleClick={() => handleTitleEdit(snippet.key, snippet.title)}
            >
              {snippet.title}
            </span>
          ),
        children: (
          <div className="relative">
            <Select
              value={snippet.language}
              onChange={(value) => handleLanguageChange(snippet.key, value)}
              className="w-28 absolute right-0 top-[-40px]"
            >
              <Select.Option value="javascript">JavaScript</Select.Option>
              <Select.Option value="python">Python</Select.Option>
              <Select.Option value="java">Java</Select.Option>
            </Select>
            <CodeEditor
              title={snippet.title}
              language={snippet.language} // 传递动态语言
              code={snippet.code}
              onChange={(newCode) =>
                onUpdateSnippet(
                  snippet.key,
                  newCode,
                  snippet.language,
                  snippet.title
                )
              }
            />
          </div>
        ),
      }))}
    />
  );
};

export default CodeTabs;
