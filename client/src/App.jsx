// import { useState } from 'react';
import { Layout, Typography, Select, Tabs, Switch } from 'antd'
import Header from './components/Header';
import './tailwind.css';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './components/ThemeProvider';


function App() {

const [title, setTitle] = useState('代码标题')
  const { Content } = Layout;
  const { Title } = Typography;
  // const {Option} = Select;

  const { isDarkMode, toggleTheme } = useTheme()
  return (
    <Layout className='min-h-screen'>
      <Header />
      <Content className='p-4'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center mb-4'>
            <Title level={3}>代码标题</Title>
            <div className='flex item-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <span>主题切换</span>
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  checkedChildren={<BulbFilled />}
                  unCheckedChildren={<BulbOutlined />}
                />
              </div>
              <Select value={language}
                onChange={setlanguage}
                style={{ width: 120 }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </Select>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );

}

export default App;