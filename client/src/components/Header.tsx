import React from "react";
import { Layout, theme } from "antd";
import {
  CodeOutlined,
  UnorderedListOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom"; // 使用 NavLink 组件

const { Header: AntdHeader } = Layout;

export default function Header() {
  const { token } = theme.useToken();

  return (
    <AntdHeader
      style={{ background: token.colorBgContainer }}
      className="flex items-center justify-between px-4"
    >
      <div className="text-2xl font-bold">代码分享</div>
      <div className="flex space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "bg-blue-500 text-white py-2 px-4 rounded" : "py-2 px-4 "
          }
        >
          <CodeOutlined /> 创建
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            isActive ? "bg-blue-500 text-white py-2 px-4 rounded" : "py-2 px-4 "
          }
        >
          <UnorderedListOutlined /> 列表
        </NavLink>

        {/* 分享按钮没有路由，仍然可以用 div 或 Link */}
        <div className=" py-2 px-4 rounded cursor-pointer">
          <ShareAltOutlined /> 分享
        </div>
      </div>
    </AntdHeader>
  );
}
