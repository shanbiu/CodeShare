import React, { useEffect } from 'react';
import { Card, Badge, Button, Tabs, Space } from 'antd';
import { EditOutlined, CopyOutlined, LockOutlined, UnlockOutlined, ShareAltOutlined } from '@ant-design/icons';
import ActionMenu from './ActionMenu';
import ReactMarkdown from 'react-markdown';
import { Editor } from '@monaco-editor/react';
import CodeTags from './CodeTags'; // 引入 CodeTags 组件
import { useTheme } from './ThemeProvider'; // 引入 useTheme
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import SharePopover from './SharePopover'; // 引入 SharePopover 组件
import MarkdownIt from 'markdown-it';
import markdownItUnderline from 'markdown-it-underline'; // 引入下划线插件
import Clipboard from 'clipboard'; // 用于处理复制

interface Snippet {
  key: string;
  title: string;
  language: string;
  code: string;
}

interface SnippetData {
  title: string;
  id: string;
  password: string | null; // 密码
  markdown: string;
  snippets: Snippet[];
  tags: string[];
  isPublic: boolean;
  expire_at: string | null;
  create_at: string;
}

interface SnippetCardProps {
  snippetData: SnippetData;
  handleCopy: (code: string) => void;
  handleMenuClick: (action: string) => void;
  fetchData: () => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippetData, handleCopy, handleMenuClick, fetchData }) => {
  const { isDarkMode } = useTheme(); // 获取当前主题状态
  const navigate = useNavigate(); // 获取路由跳转函数

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();
  const formatExpire_at = (expire_at: string | null) => expire_at ? formatDate(expire_at) : '永久';

  const handleEditClick = () => {
    if (snippetData.password) {
      // 如果有密码，带上密码参数跳转
      navigate(`/edit/${snippetData.id}?pw=${snippetData.password}`);
    } else {
      // 如果没有密码，直接跳转
      navigate(`/edit/${snippetData.id}`);
    }
  };

  const handleDelete = () => {
    if (snippetData.id) {
      navigate('/');  // 删除后跳转到根路由
    }
  };

  // 初始化 markdown-it 实例，使用 markdown-it-underline 插件
  const md = new MarkdownIt().use(markdownItUnderline);

  // 自定义代码块渲染，添加复制按钮
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const code = token.content;
    const language = token.info.trim();

    // 需要确保缩进和代码内容的正确显示
    return `
      <div class="code-container" style="position: relative; margin-bottom: 16px;">
        <button class="copy-btn" data-clipboard-text="${encodeURIComponent(code)}" style="position: absolute; top: 8px; right: 8px;">复制</button>
        <pre style="background-color: #f5f5f5; padding: 16px; border-radius: 4px;">
          <code class="language-${language}">${code}</code>
        </pre>
      </div>
    `;
  };

  // 渲染 Markdown 内容
  const renderedMarkdown = md.render(snippetData.markdown);

  useEffect(() => {
    // 初始化 Clipboard.js
    const clipboard = new Clipboard('.copy-btn');
    clipboard.on('success', (e) => {
      alert('复制成功!');
      e.clearSelection();
    });
    clipboard.on('error', (e) => {
      alert('复制失败，请手动复制!');
    });

    // 清理 Clipboard 实例
    return () => {
      clipboard.destroy();
    };
  }, []);

  // 生成 Tabs 项数据
  const tabItems = snippetData.snippets.map((snippet) => ({
    key: snippet.key,
    label: snippet.title,
    children: (
      <div style={{ position: 'relative' }}>
        <Button
          icon={<CopyOutlined />}
          shape="circle"
          size="small"
          style={{ position: 'absolute', top: '8px', right: '8px' }}
          onClick={() => handleCopy(snippet.code)}
        />
        <Card>
          <Editor
            height="200px"
            language={snippet.language}
            value={snippet.code}
            theme={isDarkMode ? "vs-dark" : "vs-light"} // 根据主题设置 editor 的主题
            options={{ readOnly: true, minimap: { enabled: false } }}
          />
        </Card>
      </div>
    ),
  }));

  return (
    <Card style={{ flex: 1, fontSize: '14px', height: 'auto'  }} className="relative">
      {/* 使用 Card.Meta 显示标题和公共/加密状态 */}
      <Card.Meta
        title={
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              {snippetData.title}
              {snippetData.isPublic ? (
                <UnlockOutlined className="ml-2" style={{ color: 'green' }} />
              ) : (
                <LockOutlined className="ml-2" style={{ color: 'red' }} />
              )}
            </div>
            <Space>
              <Button type="link" icon={<EditOutlined />} size="small" onClick={handleEditClick}>编辑</Button>
              <SharePopover item={snippetData} fetchData={fetchData} children={
                <Button type="link" icon={<ShareAltOutlined />} size="small">分享</Button>
              } />
            </Space>
          </div>
        }
      />

      {/* 渲染 Markdown 内容 */}
      <div
        className='mb-4'
        dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
      />

      {/* 使用新版 Tabs，使用 items 来渲染 Tab */}
      <Tabs type="card" defaultActiveKey={snippetData.snippets[0].key} items={tabItems} />

      {/* 使用 CodeTags 组件来显示公开状态和标签 */}
      <div className="flex justify-between items-center mt-4">
        <CodeTags isPublic={snippetData.isPublic} tags={snippetData.tags} />
        <div className="text-right">
          <span>过期时间: {snippetData.expire_at ? formatExpire_at(snippetData.expire_at) : '永久'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <div>
          创建时间: {formatDate(snippetData.create_at)}
        </div>
        <ActionMenu
          isPublic={snippetData.isPublic}
          id={snippetData.id}
          password={snippetData.password}
          fetchData={handleDelete}
        />
      </div>
    </Card>
  );
};

export default SnippetCard;
