import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, RefreshCw, Lock, Unlock, Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import MarkdownIt from 'markdown-it'
import dayjs from 'dayjs'
import { toast } from "@/components/ui/use-toast"

const md = new MarkdownIt()

const defaultTags = ['Java', 'JavaScript', 'C++', 'Python', '作业', 'HTML', '设计模式']

export function MarkdownEditor({ onTitleChange }: { onTitleChange: (title: string) => void }) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [markdown, setMarkdown] = useState("**你好，世界！**")
  const [isPublic, setIsPublic] = useState(true)
  const [password, setPassword] = useState("")

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, 40)
    setTitle(newTitle)
    onTitleChange(newTitle)
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value)
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault()
      addTag(tagInput.trim())
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    } else {
      toast({
        title: "标签已存在",
        description: `标签 "${tag}" 已经添加过了。`,
        variant: "destructive",
      })
    }
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
    router.push('/success')
  }

  const presetTimes = [
    { label: '15分钟', value: dayjs().add(15, 'minute').toDate() },
    { label: '1小时', value: dayjs().add(1, 'hour').toDate() },
    { label: '6小时', value: dayjs().add(6, 'hour').toDate() },
    { label: '1天', value: dayjs().add(1, 'day').toDate() },
    { label: '1周', value: dayjs().add(1, 'week').toDate() },
    { label: '1个月', value: dayjs().add(1, 'month').toDate() },
  ]

  return (
    <div className="mt-4">
      <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "隐藏描述" : "显示描述"}
      </Button>
      {isExpanded && (
        <div className="mt-4 border rounded p-4 space-y-4">
          <div>
            <Label htmlFor="title">标题 (最多40个字符)</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="输入标题"
              maxLength={40}
            />
          </div>
          <div>
            <Label htmlFor="tags">标签</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                  <button
                    className="ml-1 text-xs"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Input
                id="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="输入标签（按回车添加）或从下方选择"
              />
              <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded shadow-lg">
                {defaultTags.map(tag => (
                  <div
                    key={tag}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                    {tags.includes(tag) && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label>过期时间</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? dayjs(date).format("YYYY年MM月DD日 HH:mm:ss") : <span>永久</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                  <div className="border-l p-2 flex items-center">
                    <div className="flex space-x-2">
                      <ScrollArea className="h-[240px] w-[50px] rounded-md border">
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <div
                            key={hour}
                            className="flex items-center justify-center h-[30px] cursor-pointer hover:bg-accent"
                            onClick={() => {
                              const newDate = date ? dayjs(date) : dayjs();
                              setDate(newDate.hour(hour).toDate());
                            }}
                          >
                            {hour.toString().padStart(2, '0')}
                          </div>
                        ))}
                      </ScrollArea>
                      <ScrollArea className="h-[240px] w-[50px] rounded-md border">
                        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                          <div
                            key={minute}
                            className="flex items-center justify-center h-[30px] cursor-pointer hover:bg-accent"
                            onClick={() => {
                              const newDate = date ? dayjs(date) : dayjs();
                              setDate(newDate.minute(minute).toDate());
                            }}
                          >
                            {minute.toString().padStart(2, '0')}
                          </div>
                        ))}
                      </ScrollArea>
                      <ScrollArea className="h-[240px] w-[50px] rounded-md border">
                        {Array.from({ length: 60 }, (_, i) => i).map((second) => (
                          <div
                            key={second}
                            className="flex items-center justify-center h-[30px] cursor-pointer hover:bg-accent"
                            onClick={() => {
                              const newDate = date ? dayjs(date) : dayjs();
                              setDate(newDate.second(second).toDate());
                            }}
                          >
                            {second.toString().padStart(2, '0')}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between p-2 border-t">
                  <Button variant="ghost" size="sm" onClick={() => setDate(dayjs().toDate())}>今天</Button>
                  {presetTimes.map((preset, index) => (
                    <Button key={index} variant="ghost" size="sm" onClick={() => setDate(preset.value)}>
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">描述 (Markdown)</Label>
              <textarea
                id="description"
                className="w-full h-64 p-2 border rounded"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="输入 Markdown 描述..."
              />
            </div>
            <div>
              <Label>预览</Label>
              <div 
                className="w-full h-64 p-2 border rounded overflow-auto"
                dangerouslySetInnerHTML={{ __html: md.render(markdown) }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant={isPublic ? "default" : "outline"}
                onClick={() => setIsPublic(true)}
              >
                <Unlock className="mr-2 h-4 w-4" />
                公开
              </Button>
              <Button
                variant={!isPublic ? "default" : "outline"}
                onClick={() => setIsPublic(false)}
              >
                <Lock className="mr-2 h-4 w-4" />
                加密
              </Button>
            </div>
            {!isPublic && (
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="4-8 位字符密码"
                  className="w-48"
                  minLength={4}
                  maxLength={8}
                />
                <Button onClick={generatePassword} size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>提交</Button>
          </div>
        </div>
      )}
    </div>
  )
}

