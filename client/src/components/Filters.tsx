import React from 'react'
import { Select } from 'antd'

interface FiltersProps {
  shareRange: string
  setShareRange: (range: string) => void
  language: string
  setLanguage: (lang: string) => void
}

export default function Filters({ shareRange, setShareRange, language, setLanguage }: FiltersProps) {
  return (
    <div className="flex space-x-4">
      <Select
        value={shareRange}
        onChange={setShareRange}
        className="w-[180px]"
        placeholder="分享范围"
      >
        <Select.Option value="all">全部</Select.Option>
        <Select.Option value="public">公开</Select.Option>
        <Select.Option value="private">加密</Select.Option>
      </Select>

      <Select
        value={language}
        onChange={setLanguage}
        className="w-[180px]"
        placeholder="编程语言"
      >
        <Select.Option value="all">全部</Select.Option>
        <Select.Option value="javascript">JavaScript</Select.Option>
        <Select.Option value="python">Python</Select.Option>
        <Select.Option value="java">Java</Select.Option>
      </Select>
    </div>
  )
}
