// ThemeSwitcher.tsx
import React from 'react';
import { Select } from 'antd';
import { useTheme } from './ThemeProvider';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleChange = (value: string) => {
    if (value === 'dark') {
      toggleTheme();
    }
    else{
      toggleTheme();
    }
  };

  return (
    <Select
      value={isDarkMode ? 'dark' : 'light'}
      onChange={handleChange}
     
    >
      <Select.Option value="dark">暗色主题</Select.Option>
      <Select.Option value="light">浅色主题</Select.Option>
    </Select>
  );
};

export default ThemeSwitcher;
