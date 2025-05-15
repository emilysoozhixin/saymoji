"use client"

import type React from "react"

import { X, Star, MoreVertical } from "lucide-react"
import { useEmojiStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useRef } from "react"

type HistoryPanelProps = {
  onClose: () => void
}

export function HistoryPanel({ onClose }: HistoryPanelProps) {
  const { history, toggleSaved, clearHistory } = useEmojiStore()
  const panelRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if the click is on the overlay (outside the panel)
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 dark:bg-black/50 flex justify-end" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        className="w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-auto shadow-lg flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-medium">History</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={clearHistory}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear all history
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {history.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Your translation history will appear here
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {history.map((item, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>English</span>
                      <span>→</span>
                      <span>Emoji</span>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleSaved(item.input, item.output)}
                        className={cn(
                          "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800",
                          item.isSaved && "text-yellow-500",
                        )}
                        aria-label={item.isSaved ? "Remove from saved" : "Save translation"}
                      >
                        <Star className={cn("h-5 w-5", item.isSaved && "fill-current")} />
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-1">{item.input}</div>
                  <div className="text-2xl">{item.output}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
