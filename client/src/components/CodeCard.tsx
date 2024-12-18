import React, { useState } from 'react';
import { Card, message, Popover, Tag } from 'antd';
import { ShareAltOutlined,EllipsisOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import Editor from "@monaco-editor/react";
import ShareCard from './ShareCard'; // 引入新的 ShareCard 组件
import { useTheme } from './ThemeProvider'; // 引入 useTheme 钩子
import ActionMenu from './ActionMenu'; // 引入新的 ActionMenu 组件
import CodeTags from './CodeTags'; // 引入新的 CodeTags 组件
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate

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
    tags: string[];  // 这里的 tags 用来显示标签
    create_at: string;
    isPublic: boolean;
    password: string | null; // 密码
    expiration: string | null; // 过期时间
  };
}

export default function CodeCard({ item }: CodeCardProps) {
  const [isPublic, setIsPublic] = useState(item.isPublic);
  const { isDarkMode } = useTheme(); // 获取当前主题
  const navigate = useNavigate(); // 获取跳转函数

  // 动态设置 Monaco Editor 主题
  const editorTheme = isDarkMode ? 'vs-dark' : 'vs';

  // 跳转到代码详情页面
  const handleCardClick = () => {
    // 跳转到代码详情页面，传递 id 和 password 参数
    if (item.password) {
      navigate(`/code/${item.id}?pw=${item.password}`);
    } else {
      navigate(`/code/${item.id}`);
    }
  };

  return (
    <Card
      className="w-full shadow-md cursor-pointer" // 使卡片区域可点击
      title={
        <div className="flex items-center">
          <span className="text-lg font-bold">{item.title}
          {item.isPublic ? (
            <UnlockOutlined style={{ marginLeft: 8, color: 'green' }} />
          ) : (
            <LockOutlined style={{ marginLeft: 8, color: 'red' }} />
          )}
          </span>
        </div>
      }
      extra={
        <ActionMenu
          isPublic={isPublic}
          handleMenuClick={(key) => {
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
          }}
        />
      }
      onClick={handleCardClick} // 点击卡片跳转到详情页面
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
        {/* 使用 CodeTags 组件显示公开状态和标签 */}
        <CodeTags isPublic={isPublic} tags={item.tags} />

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
