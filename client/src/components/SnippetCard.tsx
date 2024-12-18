import React from 'react';
import { Card, Badge, Button, Typography, Tabs, Space } from 'antd';
import { EditOutlined, CopyOutlined, LockOutlined, UnlockOutlined, ShareAltOutlined } from '@ant-design/icons';
import ActionMenu from './ActionMenu';
import ReactMarkdown from 'react-markdown';
import { Editor } from '@monaco-editor/react';
import CodeTags from './CodeTags'; // 引入 CodeTags 组件

interface Snippet {
  key: string;
  title: string;
  language: string;
  code: string;
}

interface SnippetData {
  title: string;
  markdown: string;
  snippets: Snippet[];
  tags: string[];
  isPublic: boolean;
  expiration: string | null;
  create_at: string;
}

interface SnippetCardProps {
  snippetData: SnippetData;
  handleCopy: (code: string) => void;
  handleMenuClick: (action: string) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippetData, handleCopy, handleMenuClick }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  const formatExpiration = (expiration: string | null) => expiration ? formatDate(expiration) : '永久';

  const getEditorLanguage = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return 'javascript';
      case 'typescript':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'python':
        return 'python';
      // 可以继续添加更多的语言
      default:
        return 'plaintext';
    }
  };

  return (
    <Card style={{ flex: 1, fontSize: '14px', height: '500px' }} className="relative">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Typography.Title level={3} style={{ display: 'inline-flex', alignItems: 'center' }}>
          {snippetData.title}
          {snippetData.isPublic ? (
            <UnlockOutlined className="ml-2" style={{ color: 'green' }} />
          ) : (
            <LockOutlined className="ml-2" style={{ color: 'orange' }} />
          )}
        </Typography.Title>
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">编辑</Button>
          <Button type="link" icon={<ShareAltOutlined />} size="small">分享</Button>
        </Space>
      </div>

      {/* 渲染 Markdown 内容 */}
      <div style={{ marginBottom: '16px' }}>
        <ReactMarkdown>{snippetData.markdown}</ReactMarkdown>
      </div>

      <Tabs defaultActiveKey={snippetData.snippets[0].key}>
        <div className="flex justify-between items-center mb-2">
          <Tabs.TabPane tab="代码" key={snippetData.snippets[0].key}>
            <Badge color="secondary" text={snippetData.snippets[0].language} />
          </Tabs.TabPane>
        </div>

        {/* 渲染代码片段 */}
        {snippetData.snippets.map((snippet) => (
          <Tabs.TabPane key={snippet.key} tab={snippet.title}>
            <div style={{ position: 'relative' }}>
              <Button
                icon={<CopyOutlined />}
                shape="circle"
                size="small"
                style={{ position: 'absolute', top: '8px', right: '8px' }}
                onClick={() => handleCopy(snippet.code)}
              />
              <Editor
                height="200px"
                language={getEditorLanguage(snippet.language)}
                value={snippet.code}
                theme="vs-dark"
                options={{ readOnly: true, minimap: { enabled: false } }}
              />
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>

      {/* 使用 CodeTags 组件来显示公开状态和标签 */}
      <div className="flex justify-between items-center mt-4">
        <CodeTags isPublic={snippetData.isPublic} tags={snippetData.tags} />
        <Typography.Text type="secondary" className="text-right">
          过期时间: {snippetData.expiration ? formatExpiration(snippetData.expiration) : '永久'}
        </Typography.Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Text type="secondary">
          创建时间: {formatDate(snippetData.create_at)}
        </Typography.Text>

        <ActionMenu
          isPublic={snippetData.isPublic}
          handleMenuClick={handleMenuClick}
        />
      </div>
    </Card>
  );
};

export default SnippetCard;
