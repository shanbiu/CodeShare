import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, notification } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../tailwind.css';
import { DocumentMate } from '../components/DocumentMeta';
import { SubmitButtons } from '../components/SubmitButton';
import CodeTabs from '../components/CodeTabs'; // 导入封装好的 CodeTabs
import ThemeSwitcher from '../components/ThemeSwitcher'; // 导入 ThemeSwitcher
import { useTheme } from "../components/ThemeProvider";
import dayjs from 'dayjs'; // 导入 dayjs 库
import axios from 'axios';
import CodeForm from '../components/CodeForm'; // 引入表单组件

// 用于生成 6 位长度的短链 ID
const generateShortId = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};

const { Content } = Layout;
const { Title } = Typography;

function CreatePage() {
  const { code_id } = useParams(); // 获取 URL 中的 id 参数
  const queryPassword = new URLSearchParams(location.search).get('pw'); // 获取 URL 中的密码参数

  const navigate = useNavigate();
  const [codeData, setCodeData] = useState<any | null>(null); // 用于存储编辑页面的代码数据
  const [loading, setLoading] = useState(false); // 控制加载状态
  // 使用 generateShortId 来生成短链 ID
  const [id, setId] = useState<string>(generateShortId()); // 初始化 id 为 6 位短链
  const [title, setTitle] = useState('代码片段');
  const [tags, setTags] = useState<string[]>([]); // Tags
  const createAt = dayjs(); // 创建时间
  const [expireAt, setExpireAt] = useState<dayjs.Dayjs | null>(null); // 过期时间
  const [markdown, setMarkdown] = useState("**你好，世界！**"); // markdown 内容

   const { isDarkMode } = useTheme(); 
  const [snippets, setSnippets] = useState([
    { key: generateShortId(), language: 'javascript', title: '代码块', code: '//请输入你的代码' },
  ]);
  const [activeSnippet, setActiveSnippet] = useState(snippets[0].key);
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");

// 1. 加载数据（如果是编辑模式）
useEffect(() => {
  if (code_id) {
    setId(code_id); // 更新 id
    const fetchData = async () => {
      try {
        setLoading(true);
        // 判断是否有密码查询参数
        const url = queryPassword
          ? `/api/code/${code_id}?pw=${queryPassword}`  // 如果有密码参数，拼接上密码
          : `/api/code/${code_id}`;  // 如果没有密码参数，不拼接密码
        const response = await axios.get(url);
        setCodeData(response.data);
        const { title, snippets, tags, markdown, isPublic, password: dbPassword, expireAt, createAt } = response.data;

        if (!isPublic && queryPassword !== dbPassword) {
          notification.error({
            message: '密码错误',
            description: '您输入的密码不正确，无法访问该代码。',
          });
          navigate('/'); // 或者跳转到其他页面
          return;
        }
        setTitle(title);
        setSnippets(snippets);
        setTags(tags);
        setMarkdown(markdown);
        setIsPublic(isPublic);
        setPassword(password || ""); // 如果是加密状态，填充密码
        setExpireAt(expireAt ? dayjs(expireAt) : null);
        setActiveSnippet(snippets[0].key); // 设置第一个代码块为活动代码块
      } catch (error) {
        console.error('加载数据失败', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }
}, [code_id]);


  const addSnippet = (newTabIndex: string) => {
    const newKey = `${newTabIndex}`;
    const newSnippet = { key: newKey, language: 'javascript', title: '代码块', code: '//请输入你的代码' };
    setSnippets((prevSnippets) => [...prevSnippets, newSnippet]);
    setActiveSnippet(newKey); // 确保设置 activeSnippet 为新的 key
  };

  const removeSnippet = (targetKey: string) => {
    const newSnippets = snippets.filter((snippet) => snippet.key !== targetKey);
    setSnippets(newSnippets);
    
    // 如果删除的是最后一个代码块，自动添加新代码块并提示
    if (newSnippets.length === 0) {
      addSnippet('1'); // 自动添加新的代码块
      notification.info({
        message: '删除最后一个代码块',
        description: '您删除了最后一个代码块，系统已自动为您添加一个新的代码块。',
      });
    } else if (activeSnippet === targetKey) {
      setActiveSnippet(newSnippets[0].key);
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
   // 判断是否为编辑模式
   const isEditMode = !!code_id; // 如果 code_id 存在，则为编辑模式

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
      if (isEditMode) {
        // 编辑模式，更新已有数据
        console.log("Updating data to:", '/api/update');
        const response = await axios.put(`/api/update/${id}`, submittedData);
        console.log("Response:", response);
        notification.success({
          message: '更新成功',
          description: '代码片段已成功更新。',
        });
      } else {
        // 新建模式，提交新数据
        console.log("Creating new data to:", '/api/submit');
        const response = await axios.post('/api/submit', submittedData);
        console.log("Response:", response);
        notification.success({
          message: '创建成功',
          description: '代码片段已成功创建。',
        });
      }
    } catch (error) {
      console.error('提交失败:', error);
      notification.error({
        message: '提交失败',
        description: '出现错误，请稍后再试。',
      });
    }
  };

  // 监听 snippets 数组的变化，如果为空，则添加一个新的代码块
  useEffect(() => {
    if (snippets.length === 0) {
      addSnippet('1'); // 自动添加新的代码块
    }
  }, [snippets]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
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
            id={id}
            isEditMode={!!code_id} // 根据 code_id 判断是否为编辑模式
            queryPassword={queryPassword}
          />
        </div>
      </Content>
    </div>
  );
}

export default CreatePage;
