import React from 'react';
import { Button } from 'antd';
import { ShareAltOutlined, DownloadOutlined, BulbOutlined } from '@ant-design/icons';
import { useTheme } from './ThemeProvider'; // 假设你的主题管理钩子是 useTheme

const LeftIcons: React.FC = () => {
  const { toggleTheme } = useTheme(); // 获取切换主题的函数

  return (
    <div className="w-16 mr-4 space-y-4">
      <Button icon={<ShareAltOutlined />} shape="circle" size="large" />
      <Button icon={<DownloadOutlined />} shape="circle" size="large" />
      {/* 添加主题切换按钮 */}
      <Button 
        icon={<BulbOutlined />} 
        shape="circle" 
        size="large" 
        onClick={toggleTheme} // 切换主题
        title="切换主题"
      />
    </div>
  );
};

export default LeftIcons;
