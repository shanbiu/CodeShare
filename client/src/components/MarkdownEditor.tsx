import React, { useRef } from "react";
import { Button,  Tooltip } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  TableOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
  FileOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import MarkdownIt from "markdown-it";
import markdownItUnderline from "markdown-it-underline"; // 引入下划线插件

// 初始化 MarkdownIt 实例，允许解析 HTML 标签，并使用 markdown-it-underline 插件
const md = new MarkdownIt({ html: true }).use(markdownItUnderline); 

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

export function MarkdownEditor({ markdown, setMarkdown }: MarkdownEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);  // 更新 markdown 内容
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const selectedText = textAreaRef.current.value.substring(start, end);
      const newText =
        textAreaRef.current.value.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        textAreaRef.current.value.substring(end);

      // 更新 markdown 内容
      setMarkdown(newText);

      // 聚焦并调整光标位置
      textAreaRef.current.focus();
      requestAnimationFrame(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + prefix.length + selectedText.length;
          textAreaRef.current.selectionEnd = textAreaRef.current.selectionStart;
        }
      });
    }
  };

  const buttons = [
    { title: "标题", icon: <span className="font-bold text-base">H</span>, action: () => insertMarkdown("# ") },
    { title: "加粗", icon: <BoldOutlined />, action: () => insertMarkdown("**", "**") },
    { title: "斜体", icon: <ItalicOutlined />, action: () => insertMarkdown("*", "*") },
    { title: "删除线", icon: <StrikethroughOutlined />, action: () => insertMarkdown("~~", "~~") },
    { title: "有序列表", icon: <OrderedListOutlined />, action: () => insertMarkdown("1. ") },
    { title: "无序列表", icon: <UnorderedListOutlined />, action: () => insertMarkdown("- ") },
    { title: "链接", icon: <LinkOutlined />, action: () => insertMarkdown("[链接文字](", ")") },
    { title: "图片", icon: <PictureOutlined />, action: () => insertMarkdown("![图片描述](", ")") },
    { title: "代码块", icon: <CodeOutlined />, action: () => insertMarkdown("\n```\n", "\n```") },
    { title: "表格", icon: <TableOutlined />, action: () =>
      insertMarkdown("\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |")
    },
    { title: "左对齐", icon: <AlignLeftOutlined />, action: () => insertMarkdown("::: left\n", "\n:::") },
    { title: "居中对齐", icon: <AlignCenterOutlined />, action: () => insertMarkdown("::: center\n", "\n:::") },
    { title: "右对齐", icon: <AlignRightOutlined />, action: () => insertMarkdown("::: right\n", "\n:::") },
    { title: "HTML标签", icon: <span>&lt;&gt;</span>, action: () => insertMarkdown("<", ">") },
    { title: "大括号", icon: <span>{"{}"}</span>, action: () => insertMarkdown("{", "}") },
    { title: "分割线", icon: <span>---</span>, action: () => insertMarkdown("\n---\n") },
    { title: "引用", icon: <span>&gt;</span>, action: () => insertMarkdown("> ") },
    { title: "帮助", icon: <QuestionCircleOutlined />, action: () => {/* 添加帮助功能 */} },
    { title: "全屏", icon: <FullscreenOutlined />, action: () => {/* 添加全屏功能 */} },
    { title: "保存", icon: <FileOutlined />, action: () => {/* 添加保存功能 */} },
    { title: "设置", icon: <SettingOutlined />, action: () => {/* 添加设置功能 */} },
  ];

  return (
    <div>
      {/* 工具栏容器 */}
      <div className="flex justify-between items-center space-x-2 border border-b-0 border-neutral-200  overflow-x-auto
      dark:border-neutral-800">
        {/* 左侧按钮组 */}
        <div className="flex space-x-2">
          {buttons.slice(0, -4).map((button) => (
            <Tooltip key={button.title} title={button.title}>
              <Button
                className="border-0 rounded-none"
                icon={button.icon}
                onClick={button.action}
              />
            </Tooltip>
          ))}
        </div>

        {/* 右侧按钮组 */}
        <div className="flex space-x-2">
          {buttons.slice(-4).map((button) => (
            <Tooltip key={button.title} title={button.title}>
              <Button
                className="border-0 rounded-none"
                icon={button.icon}
                onClick={button.action}
              />
            </Tooltip>
          ))}
        </div>
      </div>

      {/* 编辑区和预览区 */}
      <div className="grid grid-cols-2">
        <div>
          <textarea
             className="w-full h-60 p-4 border border-neutral-200 rounded-none dark:border-neutral-800
             focus:ring-1 outline-none ring-inset ring-black
             dark:bg-neutral-900 dark:focus:ring-1 dark:ring-white dark:ring-inset dark:border-1"
            ref={textAreaRef}
            rows={10}
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="输入 Markdown 描述..."
          />
        </div>
        <div
          className="markdown border overflow-auto h-60 p-4 border-neutral-200 dark:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: md.render(markdown) }}
        />
      </div>
    </div>
  );
}
