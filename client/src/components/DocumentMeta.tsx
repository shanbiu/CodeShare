import React, { useState, useEffect } from "react";
import { Input, Select, DatePicker, Card, Space, Button, Collapse, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { MarkdownEditor } from "./MarkdownEditor";
import dayjs from "dayjs";

const { Panel } = Collapse;

const defaultTags = ['Java', 'JavaScript', 'C++', 'Python', '作业', 'HTML', '设计模式'];

const quickDates = [
  { label: '今天', value: dayjs().endOf('day') },
  { label: '15分钟', value: dayjs().add(15, 'minute') },
  { label: '1小时', value: dayjs().add(1, 'hour') },
  { label: '6小时', value: dayjs().add(6, 'hour') },
  { label: '1天', value: dayjs().add(1, 'day') },
  { label: '1周', value: dayjs().add(1, 'week') },
  { label: '1月', value: dayjs().add(1, 'month') },
];

interface DocumentMateProps {
  onTitleChange: (title: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  expireAt: dayjs.Dayjs | null;
  setExpireAt: (expireAt: dayjs.Dayjs | null) => void;
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

export function DocumentMate({
  onTitleChange,
  tags,
  setTags,
  expireAt,
  setExpireAt,
  markdown,
  setMarkdown,
}: DocumentMateProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
      onTitleChange(title);
  }, [title, onTitleChange]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, 40); // 限制标题长度为 40
    setTitle(newTitle);
  };

  return (
    <div className="mt-4">
      <Collapse
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 0 : -90} />}
        onChange={(key) => setIsExpanded(key.length > 0)}
      >
        <Panel header="更多设置" key="1">
          <Card>
            {/* 标题输入 */}
            <div className="flex items-center space-x-4 mb-4">
              <Input
                className="flex-1"
                addonBefore="标题"
                placeholder="(最多40个字符)"
                value={title}
                onChange={handleTitleChange}
                maxLength={40}
                style={{ width: '30%' }}
              />
              <div className="flex-1 flex items-center">
                <Tag className="whitespace-nowrap m-0 text-sm rounded-none rounded-l-lg" style={{ padding: '5px 11px' }}>
                  标签
                </Tag>
                <Select
                  className="flex-grow h-8"
                  mode="tags"
                  placeholder="选择或输入标签"
                  value={tags}
                  onChange={setTags}
                  options={defaultTags.map((tag) => ({ value: tag, label: tag }))}
                  maxTagCount="responsive" // 自动处理多余标签
                  maxTagTextLength={12} // 标签文本过长时进行截断
                />
              </div>

              <div className="flex-1 flex items-center">
                <Tag className="whitespace-nowrap m-0 text-sm rounded-none rounded-l-lg" style={{ padding: '5.2px 11px' }}>
                  过期时间
                </Tag>
                <DatePicker
                  className="rounded-none rounded-tr-md rounded-br-md grow"
                  showTime
                  value={expireAt}
                  placeholder="选择过期时间"
                  onChange={setExpireAt}
                  renderExtraFooter={() => (
                    <div>
                      <Space className="flex justify-between">
                        {quickDates.map((quickDate) => (
                          <Button
                            className="border-none rounded-none"
                            key={quickDate.label}
                            size="small"
                            onClick={() => setExpireAt(quickDate.value)}
                          >
                            {quickDate.label}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Markdown 编辑器 */}
            <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
          </Card>
        </Panel>
      </Collapse>
    </div>
  );
}
