"use client"

import { useState } from "react"
import { History, Star } from "lucide-react"
import { HistoryPanel } from "./history-panel"
import { SavedPanel } from "./saved-panel"
import { cn } from "@/lib/utils"

export function HistorySavedButtons() {
  const [activePanel, setActivePanel] = useState<"history" | "saved" | null>(null)

  const togglePanel = (panel: "history" | "saved") => {
    if (activePanel === panel) {
      setActivePanel(null)
    } else {
      setActivePanel(panel)
    }
  }

  return (
    <>
      <div className="flex justify-center border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-center gap-16 py-4">
          <button
            onClick={() => togglePanel("history")}
            className={cn(
              "flex flex-col items-center gap-1",
              activePanel === "history"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
            )}
          >
            <div
              className={cn(
                "p-3 rounded-full",
                activePanel === "history" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800",
              )}
            >
              <History className="h-6 w-6" />
            </div>
            <span className="text-sm">History</span>
          </button>

          <button
            onClick={() => togglePanel("saved")}
            className={cn(
              "flex flex-col items-center gap-1",
              activePanel === "saved"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
            )}
          >
            <div
              className={cn(
                "p-3 rounded-full",
                activePanel === "saved" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800",
              )}
            >
              <Star className="h-6 w-6" />
            </div>
            <span className="text-sm">Saved</span>
          </button>
        </div>
      </div>

      {activePanel === "history" && <HistoryPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "saved" && <SavedPanel onClose={() => setActivePanel(null)} />}
    </>
  )
}
