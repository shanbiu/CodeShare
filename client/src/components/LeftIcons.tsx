import React from 'react';
import { Button } from 'antd';
import { ShareAltOutlined, DownloadOutlined, BulbOutlined } from '@ant-design/icons';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from './ThemeProvider'; // 假设你的主题管理钩子是 useTheme


interface LeftIconsProps {
  id: string; // 假设 id 作为参数传递给组件
  password?: string; // 如果是加密数据，传递密码（可选）
}

const LeftIcons: React.FC<LeftIconsProps> = () => {
  const { toggleTheme } = useTheme(); // 获取切换主题的函数
  const { id } = useParams<{ id: string }>(); // 从路由参数中获取 id
  console.log(id);
  const location = useLocation(); // 获取当前路由的信息
  // 从 URL 查询参数中获取密码
  const params = new URLSearchParams(location.search);
  const password = params.get('pw'); // 获取密码，可能为空
  // 下载按钮的点击处理
  const handleDownload = async () => {
    try {
      const params = password ? { pw: password } : {}; // 如果有密码，作为查询参数传递
      // 向后端请求下载数据
      const response = await axios.get(`/api/download/${id}`, { params, responseType: 'blob' });

      // 创建 Blob 对象，触发文件下载
      const file = new Blob([response.data], { type: response.headers['content-type'] });

      // 创建一个临时的 URL 对象
      const url = URL.createObjectURL(file);

      // 创建一个 <a> 标签，模拟点击下载
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.zip`;  // 设置下载文件的名称
      document.body.appendChild(a); // 将 <a> 标签添加到文档中
      a.click();  // 模拟点击
      document.body.removeChild(a); // 下载后移除 <a> 标签

      // 释放 Blob 对象
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('下载失败', error);
      alert('下载失败，请稍后重试');
    }
  };

  return (
    <div className="w-16 mr-4 space-y-4">
      <Button icon={<ShareAltOutlined />} shape="circle" size="large" />
      {/* 下载按钮 */}
      <Button
        icon={<DownloadOutlined />}
        shape="circle"
        size="large"
        onClick={handleDownload}  // 点击下载按钮触发下载
        title="下载代码"
      />
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
