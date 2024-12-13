import React from 'react'
import { useState, useRef, useEffect } from "react"
import { Button, Input, Select, DatePicker, Card, Space, Tooltip, Collapse } from 'antd'
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined, OrderedListOutlined, UnorderedListOutlined, LinkOutlined, PictureOutlined, CodeOutlined, TableOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, LockOutlined, UnlockOutlined, DownOutlined } from '@ant-design/icons'
import MarkdownIt from 'markdown-it'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Panel } = Collapse
const md = new MarkdownIt()

const defaultTags = ['Java', 'JavaScript', 'C++', 'Python', '作业', 'HTML', '设计模式']

export function MarkdownEditor({ onTitleChange }: { onTitleChange: (title: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [date, setDate] = useState<dayjs.Dayjs | null>(null)
  const [markdown, setMarkdown] = useState("**你好，世界！**")
  const [isPublic, setIsPublic] = useState(true)
  const [password, setPassword] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isExpanded])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, 40)
    setTitle(newTitle)
    onTitleChange(newTitle)
  }

  const handleTagChange = (newTags: string[]) => {
    setTags(newTags)
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const length = Math.floor(Math.random() * (8 - 4 + 1)) + 4
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  const handleSubmit = () => {
    console.log("提交成功")
  }

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart
      const end = textAreaRef.current.selectionEnd
      const selectedText = markdown.substring(start, end)
      const newText = markdown.substring(0, start) + prefix + selectedText + suffix + markdown.substring(end)
      setMarkdown(newText)
      textAreaRef.current.focus()
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + prefix.length
          textAreaRef.current.selectionEnd = end + prefix.length
        }
      }, 0)
    }
  }

  return (
    <div className="mt-4">
      <Collapse
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 0 : -90} />}
        onChange={(key) => setIsExpanded(key.length > 0)}
      >
        <Panel header="更多设置" key="1">
          <Card ref={cardRef}>
            <div className="flex space-x-4 items-center mb-4">
              <Input
                addonBefore="标题"
                placeholder="(最多40个字符)"
                value={title}
                onChange={handleTitleChange}
                maxLength={40}
                style={{ width: '30%' }}
              />

              <div className='flex items-center' style={{ width: '40%' }}>
                <span className='whitespace-nowrap bg-gray-100 border bg-zinc-50 py-1 px-3 rounded-l-lg'>
                  标签
                  </span>
                <Select
                  mode="tags"
                  style={{ flexGrow: 1 }}
                  placeholder="选择或输入标签"
                  onChange={handleTagChange}
                  options={defaultTags.map(tag => ({ value: tag, label: tag }))}
                />
              </div>
              <div className='flex items-center'>
              <span className='whitespace-nowrap bg-gray-100 border bg-zinc-50 py-1 px-3 rounded-l-lg'>
                  过期时间
                  </span>
                  <DatePicker
                  className='rounded-none rounded-tr-md rounded-br-md  grow'
                showTime
                placeholder="选择过期时间"
                onChange={(value) => setDate(value)}
           
              />
              </div>
             
            </div>



            <div className="flex space-x-2 mb-2 overflow-x-auto py-2">
              <Tooltip title="加粗">
                <Button icon={<BoldOutlined />} onClick={() => insertMarkdown('**', '**')} />
              </Tooltip>
              <Tooltip title="斜体">
                <Button icon={<ItalicOutlined />} onClick={() => insertMarkdown('*', '*')} />
              </Tooltip>
              <Tooltip title="下划线">
                <Button icon={<UnderlineOutlined />} onClick={() => insertMarkdown('<u>', '</u>')} />
              </Tooltip>
              <Tooltip title="删除线">
                <Button icon={<StrikethroughOutlined />} onClick={() => insertMarkdown('~~', '~~')} />
              </Tooltip>
              <Tooltip title="有序列表">
                <Button icon={<OrderedListOutlined />} onClick={() => insertMarkdown('\n1. ')} />
              </Tooltip>
              <Tooltip title="无序列表">
                <Button icon={<UnorderedListOutlined />} onClick={() => insertMarkdown('\n- ')} />
              </Tooltip>
              <Tooltip title="链接">
                <Button icon={<LinkOutlined />} onClick={() => insertMarkdown('[链接文字](', ')')} />
              </Tooltip>
              <Tooltip title="图片">
                <Button icon={<PictureOutlined />} onClick={() => insertMarkdown('![图片描述](', ')')} />
              </Tooltip>
              <Tooltip title="代码块">
                <Button icon={<CodeOutlined />} onClick={() => insertMarkdown('\n```\n', '\n```')} />
              </Tooltip>
              <Tooltip title="表格">
                <Button icon={<TableOutlined />} onClick={() => insertMarkdown('\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |')} />
              </Tooltip>
              <Tooltip title="左对齐">
                <Button icon={<AlignLeftOutlined />} onClick={() => insertMarkdown('::: left\n', '\n:::')} />
              </Tooltip>
              <Tooltip title="居中对齐">
                <Button icon={<AlignCenterOutlined />} onClick={() => insertMarkdown('::: center\n', '\n:::')} />
              </Tooltip>
              <Tooltip title="右对齐">
                <Button icon={<AlignRightOutlined />} onClick={() => insertMarkdown('::: right\n', '\n:::')} />
              </Tooltip>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <TextArea
                  ref={textAreaRef}
                  rows={10}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="输入 Markdown 描述..."
                />
              </div>
              <div
                className="border p-2 rounded overflow-auto"
                style={{ height: '240px' }}
                dangerouslySetInnerHTML={{ __html: md.render(markdown) }}
              />
            </div>

            <div className="flex justify-between items-center">
              <Space>
                <Button
                  type={isPublic ? "primary" : "default"}
                  icon={<UnlockOutlined />}
                  onClick={() => setIsPublic(true)}
                >
                  公开
                </Button>
                <Button
                  type={!isPublic ? "primary" : "default"}
                  icon={<LockOutlined />}
                  onClick={() => setIsPublic(false)}
                >
                  加密
                </Button>

              </Space>
              <Button type="primary" onClick={handleSubmit}>提交</Button>
              <div>
                {!isPublic && (
                  <div className="mb-4">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="4-8 位字符密码"
                      style={{ width: 150 }}
                      minLength={4}
                      maxLength={8}
                    />
                    <Button onClick={generatePassword} className="ml-2">生成密码</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Panel>
      </Collapse>
    </div>
  )
}

