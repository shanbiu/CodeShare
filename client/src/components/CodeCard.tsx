import React from 'react';
import { Card} from 'antd';
import {  LockOutlined, UnlockOutlined } from '@ant-design/icons';
import Editor from "@monaco-editor/react";
import { useTheme } from './ThemeProvider'; 
import ActionMenu from './ActionMenu'; 
import CodeTags from './CodeTags'; 
import { useNavigate } from 'react-router-dom'; 
import SharePopover from './SharePopover';  
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
    password: string | null; 
    expire_at: string | null; 
    
  };  
  fetchData: () => void;  

}

export default function CodeCard({ item, fetchData }: CodeCardProps) {
  const { isPublic } = item;
  const { isDarkMode } = useTheme(); 
  const navigate = useNavigate();

  // 设置 Monaco Editor 主题
  const editorTheme = isDarkMode ? 'vs-dark' : 'vs';

  // 跳转到代码详情页面
  const handleCardClick = () => {

    if (item.password) {
      navigate(`/code/${item.id}?pw=${item.password}`);
    } else {
      navigate(`/code/${item.id}`);
    }
  };

  return (
    <Card
      className="w-full shadow-md cursor-pointer" 
      title={
        <div>
          <div className="flex items-center mt-3">
            <span className="text-lg font-bold">{item.title}
              {item.isPublic ? (
                <UnlockOutlined style={{ marginLeft: 8, color: 'green' }} />
              ) : (
                <LockOutlined style={{ marginLeft: 8, color: 'red' }} />
              )}
            </span>

          </div>
          <div className="text-normal text-gray-500 font-thin  mb-2">
            创建于 {new Date(item.create_at).toLocaleString('zh-CN', { hour12: false })}
          </div>
        </div>

      }
      extra={
        <ActionMenu
          isPublic={isPublic}
          id={item.id}
          password={item.password}
          fetchData={fetchData}
        />
      }

    onClick={handleCardClick} // 点击卡片跳转到详情页面
    >

      <div className="h-48 mb-4" onClick={handleCardClick}>
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
        <button onClick={(e)=> e.stopPropagation()}>
        <SharePopover  
        item={item}
        fetchData={fetchData}
        />
        </button>
        
      </div>
    </Card>
  );
}
