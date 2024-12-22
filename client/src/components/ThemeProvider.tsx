import React, { createContext, useState, useContext, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const savedTheme = localStorage.getItem("theme") || "light";
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    // 根据系统的主题偏好设置初始化状态
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme === "auto") {
      setIsDarkMode(prefersDark);
    }
  }, [savedTheme]);

  useEffect(() => {
    // 改变主题
    document.documentElement.classList.toggle("dark", isDarkMode);

    // 存储主题到 localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
