import React, { useState, useEffect } from 'react';
import { Button, Input, Popover, message, Tooltip, Tag, DatePicker, Space, Select } from 'antd';
import { CopyOutlined, QrcodeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

interface ShareCardProps {
  id: string;
  isPublic: boolean;
  password: string | null;
  expiration: string | null;
}

const ShareCard: React.FC<ShareCardProps> = ({ id, isPublic, password, expiration }) => {
  const [inputValue, setInputValue] = useState(id);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(password);
  const [expireAt, setExpireAt] = useState<any>(expiration ? dayjs(expiration) : null); // 使用 day.js 处理过期时间
  const [shareStatus, setShareStatus] = useState(isPublic ? 'public' : 'private'); // 默认分享状态

  // 生成密码的处理函数
  const generatePassword = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(result);
  };

  // 更新分享范围
  const handleShareStatusChange = (value: string) => {
    setShareStatus(value);
    const newIsPublic = value === 'public'; // 判断是否公开

    // 假设这是你的后端 API
    axios.post('/api/update-share-status', { id, isPublic: newIsPublic })
      .then(response => {
        message.success('分享状态已更新');
      })
      .catch(error => {
        message.error('更新分享状态失败');
      });
  };

  // 快捷选择过期时间
  const quickDates = [
    { label: '今天', value: dayjs().endOf('day') },
    { label: '15分钟', value: dayjs().add(15, 'minute') },
    { label: '1小时', value: dayjs().add(1, 'hour') },
    { label: '6小时', value: dayjs().add(6, 'hour') },
    { label: '1天', value: dayjs().add(1, 'day') },
    { label: '1周', value: dayjs().add(1, 'week') },
    { label: '1月', value: dayjs().add(1, 'month') },
  ];

  // 复制 ID 的处理函数
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    navigator.clipboard.writeText(inputValue)
      .then(() => {
        message.success('ID 已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请重试');
      });
  };

  // 假设二维码内容就是 ID
  const qrCodeContent = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(inputValue)}&size=100x100`;

  return (
    <div className='flex flex-col  gap-2 m-5' >
      <div>

        <Input
          value={`http://localhost:3000/code/${id}?pw=${generatedPassword || ''}`}
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
  overlayStyle={{ maxWidth: '128px' }}  // 设置弹出层的最大宽度
>
  <Button
    icon={<QrcodeOutlined />}
    type="text"
    onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
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
          <div className="flex  justify-between items-center space-x-2">
            <strong className="flex-shrink-0">密码：</strong>
            <Input
              readOnly
              value={generatedPassword || '无'} // 如果没有密码则显示 '无'
              className='w-20'


            />
            {/* 只有在没有生成密码时显示 '生成密码' 按钮 */}
            {!generatedPassword && (
              <Button type="link" onClick={generatePassword}>
                生成密码
              </Button>
            )}
          </div>
        </>
      )}

      {/* 过期时间设置 */}
      <div className="flex justify-between  items-center space-x-2" onClick={(e) => e.stopPropagation()}>
        <strong className="flex-shrink-0">过期时间：</strong>
        <DatePicker
          showTime
          value={expireAt}
          placeholder="选择过期时间"
          onChange={(date) => setExpireAt(date)}
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
                      setExpireAt(quickDate.value);
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
