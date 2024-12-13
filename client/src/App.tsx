import React, { useState } from 'react';
import { Layout, Typography, Select, Tabs, Switch } from 'antd'
import Header from './components/Header';
import './tailwind.css';
import{MarkdownEditor} from './components/MarkdownEditor';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './components/ThemeProvider';
import { CodeEditor } from './components/CodeEditor';
const { Content } = Layout;
const { Title } = Typography;


function App() {

  const [title, setTitle] = useState('代码标题')
  const [language, setlanguage] = useState('javascript')
  const [snippets, setSnippets] = useState([
    { key: '1', language: 'javascript', title: '代码标题', code: '代码内容' },
  ])
  // 记得修改初始化得activeSnippet
  const [activeSnippet, setActiveSnippet] = useState('1')



  const { isDarkMode, toggleTheme } = useTheme()
  const addSnippet = (newTabIndex: number) => {
    const newKey = `${newTabIndex}`
    setSnippets([...snippets, { key: newKey, language: 'javascript', title: "代码标题"+newKey, code: '代码内容' }])
    setActiveSnippet(newKey)
  }

  const removeSnippet = (targetKey: string) => {
    const newSnippets = snippets.filter((snippet) => snippet.key !== targetKey)
    setSnippets(newSnippets)
    if (newSnippets.length && activeSnippet === targetKey) {
      setActiveSnippet(newSnippets[newSnippets.length - 1].key)

    }
  }
  const updateSnippet = (key: string, newCode: string) => {
    setSnippets(snippets.map(snippet =>
      snippet.key === key ? { ...snippet, content: newCode } : snippet
    ))
  }

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'add') {
      addSnippet(snippets.length + 1)
    } else if (action === 'remove') {
      removeSnippet(targetKey as string)
    }
  }
  return (
    <Layout className='min-h-screen'>
      <Header />
      <Content className='p-4'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center'>
            <Title level={3}>{title}</Title>
              <Select value={isDarkMode ? 'dark' : 'light'}
                onChange={(value) => toggleTheme()}
                className='w-28'
              >
                <Select.Option value="dark">暗色主题</Select.Option>
                <Select.Option value="light">浅色主题</Select.Option>

              </Select>

          </div>
          <Tabs
            type='editable-card'
            activeKey={activeSnippet}
            onChange={setActiveSnippet}
            onEdit={onEdit}
            items={snippets.map((snippet) => ({
              key: snippet.key,
              label: snippet.title,
              children: (
                <div className='relative'>
                 <Select value={language}
                onChange={setlanguage}
                className=' w-28 absolute right-0 top-[-40px]'
              >
                <Select.Option value="javascript">JavaScript</Select.Option>
                <Select.Option value="python">Python</Select.Option>
                <Select.Option value="java">Java</Select.Option>
              </Select>
              <CodeEditor
                  key={snippet.key}
                  title={snippet.title}
                  language={language}
                  code={snippet.code}
                  onChange={(newCode) => updateSnippet(snippet.key, newCode)}
                />
                </div>
              ),
            }))}

          />
          <MarkdownEditor onTitleChange={ }/>
        </div>
      </Content>
    </Layout>
  );

}

export default App;