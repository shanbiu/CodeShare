import React from 'react';
import { Tag } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

interface CodeTagsProps {
  isPublic: boolean;
  tags: string[];
}

const CodeTags: React.FC<CodeTagsProps> = ({ isPublic, tags }) => {
  return (
    <div className="flex space-x-2">
      <Tag color={isPublic ? 'success' : 'error'}>
        {isPublic ? <UnlockOutlined className="mr-1" /> : <LockOutlined className="mr-1" />}
        {isPublic ? '公开' : '加密'}
      </Tag>
      {/* 使用 tags 来显示标签 */}
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
};

export default CodeTags;
