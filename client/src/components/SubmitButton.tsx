// SubmitButtons.tsx
import React, { useState, useEffect } from "react";
import { Button, Space, Input } from "antd";
import { UnlockOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface SubmitButtonsProps {
  isPublic: boolean; // 当前是否为公开状态
  password: string; // 当前密码
  onIsPublicChange: (isPublic: boolean) => void; // 用来更新父组件的公开/加密状态
  onPasswordChange: (password: string) => void; // 用来更新父组件的密码
  onSubmit: () => void; // 提交数据的函数
}

export function SubmitButtons({
  isPublic,
  password,
  onIsPublicChange,
  onPasswordChange,
  onSubmit,
}: SubmitButtonsProps) {
  const [generatedPassword, setGeneratedPassword] = useState(password); // 管理生成的密码
  const navigate = useNavigate();

  // 生成密码的函数
  useState(() => {
    if (isPublic) {
      setGeneratedPassword("");
    }
    else{
      generatePassword();
    }
  }),[isPublic]

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onPasswordChange(result); 
    setGeneratedPassword(result);
  };

  // 提交处理函数
  const handleSubmit = () => {
    onSubmit(); // 调用父组件的提交函数
    // navigate("/code:key"); // 跳转到其他页面
  };

  // 监听公开/加密状态变化，动态生成密码
  useEffect(() => {
    if (!isPublic) {
      generatePassword();
    } else {
      setGeneratedPassword(""); // 如果是公开状态，则清空密码
    }
  }, [isPublic]);

  return (
    <div className="h-28">
      <div className="flex justify-between items-center py-4">
        <Space.Compact>
          <Button
            type={isPublic ? "primary" : "default"}
            icon={<UnlockOutlined />}
            onClick={() => onIsPublicChange(true)} // 触发父组件更新公开状态
          >
            公开
          </Button>
          <Button
            type={!isPublic ? "primary" : "default"}
            icon={<LockOutlined />}
            onClick={() => onIsPublicChange(false)} // 触发父组件更新加密状态
          >
            加密
          </Button>
        </Space.Compact>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </div>

      <div>
        {!isPublic && (
          <div className="mb-4">
            <Input
              value={generatedPassword}
              onChange={(e) => setGeneratedPassword(e.target.value)}
              placeholder="4-8 位字符密码"
              style={{ width: 150 }}
              minLength={4}
              maxLength={8}
            />
            <Button onClick={generatePassword} className="ml-2">
              生成密码
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
