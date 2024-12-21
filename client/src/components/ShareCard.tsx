import React, { useState, useEffect } from "react";
import {  Button,  Input,  Popover,  message,  Tooltip,  Select,  DatePicker,  Space,} from "antd";
import { CopyOutlined, QrcodeOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

interface ShareCardProps {
  id: string;
  isPublic: boolean;
  password: string | null;
  expire_at: string | null;
  fetchData: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({
  id,
  isPublic,
  password,
  expire_at,
  fetchData,
}) => {
  const [inputValue, setInputValue] = useState(id);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(password|| null);
  const [expireAt, setExpireAt] = useState<any>(
    expire_at ? dayjs(expire_at) : null
  ); // 使用 day.js 处理过期时间
  const [shareStatus, setShareStatus] = useState(
    isPublic ? "public" : "private"
  ); // 默认分享状态

  // 生成密码的处理函数
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 更新分享范围
  const handleShareStatusChange = async (value: string) => {
    const newShareStatus = value === "public"; // 根据选择的值更新分享状态
    setShareStatus(value);
    try {
      if (newShareStatus) {
        // 加密，带上当前密码
        console.log("当前加密，带上当前密码");
        console.log("当前密码", generatedPassword);
        const response = await axios.patch(`/api/updatePublic/${id}`, {
          isPublic: !newShareStatus,
          password: generatedPassword, // 传递当前密码
        });

        if (response.data.success) {
          alert("取消加密成功");
          fetchData();
        }
      } else {
        // newExpireAt
        const newPassword = generatePassword(); // 生成新密码
        const response = await axios.patch(`/api/updatePublic/${id}`, {
          isPublic: !newShareStatus,
          password: newPassword, // 提交新密码
        });
        if (response.data.success) {
          setGeneratedPassword(newPassword); // 更新密码状态
          alert("加密成功");
          fetchData();
        }
      }
    } catch (error) {
      alert("加密失败");
      console.error(error);
    }
  };

  // 快捷选择过期时间
  const quickDates = [
    { label: "今天", value: dayjs().endOf("day") },
    { label: "15分钟", value: dayjs().add(15, "minute") },
    { label: "1小时", value: dayjs().add(1, "hour") },
    { label: "6小时", value: dayjs().add(6, "hour") },
    { label: "1天", value: dayjs().add(1, "day") },
    { label: "1周", value: dayjs().add(1, "week") },
    { label: "1月", value: dayjs().add(1, "month") },
  ];

  // 复制 ID 的处理函数
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    navigator.clipboard
      .writeText(inputValue)
      .then(() => {
        message.success("ID 已复制到剪贴板");
      })
      .catch(() => {
        message.error("复制失败，请重试");
      });
  };

  // 假设二维码内容就是 ID
  const qrCodeContent = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    inputValue
  )}&size=100x100`;

  // 提交过期时间
  const handleExpireTimeChange = async (id: string, password: string| null, newExpireAt: any| null) => {
    if (!newExpireAt) {
      newExpireAt = null;  // 或者传递一个特定值，比如 `null` 表示永久有效
    }
    setExpireAt(newExpireAt); // 更新本地状态
    // 格式化日期，确保发送的是正确的格式
    const formattedExpireAt = newExpireAt
      ? dayjs(newExpireAt).format("YYYY-MM-DD HH:mm:ss") 
      : null; // 如果没有过期时间，设置为 null
    console.log("password", password);
    console.log("formattedExpireAt", formattedExpireAt);
    try {
      const response = await axios.patch(`/api/updateExpiration/${id}`, {
        password,
        expire_at: formattedExpireAt, // 使用格式化的日期
      });
  
      if (response.data.success) {
        message.success("过期时间已更新");
        fetchData(); // 重新加载数据
      } else {
        message.error("更新过期时间失败");
      }
    } catch (error) {
      console.error("更新过期时间失败", error);
      message.error("更新过期时间失败");
    }
  };
  return (
    <div className="flex flex-col gap-2 m-5">
      <div>
        <Input
          value={`http://localhost:3000/code/${id}${
            generatedPassword ? `?pw=${generatedPassword}` : ""
          }`}
          readOnly
          style={{ width: 250 }}
        />
        <Tooltip title="复制链接">
          <Button
            icon={<CopyOutlined />}
            type="text"
            onClick={copyToClipboard}
          />
        </Tooltip>
        <Popover
          content={<img src={qrCodeContent} className="w-32 h-auto" />} // 使用 Tailwind 设置宽度
          title={<></>}
          trigger="hover"
          placement="left"
          overlayStyle={{ maxWidth: "128px" }} // 设置弹出层的最大宽度
        >
          <Button
            icon={<QrcodeOutlined />}
            type="text"
            // onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
          />
        </Popover>
      </div>

      <div className="flex justify-between items-center space-x-2">
        <strong className="flex-shrink-0">分享范围：</strong>
        <Select
          value={shareStatus}
          onChange={handleShareStatusChange}
          style={{ width: 100 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Select.Option value="public">公开</Select.Option>
          <Select.Option value="private">加密</Select.Option>
        </Select>
      </div>

      {/* 加密状态时显示密码 */}
      {!isPublic && (
        <>
          <div className="flex justify-between items-center space-x-2">
            <strong className="flex-shrink-0">密码：</strong>
            <Input
              readOnly
              value={generatedPassword || "无"} // 如果没有密码则显示 '无'
              className="w-24"
            />
            {/* 只有在没有生成密码时显示 '生成密码' 按钮 */}
            {!generatedPassword && (
              <Button
                type="link"
                onClick={() => {
                  const newPassword = generatePassword();
                  setGeneratedPassword(newPassword); // 更新本地密码
                }}
              >
                生成密码
              </Button>
            )}
          </div>
        </>
      )}

      {/* 过期时间设置 */}
      <div
        className="flex justify-between items-center space-x-2"
        onClick={(e) => e.stopPropagation()}
      >
        <strong className="flex-shrink-0">过期时间：</strong>
        <DatePicker
          showTime
          value={expireAt}
          placeholder={expire_at ? "选择过期时间" : "不填, 永久有效"}
          onChange={(date, dateString) =>{
            handleExpireTimeChange(id, generatedPassword, date)
          }
      
          } // 使用箭头函数来延迟调用
          onClick={(e) => e.stopPropagation()}
          renderExtraFooter={() => (
            <div>
              <Space className="flex justify-between">
                {quickDates.map((quickDate) => (
                  <Button
                    className="border-none rounded-none"
                    key={quickDate.label}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      // 更新过期时间为快捷选择的时间
                      handleExpireTimeChange(
                        id,
                        generatedPassword,
                        quickDate.value
                      );
                    }}
                  >
                    {quickDate.label}
                  </Button>
                ))}
              </Space>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ShareCard;
