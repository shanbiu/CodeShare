import React, { useState } from 'react';
import { Card, Dropdown, message, Tag, Popover } from 'antd';
import { LockOutlined, UnlockOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, EllipsisOutlined } from '@ant-design/icons';
import Editor from "@monaco-editor/react";
import ShareCard from './ShareCard'; // 引入新的 ShareCard 组件
import { useTheme } from './ThemeProvider'; // 引入 useTheme 钩子

interface CodeCardProps {
  item: {
    id: string;
    title: string;
    snippets: Array<{
      key: string;
      language: string;
      title: string;
      code: string;
    }>;
    tags: string[];
    create_at: string;
    isPublic: boolean;
    password: string | null; // 密码
    expiration: string | null; // 过期时间
  };
}

// 为语言设置专属颜色
const languageColors: { [key: string]: string } = {
  javascript: 'blue',
  python: 'green',
  java: 'red',
  // 可以根据需求扩展更多语言的颜色
};

export default function CodeCard({ item }: CodeCardProps) {
  const [isPublic, setIsPublic] = useState(item.isPublic);
  const { isDarkMode } = useTheme(); // 获取当前主题

  // 动态设置 Monaco Editor 主题
  const editorTheme = isDarkMode ? 'vs-dark' : 'vs';

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'toggleEncryption':
        setIsPublic(!isPublic);
        message.success(`代码片段已${isPublic ? '加密' : '解密'}`);
        break;
      case 'edit':
        message.info('编辑功能待实现');
        break;
      case 'delete':
        message.info('删除功能待实现');
        break;
    }
  };

  const menuItems = [
    {
      key: 'toggleEncryption',
      icon: isPublic ? <LockOutlined /> : <UnlockOutlined />,
      label: isPublic ? '加密' : '取消加密',
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
    },
  ];

  // 去重所有语言标签
  const uniqueLanguages = Array.from(
    new Set(item.snippets.map((snippet) => snippet.language))
  );

  return (
    <Card
      className="w-full shadow-md"
      title={
        <div className="flex items-center">
          <span className="text-lg font-bold">{item.title}</span>
          {/* 紧跟标题显示图标 */}
          {isPublic ? <UnlockOutlined className="ml-2 text-green-500" /> : <LockOutlined className="ml-2 text-red-500" />}
        </div>
      }
      extra={
        <Dropdown menu={{ items: menuItems, onClick: ({ key }) => handleMenuClick(key) }}>
          <EllipsisOutlined className="text-xl cursor-pointer" />
        </Dropdown>
      }
    >
      <div className="text-sm text-gray-500 mb-2">
        创建于 {new Date(item.create_at).toLocaleString('zh-CN', { hour12: false })}
      </div>
      <div className="h-48 mb-4">
        {/* 编辑器 */}
        <Editor
          height="100%"
          language={item.snippets[0].language}
          value={item.snippets[0].code}
          theme={editorTheme} 
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'off',
            folding: false,
            wordWrap: 'on',
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Tag color={isPublic ? "success" : "error"}>
            {isPublic ? '公开' : '加密'}
          </Tag>
          {/* 显示去重后的语言标签，应用专属颜色 */}
          {uniqueLanguages.map((language) => (
            <Tag key={language} color={languageColors[language] || 'default'}>
              {language}
            </Tag>
          ))}
        </div>
        
        <Popover
          content={
            <ShareCard
              id={item.id}
              isPublic={isPublic}
              password={item.password}
              expiration={item.expiration}
            />
          }
          title="分享详情"
          trigger="hover"
          placement="bottom"
        >
          <Tag color="default" className="text-sm font-medium flex items-center cursor-pointer space-x-1 px-2 py-1 border border-gray-400 rounded-lg bg-white text-gray-800 
            hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
            <ShareAltOutlined className="text-xl" />
            <span>分享</span>
          </Tag>
        </Popover>
      </div>
    </Card>
  );
}
