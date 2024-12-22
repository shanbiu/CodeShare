import React, { useState, useRef, useEffect } from 'react';
import { Tag } from 'antd';
import { LockOutlined, UnlockOutlined, PlusOutlined } from '@ant-design/icons';

interface CodeTagsProps {
  isPublic: boolean;
  tags: string[];
}

const CodeTags: React.FC<CodeTagsProps> = ({ isPublic, tags }) => {
  const containerRef = useRef<HTMLDivElement>(null); 
  const [visibleTags, setVisibleTags] = useState<string[]>([]); 
  const [hiddenTagsCount, setHiddenTagsCount] = useState<number>(0); // 隐藏的标签数量

  // 假设标签宽度大约是这个值，单位是 px（包含 padding 和 border 等）
  const tagWidth = 80;

  useEffect(() => {
    const updateVisibleTags = () => {
      if (containerRef.current) {
        // 获取宽度
        const parentWidth = containerRef.current.parentElement?.offsetWidth; 

        if (parentWidth) {
          const maxTags = Math.floor((parentWidth -140) / tagWidth); 

          // 根据最大可显示数量设置 visibleTags 和 hiddenTagsCount
          const visible = tags.slice(0, maxTags); 
          const hiddenCount = tags.length - maxTags; 

          setVisibleTags(visible);
          setHiddenTagsCount(hiddenCount);
        }
      }
    };

    // 初次加载和窗口大小变化时更新标签显示
    updateVisibleTags();
    window.addEventListener('resize', updateVisibleTags); // 监听窗口大小变化
    return () => {
      window.removeEventListener('resize', updateVisibleTags);
    };
  }, [tags]);

  return (
    <div ref={containerRef} className="flex items-center space-x-2 max-w-[80%] overflow-hidden whitespace-nowrap">
      {/* 显示公开或加密标签 */}
      <Tag color={isPublic ? 'success' : 'error'}>
        {isPublic ? <UnlockOutlined className="mr-1" /> : <LockOutlined className="mr-1" />}
        {isPublic ? '公开' : '加密'}
      </Tag>
      {visibleTags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}

      {/* 如果有隐藏的标签，显示 "+n" 图标 */}
      {hiddenTagsCount > 0 && (
        <Tag color="default">
          <PlusOutlined /> {hiddenTagsCount}
        </Tag>
      )}
    </div>
  );
};

export default CodeTags;
