"use client"

import { useState, useEffect } from "react"
import { useEmojiStore } from "@/lib/store"
import { cn } from "@/lib/utils"

// Emoji categories with their emojis
const emojiCategories = {
  faces: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋"],
  people: ["👨", "👩", "👶", "👦", "👧", "👨‍⚕️", "👩‍⚕️", "👨‍🎓", "👩‍🎓", "👨‍🏫", "👩‍🏫", "👨‍⚖️", "👩‍⚖️"],
  food: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️"],
  activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🥅", "🏒", "🏑", "🥍", "🏏"],
  objects: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "♥️", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  flags: ["🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏴‍☠️", "🇦🇨", "🇦🇩", "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶"],
}

export function EmojiBoard() {
  const { selectedCategory, addRecentEmoji } = useEmojiStore()
  const [emojis, setEmojis] = useState<string[]>([])

  useEffect(() => {
    setEmojis(emojiCategories[selectedCategory as keyof typeof emojiCategories] || emojiCategories.faces)
  }, [selectedCategory])

  const handleEmojiClick = (emoji: string) => {
    addRecentEmoji(emoji)

    // Copy to clipboard
    navigator.clipboard.writeText(emoji).catch((err) => {
      console.error("Failed to copy emoji: ", err)
    })
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-5 gap-3">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className={cn(
              "h-12 flex items-center justify-center text-2xl rounded-md",
              "hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors",
              "active:scale-95 transform duration-100",
            )}
            aria-label={`Emoji ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
