"use client"

import { useEmojiStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function RecentEmojis() {
  const { recentEmojis, addRecentEmoji } = useEmojiStore()

  const handleEmojiClick = (emoji: string) => {
    addRecentEmoji(emoji)

    // Copy to clipboard
    navigator.clipboard.writeText(emoji).catch((err) => {
      console.error("Failed to copy emoji: ", err)
    })
  }

  if (recentEmojis.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
        Recently used emojis will appear here
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
      <h2 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Recently Used</h2>
      <div className="flex flex-wrap gap-2">
        {recentEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className={cn(
              "h-10 w-10 flex items-center justify-center text-xl rounded-md",
              "hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors",
              "active:scale-95 transform duration-100",
            )}
            aria-label={`Recent emoji ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
