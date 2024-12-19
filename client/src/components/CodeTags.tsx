import React, { useState, useRef, useEffect } from 'react';
import { Tag } from 'antd';
import { LockOutlined, UnlockOutlined, PlusOutlined } from '@ant-design/icons';

interface CodeTagsProps {
  isPublic: boolean;
  tags: string[];
}

const CodeTags: React.FC<CodeTagsProps> = ({ isPublic, tags }) => {
  const containerRef = useRef<HTMLDivElement>(null); // 引用父容器
  const [visibleTags, setVisibleTags] = useState<string[]>([]); // 可见的标签
  const [hiddenTagsCount, setHiddenTagsCount] = useState<number>(0); // 隐藏的标签数量

  // 假设标签宽度大约是这个值，单位是 px（包含 padding 和 border 等）
  const tagWidth = 80; // 你可以根据实际情况调整这个值

  useEffect(() => {
    const updateVisibleTags = () => {
      if (containerRef.current) {
        // 获取父容器的父容器的宽度
        const parentWidth = containerRef.current.parentElement?.offsetWidth; // 获取父容器的父容器的宽度
        // console.log('父容器的父容器的宽度:', parentWidth); // 输出父容器的父容器的宽度

        if (parentWidth) {
          const maxTags = Math.floor((parentWidth -140) / tagWidth); // 计算最大可显示的标签数量 (80% 父容器父容器宽度)

          // 根据最大可显示数量设置 visibleTags 和 hiddenTagsCount
          const visible = tags.slice(0, maxTags); // 可见标签
          const hiddenCount = tags.length - maxTags; // 隐藏的标签数量

          // console.log('可显示的标签数量:', visible.length); // 输出可显示标签数量
          // console.log('隐藏的标签数量:', hiddenCount); // 输出隐藏标签数量

          setVisibleTags(visible);
          setHiddenTagsCount(hiddenCount);
        }
      }
    };

    // 初次加载和窗口大小变化时更新标签显示
    updateVisibleTags();
    window.addEventListener('resize', updateVisibleTags); // 监听窗口大小变化
    return () => {
      window.removeEventListener('resize', updateVisibleTags); // 清理事件监听
    };
  }, [tags]);

  return (
    <div ref={containerRef} className="flex items-center space-x-2 max-w-[80%] overflow-hidden whitespace-nowrap">
      {/* 显示公开或加密标签 */}
      <Tag color={isPublic ? 'success' : 'error'}>
        {isPublic ? <UnlockOutlined className="mr-1" /> : <LockOutlined className="mr-1" />}
        {isPublic ? '公开' : '加密'}
      </Tag>

      {/* 显示可见的标签 */}
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
