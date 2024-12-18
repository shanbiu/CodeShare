import React, { useState } from 'react';
import Header from "../components/Header";
import mockData from '../components/mockData.json';
import LeftIcons from '../components/LeftIcons';
import SnippetCard from '../components/SnippetCard'; // 引入 SnippetCard
import { useTheme } from '../components/ThemeProvider'; // 引入 useTheme 钩子

export default function DetailPage() {
  const { isDarkMode } = useTheme(); // 获取当前的主题状态
  const [snippetData, setSnippetData] = useState(mockData[0]); // 使用第一个示例数据

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    // 这里可以加入 Toast 提示复制成功
  };

  const handleMenuClick = (action: string) => {
    console.log(action);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'}`}>
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex">
          <LeftIcons />
          <SnippetCard
            snippetData={snippetData}
            handleCopy={handleCopy}
            handleMenuClick={handleMenuClick}
          />
        </div>
      </main>
    </div>
  );
}
