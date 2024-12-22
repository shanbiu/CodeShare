import React from 'react';
import { Popover, Tag} from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import ShareCard from './ShareCard';

interface SharePopoverProps {
  item: any;            // 传递的 item 数据
  fetchData: (id?: string,password?: string) => void;  // 用于重新获取数据的方法
  children?: React.ReactNode;  // 用于渲染外部传入的组件 (比如 Button 或 Tag)
}

const SharePopover: React.FC<SharePopoverProps> = ({ item, children, fetchData }) => {
  // 渲染外部传入的组件，如果没有传入，则使用默认的 Tag
  const renderCustomComponent = () => {
    if (children) {
      return <>{children}</>; // 如果传入了自定义组件，就渲染它
    }
    // 否则渲染默认的 Tag 组件
    return (
      <Tag
        color="default"
        className="text-sm font-medium flex items-center cursor-pointer space-x-1 px-2 py-1 border 
          border-gray-400 rounded-lg bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 
          dark:border-gray-600 dark:hover:bg-gray-600"
      >
        <ShareAltOutlined className="text-xm" />
        <span className="text-xs">分享</span>
      </Tag>
    );
  };

  return (
    <Popover
      title={<div className="text-center font-bold">分享代码片段</div>}
      content={
        <ShareCard
          id={item.id}
          isPublic={item.isPublic}
          password={item.password}
          expire_at={item.expire_at}
          fetchData={fetchData}
        />
      }
      trigger="hover"
      placement="bottom"
      mouseLeaveDelay={0.5}
    >
      {renderCustomComponent()}  {/* 渲染外部传入的组件或默认的 Tag */}
    </Popover>
  );
};

export default SharePopover;
