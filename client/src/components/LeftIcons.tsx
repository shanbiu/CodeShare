import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { DownloadOutlined, BulbOutlined,ShareAltOutlined } from '@ant-design/icons';
import { useTheme } from './ThemeProvider'; // 假设你的主题管理钩子是 useTheme
import SharePopover from './SharePopover'; // 引入 SharePopover 组件
import axios from 'axios';

interface LeftIconsProps {
  item: any; // 从父组件传入的 item 数据
  fetchData: (id?: string, password?: string) => void; // 从父组件传入的刷新数据的函数
}

const LeftIcons: React.FC<LeftIconsProps> = ({ item, fetchData }) => {
  const { toggleTheme } = useTheme(); // 获取切换主题的函数

  const handleDownload = async () => {
    try {
      // 假设 password 从父组件传递给 LeftIcons
      const params = item.password ? { pw: item.password } : {}; // 如果有密码，作为查询参数传递
      const response = await axios.get(`/api/download/${item.id}`, { params, responseType: 'blob' });

      const file = new Blob([response.data], { type: response.headers['content-type'] });
      const url = URL.createObjectURL(file);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.id}.zip`; // 设置下载文件的名称
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败', error);
      alert('下载失败，请稍后重试');
    }
  };

  return (
    <div className="w-16 mr-4 space-y-4">
      {/* 使用传入的 item 和 fetchData */}
      {item && (
        <SharePopover
          item={item}
          fetchData={fetchData}  // 传递刷新数据的函数
          children={
            <Button
              icon={<ShareAltOutlined />}
              shape="circle"
              size="large"
              title="分享"
            />
          }
        />
      )}
      
      {/* 下载按钮 */}
      <Button
        icon={<DownloadOutlined />}
        shape="circle"
        size="large"
        onClick={handleDownload}
        title="下载代码"
      />
      
      {/* 切换主题按钮 */}
      <Button
        icon={<BulbOutlined />}
        shape="circle"
        size="large"
        onClick={toggleTheme}
        title="切换主题"
      />
    </div>
  );
};

export default LeftIcons;
