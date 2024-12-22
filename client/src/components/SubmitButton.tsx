import React, { useState, useEffect } from "react";
import { Button, Space, Input } from "antd";
import { UnlockOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UniqueCode from "./createUniqueCode";

interface SubmitButtonsProps {
  isPublic: boolean; // 当前是否为公开状态
  password: string; // 当前密码
  onIsPublicChange: (isPublic: boolean) => void; // 用来更新父组件的公开/加密状态
  onPasswordChange: (password: string) => void; // 用来更新父组件的密码
  onSubmit: () => void; // 提交数据的函数
  id: string; // 文档id
  isEditMode: boolean; // 是否为编辑模式
  queryPassword: string | null; // 从 URL 获取的密码参数
}

export function SubmitButtons({
  isPublic,
  password,
  onIsPublicChange,
  onPasswordChange,
  onSubmit,
  id,
  isEditMode,
  queryPassword,
}: SubmitButtonsProps) {
  const [generatedPassword, setGeneratedPassword] = useState<string>(password); // 管理生成的密码
  const [storedPassword, setStoredPassword] = useState<string>(""); // 暂存密码
  const navigate = useNavigate();

  // 生成密码的函数
  const generatePassword = () => {
    const result = UniqueCode();
    onPasswordChange(result);
    setGeneratedPassword(result);
    setStoredPassword(result); // 暂存密码也更新

  };

  // 提交处理函数
  const handleSubmit = () => {
    onSubmit(); // 调用父组件的提交函数

    // 构建目标 URL，检查是否有密码，如果有密码则添加 `?pw=password`
    let url = isEditMode ? `/code/${id}` : `/code/${id}`; // 编辑模式下的 URL
    if (!isPublic && generatedPassword) {
      url += `?pw=${generatedPassword}`;
    }

    navigate(url); // 跳转到目标页面
  };

  // 监听公开/加密状态变化，动态生成密码
  useEffect(() => {
    if (isEditMode) {
      // 编辑模式时，如果有密码参数，则使用密码参数
      if (queryPassword) {
        setGeneratedPassword(queryPassword);
      }
    } else {
      // 默认状态
      if (!isPublic) {
        // 从公开到加密时生成新密码，如果没有暂存密码
        if (!storedPassword) {
          generatePassword();
        } else {
          setGeneratedPassword(storedPassword); // 使用暂存的密码
        }
      } else {
        // 从加密到公开时清空密码
        setGeneratedPassword("");
        
      }
    }
  }, [isPublic, isEditMode, queryPassword, storedPassword]); // 依赖项：isPublic, isEditMode, queryPassword, storedPassword

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
          {isEditMode ? "更新" : "提交"} {/* 编辑模式下显示 "更新" */}
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
