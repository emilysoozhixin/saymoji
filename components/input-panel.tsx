"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mic, X } from "lucide-react"
import { useEmojiStore } from "@/lib/store"

export function InputPanel() {
  const { inputText, setInputText, addHistoryItem, setCurrentEmojiOutput } = useEmojiStore()
  const [text, setText] = useState(inputText)
  const [charCount, setCharCount] = useState(0)
  const maxChars = 5000

  useEffect(() => {
    setText(inputText)
  }, [inputText])

  useEffect(() => {
    setCharCount(text.length)
  }, [text])

  const handleClear = () => {
    setText("")
    setInputText("")
    setCurrentEmojiOutput("")
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      setInputText(text)

      // Get current emoji output from the store (async)
      const { getEmojiOutput } = useEmojiStore.getState()
      const emojiOutput = await getEmojiOutput()

      // Only add to history if there's text and emoji output
      if (text && emojiOutput) {
        addHistoryItem(text, emojiOutput)
        setCurrentEmojiOutput(emojiOutput)
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter text"
        className="flex-1 p-4 resize-none outline-none bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 h-[180px] border-none focus:ring-0 focus:outline-none"
        maxLength={maxChars}
      />

      <div className="absolute bottom-0 right-0 flex items-center p-4 gap-4">
        {text && (
          <button
            onClick={handleClear}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Clear text"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Voice input">
          <Mic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {charCount} / {maxChars}
        </div>
      </div>
    </div>
  )
}
