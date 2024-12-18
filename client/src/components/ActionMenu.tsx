import React from 'react';
import { Dropdown, Menu } from 'antd';
import { LockOutlined, UnlockOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';

// 定义 ActionMenu 的 props 类型
interface ActionMenuProps {
  isPublic: boolean;
  handleMenuClick: (key: string) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ isPublic, handleMenuClick }) => {
  const menuItems = [
    {
      key: 'toggleEncryption',
      icon: isPublic ? <LockOutlined /> : <UnlockOutlined />,
      label: isPublic ? '加密' : '取消加密',
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
    },
  ];

  return (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => handleMenuClick(key)}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {/* 使用CSS类来旋转图标 */}
        <EllipsisOutlined className="text-xl cursor-pointer rotate-90" />
      </a>
    </Dropdown>
  );
};

export default ActionMenu;
