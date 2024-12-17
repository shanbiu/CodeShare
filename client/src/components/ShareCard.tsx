import React, { useState } from 'react';
import { Button, Input, Popover, message, Tooltip } from 'antd';
import { CopyOutlined, QrcodeOutlined } from '@ant-design/icons';

interface ShareCardProps {
  id: string;
  isPublic: boolean;
  password: string | null;
  expiration: string | null;
}

const ShareCard: React.FC<ShareCardProps> = ({ id, isPublic, password, expiration }) => {
  const [inputValue] = useState(id);

  // 复制 ID 的处理函数
  const copyToClipboard = () => {
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
    <div>
      <div>
        <strong>ID：</strong>
        <Input
          value={inputValue}
          readOnly
          style={{ width: 250 }}
          suffix={
            <div className="flex items-center space-x-2">
              
            </div>
          }
          />
          <Tooltip title="复制 ID">
                <Button
                  icon={<CopyOutlined />}
                  type="text"
                  onClick={copyToClipboard}
                />
              </Tooltip>
              <Popover content={<img src={qrCodeContent} alt="二维码" />} title="二维码" trigger="hover">
                <Button icon={<QrcodeOutlined />} type="text" />
              </Popover>
      </div>

      <div>
        <strong>分享状态：</strong> {isPublic ? '公开' : '加密'}
      </div>

      {!isPublic && password && (
        <div>
          <strong>密码：</strong> {password}
        </div>
      )}

      <div>
        <strong>过期时间：</strong> {expiration ? expiration : '永久'}
      </div>
    </div>
  );
};

export default ShareCard;
