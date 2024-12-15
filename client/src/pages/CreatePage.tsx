import React, { useState } from 'react';
import { Layout, Typography, Card } from 'antd';
import Header from '../components/Header';
import '../tailwind.css';
import { DocumentMate } from '../components/DocumentMeta';
import { SubmitButtons } from '../components/SubmitButton';
import CodeTabs from '../components/CodeTabs'; // 导入封装好的 CodeTabs
import ThemeSwitcher from '../components/ThemeSwitcher'; // 导入 ThemeSwitcher
import dayjs from 'dayjs'; // 导入 dayjs 库
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

function CreatePage() {
  // ID 处理
  const [id, setId] = useState(0);
  const [title, setTitle] = useState('代码标题');
  const [tags, setTags] = useState<string[]>([]); // Tags
  const createAt = dayjs(); // 创建时间
  const [expireAt, setExpireAt] = useState<dayjs.Dayjs | null>(null); // 过期时间
  const [markdown, setMarkdown] = useState("**你好，世界！**"); // markdown 内容

  const [snippets, setSnippets] = useState([
    { key: '1', language: 'javascript', title: '代码标题', code: '//代码内容' },
  ]);
  const [activeSnippet, setActiveSnippet] = useState(snippets[0].key);
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");

  const addSnippet = (newTabIndex: number) => {
    const newKey = `${newTabIndex}`;
    setSnippets([
      ...snippets,
      { key: newKey, language: 'javascript', title: '代码标题' + newKey, code: '//代码内容' },
    ]);
    setActiveSnippet(newKey);
  };

  const removeSnippet = (targetKey: string) => {
    const newSnippets = snippets.filter((snippet) => snippet.key !== targetKey);
    setSnippets(newSnippets);
    if (newSnippets.length && activeSnippet === targetKey) {
      setActiveSnippet(newSnippets[newSnippets.length - 1].key);
    }
  };

  const updateSnippet = (key: string, newCode: string, newLanguage: string, newTitle: string) => {
    setSnippets(
      snippets.map((snippet) =>
        snippet.key === key ? { ...snippet, code: newCode, language: newLanguage, title: newTitle } : snippet
      )
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle || '代码标题');
  };

  const handleSubmit = async () => {
    const submittedData = {
      id,
      title,
      snippets,
      tags,
      create_at: createAt.format('YYYY-MM-DD HH:mm:ss'), // 格式化时间
      expire_at: expireAt ? expireAt.format('YYYY-MM-DD HH:mm:ss') : null,
      markdown,
      isPublic,
      password,
    };
  
    try {
      console.log("Sending request to :", '/api/submit');
      // 使用 axios 发送 POST 请求
      const response = await axios.post('/api/submit', submittedData);
      
      console.log("Response:", response);
      // 这里可以根据响应结果进行相应的操作，比如跳转页面或显示提示
    } catch (error) {
      console.error('提交失败:', error);
      // 处理错误，比如显示错误提示
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4">
        <div className="container mx-auto">
          <Card>
            <div className="flex justify-between items-center">
              <Title level={3}>{title}</Title>
              <ThemeSwitcher className="w-28" />
            </div>

            <CodeTabs
              snippets={snippets}
              activeSnippet={activeSnippet}
              setActiveSnippet={setActiveSnippet}
              onAddSnippet={addSnippet}
              onRemoveSnippet={removeSnippet}
              onUpdateSnippet={updateSnippet}
            />
          </Card>
          <DocumentMate
            onTitleChange={handleTitleChange}
            tags={tags} // 传递 tags
            setTags={setTags} // 更新 tags
            expireAt={expireAt}
            setExpireAt={setExpireAt} // 更新过期时间
            markdown={markdown}
            setMarkdown={setMarkdown} // 更新 markdown
          />
          <SubmitButtons
            isPublic={isPublic}
            password={password}
            onIsPublicChange={setIsPublic}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default CreatePage;
