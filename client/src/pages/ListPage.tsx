import React, { useState } from 'react'
import { Button, Divider } from 'antd'
import { CodeOutlined, UnorderedListOutlined, ShareAltOutlined } from '@ant-design/icons'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'
import Header from '../components/Header'
import CodeCard from '../components/CodeCard'
import mockData from '../components/mockData.json'


interface Snippet {
    key: string
    language: string
    title: string
    code: string
  }
  
  interface CodeItem {
    id: string
    title: string
    snippets: Snippet[]
    tags: string[]
    create_at: string
    isPublic: boolean
  }
  // 为 mockData 明确指定类型
const typedMockData: CodeItem[] = mockData as CodeItem[];

export default function CodeList() {
    
  const [searchTerm, setSearchTerm] = useState('')
  const [shareRange, setShareRange] = useState('all')
  const [language, setLanguage] = useState('all')

  const filteredData = typedMockData.filter((item: CodeItem) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.snippets.some(snippet => snippet.code.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesShareRange = shareRange === 'all' || 
                              (shareRange === 'public' && item.isPublic) || 
                              (shareRange === 'private' && !item.isPublic)
    const matchesLanguage = language === 'all' || 
                            item.snippets.some(snippet => snippet.language === language)
    return matchesSearch && matchesShareRange && matchesLanguage
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-end mb-4">
            <SearchBar setSearchTerm={setSearchTerm} />
          </div>
          <Divider className="mb-4" />
          <div className="flex justify-end mb-4">
            <Filters 
              shareRange={shareRange} 
              setShareRange={setShareRange}
              language={language}
              setLanguage={setLanguage}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map(item => (
              <CodeCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
