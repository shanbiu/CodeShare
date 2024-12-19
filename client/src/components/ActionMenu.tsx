import React, { useState } from 'react';
import { Dropdown, Menu, Modal } from 'antd';
import { LockOutlined, UnlockOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // 使用 React Router 进行跳转
import axios from 'axios'; // 这里使用 axios 发送请求

// 定义 ActionMenu 的 props 类型
interface ActionMenuProps {
  isPublic: boolean;
  id: string; // 传递当前数据的 ID
  password: string | null;  // 获取到的密码（加密时使用）
  fetchData: () => void; // 父组件传递过来的刷新数据函数
}

const ActionMenu: React.FC<ActionMenuProps> = ({ isPublic, id, password, fetchData }) => {
  const navigate = useNavigate(); // 用于跳转
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // 控制删除弹窗的显示

  // 设置菜单项
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

  // 处理菜单项点击
  const handleActionClick = async (key: string) => {
    switch (key) {
      case 'toggleEncryption':
        try {
          const response = await axios.patch(`/api/code_shares/${id}/privacy`, {
            isPublic: !isPublic,
          });
          if (response.data.success) {
            alert('加密状态更新成功');
          }
        } catch (error) {
          alert('更新加密状态失败');
          console.error(error);
        }
        break;

      case 'delete':
        // 显示删除确认弹窗
        setIsDeleteModalVisible(true);
        break;

      case 'edit':
        // 跳转到编辑页面
        navigate(`/edit/${id}`);
        break;

      default:
        break;
    }
  };

  // 确认删除
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    // 判断是否需要密码进行验证（如果是加密的）
    if (isPublic || !password) {
      // 公开或者没有密码，直接删除
      try {
        const response = await axios.delete(`/api/delete/${id}`);
        if (response.data.success) {
          alert('删除成功');
          setIsDeleteModalVisible(false); // 关闭弹窗
          fetchData(); // 调用父组件的刷新数据函数
        }
      } catch (error) {
        alert('删除失败');
        console.error(error);
        setIsDeleteModalVisible(false); // 关闭弹窗
      }
    } else {
      // 如果需要密码验证，带上密码发送请求
      try {
        const response = await axios.delete(`/api/delect/${id}?pw=${password}`);
        if (response.data.success) {
          alert('删除成功');
          setIsDeleteModalVisible(false); // 关闭弹窗
          fetchData(); // 调用父组件的刷新数据函数
        }
      } catch (error) {
        alert('密码错误，删除失败');
        console.error(error);
        setIsDeleteModalVisible(false); // 关闭弹窗
      }
    }
  };

  // 取消删除
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsDeleteModalVisible(false); // 关闭弹窗
  };

  return (
    <>
      <Dropdown
        overlay={
          <Menu
            items={menuItems}
            onClick={({ key }) => handleActionClick(key)} // 改为传递 key
          />
        }
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <EllipsisOutlined className="text-xl cursor-pointer rotate-90" />
        </a>
      </Dropdown>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }} // 确认按钮为危险按钮
      >
        <p>是否确认删除？该操作不可找回。</p>
      </Modal>
    </>
  );
};

export default ActionMenu;
