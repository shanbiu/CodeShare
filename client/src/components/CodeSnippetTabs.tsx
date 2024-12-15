import React from "react";


interface Tab {
  title: string;
  code: string;
}

interface CodeSnippetTabsProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  onAddTab: () => void;
}

export function CodeSnippetTabs({ 
  tabs, 
  activeTab, 
  setActiveTab, 
  onAddTab 
}: CodeSnippetTabsProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">

    </div>
  )
}

