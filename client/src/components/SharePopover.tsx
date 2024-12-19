import React from 'react';
import { Popover, Tag } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import ShareCard from './ShareCard';

interface SharePopoverProps {
  item: any;           // 传递的 item 数据
  tagProps?: React.ComponentProps<typeof Tag>;  // 可选的 Tag 属性
}

const SharePopover: React.FC<SharePopoverProps> = ({ item, tagProps }) => {
  return (
    <Popover
      title={<div className="text-center font-bold">分享代码片段</div>}
      content={
        <ShareCard
          id={item.id}
          isPublic={item.isPublic}
          password={item.password}
          expiration={item.expiration}
        />
      }
      trigger="hover"
      placement="bottom"
      mouseLeaveDelay={0.5}
    >
      <Tag 
        color="default"
        className="text-sm font-medium flex items-center cursor-pointer space-x-1 px-2 py-1 border border-gray-400 rounded-lg bg-white text-gray-800 
          hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        {...tagProps} // 把传入的 Tag 属性传递下去
      >
        <ShareAltOutlined className="text-xm" />
        <span className="text-xs">分享</span>
      </Tag>
    </Popover>
  );
};

export default SharePopover;
