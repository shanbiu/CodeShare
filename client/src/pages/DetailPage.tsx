import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import LeftIcons from '../components/LeftIcons';
import SnippetCard from '../components/SnippetCard'; 
import { useTheme } from '../components/ThemeProvider'; 
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function DetailPage() {
  const { isDarkMode } = useTheme(); // 获取当前的主题状态
  const { id } = useParams(); 
  const location = useLocation(); 
  const [snippetData, setSnippetData] = useState(null); // 初始数据为空
  const navigate = useNavigate(); 

  // 从 URL 查询字符串中获取 pw 参数
  const queryParams = new URLSearchParams(location.search);
  const pw = queryParams.get('pw'); 

  const fetchData = async (id, pw) => {
    try {
      const path =pw? `/code/${id}?pw=${pw}` : `/code/${id}`;
      // console.log("页面跳转",path)
      navigate(path);
      const url =pw? `/api/code/${id}?pw=${pw}` : `/api/code/${id}`; 
      const response = await axios.get(url);
      setSnippetData(response.data); // 设置返回的数据
    } catch (err) {
      navigate('/'); 
    }
  };
  useEffect(() => {
    fetchData(id, pw); 
  }, [id, pw]); // 当 id 或 pw 变化时重新加载数据


  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('复制成功');
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
