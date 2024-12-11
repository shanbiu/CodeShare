import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

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
      {tabs.map((tab, index) => (
        <Button
          key={index}
          variant={activeTab === index ? "default" : "outline"}
          onClick={() => setActiveTab(index)}
        >
          {tab.title}
        </Button>
      ))}
      <Button variant="outline" size="icon" onClick={onAddTab}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

