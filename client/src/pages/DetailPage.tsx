'use client'
import React from 'react'
import { useEffect } from 'react'
import { Layout, Typography, Card } from 'antd'
import Header from "../components/Header"

const { Content } = Layout
const { Title, Paragraph } = Typography

export default function DetailPage() {

  useEffect(() => {
    // 这里可以添加获取提交数据的逻辑
  }, [])

  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4">
        <div className="container mx-auto">
          <Card>
            <Title level={2}>提交成功</Title>
            <Paragraph>
              您的代码片段已成功提交。您可以在这里查看详细信息或返回主页。
            </Paragraph>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              返回主页
            </button>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

