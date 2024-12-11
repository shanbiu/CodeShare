import React from 'react';
import { Layout, Button, theme } from 'antd';
import { CodeOutlined, UnorderedListOutlined, ShareAltOutlined } from '@ant-design/icons'

const { Header: AntdHeader } = Layout;

export default function Header() {
  const { token } = theme.useToken();
  return (
    <AntdHeader style={{ background: token.colorBgContainer }}
      className='flex items-center justify-between px-4'>

      <div className='text-2xl font-bold'>代码分享</div>
      <div className='flex space-x-2'>
        <Button type='text' icon={<CodeOutlined />}>创建</Button>
        <Button type='text' icon={<UnorderedListOutlined />}>列表</Button>
        <Button type='text' icon={<ShareAltOutlined />}>分享</Button>
      </div>
    </AntdHeader>

  )
}