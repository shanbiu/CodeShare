import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import LeftIcons from '../components/LeftIcons';
import SnippetCard from '../components/SnippetCard'; // 引入 SnippetCard
import { useTheme } from '../components/ThemeProvider'; // 引入 useTheme 钩子
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function DetailPage() {
  const { isDarkMode } = useTheme(); // 获取当前的主题状态
  const { id } = useParams(); // 获取路由中的 id 参数
  const location = useLocation(); // 获取当前 URL 的信息
  const [snippetData, setSnippetData] = useState(null); // 初始数据为空
  const navigate = useNavigate(); 

  // 从 URL 查询字符串中获取 pw 参数
  const queryParams = new URLSearchParams(location.search);
  const pw = queryParams.get('pw'); // 获取密码参数

  const fetchData = async (id, pw) => {
    try {
      const path =pw? `/code/${id}?pw=${pw}` : `/code/${id}`; // 如果有密码，则将密码添加到 path 中
      navigate(path);

      const url =pw? `/api/code/${id}?pw=${pw}` : `/api/code/${id}`; // 如果有密码，则将密码添加到 URL 中
      const response = await axios.get(url);
      setSnippetData(response.data); // 设置返回的数据
    } catch (err) {
      console.error('获取数据失败:', err);
      navigate('/'); 
    }
  };
  useEffect(() => {
    fetchData(id, pw); // 组件挂载时加载数据
  }, [id, pw]); // 当 id 或 pw 变化时重新加载数据


  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('复制成功');
    // 这里可以加入 Toast 提示复制成功
  };




  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'}`}>
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex">
          <LeftIcons item={snippetData} fetchData={fetchData} />
          {snippetData && (
            <SnippetCard
              snippetData={snippetData}
              handleCopy={handleCopy}
              fetchData={fetchData}
            />
          )}
        </div>
      </main>
    </div>
  );
}
