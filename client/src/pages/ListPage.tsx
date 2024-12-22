import React, { useState, useEffect } from "react";
import { Divider, Button } from "antd";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Header from "../components/Header";
import CodeCard from "../components/CodeCard";
import axios from "axios"; 
import ThemeSwitcher from "../components/ThemeSwitcher"; 
import { useTheme } from "../components/ThemeProvider"; 


interface Snippet {
  key: string;
  language: string;
  title: string;
  code: string;
}

interface CodeItem {
  id: string;
  title: string;
  snippets: Snippet[];
  tags: string[];
  create_at: string;
  expire_at: string | null; 
  markdown: string;
  isPublic: boolean;
  password: string | null; 
}

export default function CodeList() {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [shareRange, setShareRange] = useState("all");
  const [language, setLanguage] = useState("all");
  const [codeData, setCodeData] = useState<CodeItem[]>([]); // 存储从后端获取的数据

  // 获取数据函数
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/list"); 
      setCodeData(response.data); 
      console.log("获取数据成功!");
    } catch (err) {
 
    } finally {

    }
  };

  // 在组件加载时获取数据
  useEffect(() => {
    fetchData();
  }, []); // 组件加载时发起请求

  // 过滤数据
  const filteredData = codeData.filter((item: CodeItem) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.snippets.some((snippet) =>
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesShareRange =
      shareRange === "all" ||
      (shareRange === "public" && item.isPublic) ||
      (shareRange === "private" && !item.isPublic);
    const matchesLanguage =
      language === "all" ||
      item.snippets.some((snippet) => snippet.language === language);

    return matchesSearch && matchesShareRange && matchesLanguage;
  });




  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'}`}>
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <ThemeSwitcher />
            <SearchBar setSearchTerm={setSearchTerm} />
          </div>
          <Divider className="mb-4" />
          <div className="flex justify-end mb-4">
            <Filters
              shareRange={shareRange}
              setShareRange={setShareRange}
              language={language}
              setLanguage={setLanguage}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item) => (
              <CodeCard key={item.id} 
              item={item} fetchData={fetchData}

               />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
