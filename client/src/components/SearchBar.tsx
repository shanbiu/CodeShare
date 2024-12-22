import React from "react";
import { Input } from "antd";

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({ setSearchTerm }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="输入关键字搜索"
      onChange={(e) => setSearchTerm(e.target.value)}
      className="max-w-xs"
    />
  );
}
