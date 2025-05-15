"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Text, ImageIcon } from "lucide-react"

const tabs = [
  { id: "text", label: "Text", icon: Text },
  { id: "images", label: "Images", icon: ImageIcon },
]

export function TabNav() {
  const [activeTab, setActiveTab] = useState("text")

  return (
    <div className="flex px-4 pt-4 pb-2 gap-2 border-b border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
