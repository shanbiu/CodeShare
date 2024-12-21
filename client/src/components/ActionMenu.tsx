import React, { useState } from "react";
import { Dropdown, Menu, Modal, Input, Button, Space } from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 使用 React Router 进行跳转
import axios from "axios"; // 这里使用 axios 发送请求
import randomPassword from "./randomPassword";

// 定义 ActionMenu 的 props 类型
interface ActionMenuProps {
  isPublic: boolean;
  id: string; // 传递当前数据的 ID
  password: string | null; // 获取到的密码（加密时使用）
  fetchData: () => void; // 父组件传递过来的刷新数据函数
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  isPublic,
  id,
  password,
  fetchData,
}) => {
  const navigate = useNavigate(); // 用于跳转
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // 控制删除弹窗的显示
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制加密/取消加密弹窗显示
  const [newPassword, setNewPassword] = useState<string>(""); // 控制加密时生成的密码
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 控制密码可见性

  // 设置菜单项
  const menuItems = [
    {
      key: "toggleEncryption",
      icon: isPublic ? <LockOutlined /> : <UnlockOutlined />,
      label: isPublic ? "加密" : "取消加密",
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "编辑",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "删除",
    },
  ];

  // 处理菜单项点击
  const handleActionClick = async (key: string) => {
    switch (key) {
      case "toggleEncryption":
        setIsModalVisible(true); // 打开加密/取消加密弹窗
        break;

      case "delete":
        // 显示删除确认弹窗
        setIsDeleteModalVisible(true);
        break;

      case "edit":
        if (password) {
          navigate(`/edit/${id}?pw=${password}`);
        } else {
          navigate(`/edit/${id}`);
        }
        break;

      default:
        break;
    }
  };

  // 生成随机密码的函数
  const generateRandomPassword = () => {
    const result = randomPassword();
    setNewPassword(result);
  };

  // 提交加密/取消加密
  const handleToggleEncryption = async () => {
    try {
      if (!isPublic) {
        // 加密，带上当前密码
        const response = await axios.patch(`/api/updatePublic/${id}`, {
          isPublic: isPublic,
          password: password, // 需要传递原密码
        });
        if (response.data.success) {
          alert("取消加密成功");
          
        }
      } else {
        // 加密请求，提交新生成的密码
        if (!newPassword) {
          alert("请设置一个密码");
          return;
        }
        const response = await axios.patch(`/api/updatePublic/${id}`, {
          isPublic: isPublic,
          password: newPassword, // 提交新密码
        });
        if (response.data.success) {
          alert("加密成功");
        }
      }
      setIsModalVisible(false); // 关闭弹窗
      // 刷新当前页面
      fetchData();


    } catch (error) {
      alert("操作失败");
      console.error(error);
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
          alert("删除成功");
          setIsDeleteModalVisible(false); // 关闭弹窗
          fetchData(); // 调用父组件的刷新数据函数
        }
      } catch (error) {
        alert("删除失败");
        console.error(error);
        setIsDeleteModalVisible(false); // 关闭弹窗
      }
    } else {
      // 如果需要密码验证，带上密码发送请求
      try {
        const response = await axios.delete(`/api/delect/${id}?pw=${password}`);
        if (response.data.success) {
          alert("删除成功");
          setIsDeleteModalVisible(false); // 关闭弹窗
          fetchData(); // 调用父组件的刷新数据函数
        }
      } catch (error) {
        alert("密码错误，删除失败");
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

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <button onClick={(e) => e.stopPropagation()}>
      <Dropdown
        menu={{
          items: menuItems, // 传递菜单项
          onClick: ({ key }) => handleActionClick(key), // 处理菜单项点击事件
        }}
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <EllipsisOutlined className="text-xl cursor-pointer rotate-90" />
        </a>
      </Dropdown>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }} // 确认按钮为危险按钮
      >
        <p>是否确认删除？该操作不可找回。</p>
      </Modal>

      {/* 加密/取消加密弹窗 */}
      <Modal
        title={isPublic ? "加密" : "取消加密"}
        open={isModalVisible}
        onOk={handleToggleEncryption}
        onCancel={() => setIsModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        {isPublic ? (
          <>
            <Input
              type={isPasswordVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="请输入密码"
              suffix={
                <Button
                  icon={
                    isPasswordVisible ? (
                      <EyeInvisibleOutlined />
                    ) : (
                      <EyeOutlined />
                    )
                  }
                  onClick={togglePasswordVisibility}
                  type="text"
                />
              }
            />
            <Button type="link" onClick={generateRandomPassword}>
              生成随机密码
            </Button>
          </>
        ) : (
          <div>
            <UnlockOutlined style={{ marginRight: 10 }} />
            <span>确认取消加密，该操作将公开数据。</span>
          </div>
        )}
      </Modal>
    </button>
  );
};

export default ActionMenu;
