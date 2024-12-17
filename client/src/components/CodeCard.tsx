import React, { useState } from 'react';
import { Card, Dropdown, message, Tooltip, ConfigProvider, Tag } from 'antd';
import { LockOutlined, UnlockOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, EllipsisOutlined } from '@ant-design/icons';
import Editor from "@monaco-editor/react";

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
  };
}

export default function CodeCard({ item }: CodeCardProps) {
  const [isPublic, setIsPublic] = useState(item.isPublic);

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

  return (
    <ConfigProvider getPopupContainer={(trigger) => trigger || document.body}>
      <Card
        className="w-full shadow-md"
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{item.title}</span>
            {isPublic ? <UnlockOutlined className="text-green-500" /> : <LockOutlined className="text-red-500" />}
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
          <Editor
            height="100%"
            language={item.snippets[0].language}
            value={item.snippets[0].code}
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
            <Tag>{item.snippets[0].language}</Tag>
          </div>
          <Tooltip title={`ID: ${item.id}`} placement="left">
            <ShareAltOutlined className="text-xl cursor-pointer text-blue-500" />
          </Tooltip>
        </div>
      </Card>
    </ConfigProvider>
  );
}
