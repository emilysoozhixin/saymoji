"use client"

import { useState, useEffect } from "react"
import { Copy, Star, Volume2 } from "lucide-react"
import { useEmojiStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function OutputPanel() {
  const { inputText, toggleSaved, saved } = useEmojiStore()
  const [emojis, setEmojis] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Get emoji output from the store
    const { getEmojiOutput } = useEmojiStore.getState()
    const emojiOutput = getEmojiOutput()

    // Set emojis from the output
    if (emojiOutput) {
      setEmojis(emojiOutput.split(" "))
    } else {
      setEmojis([])
    }

    // Check if this translation is saved
    if (inputText && emojiOutput) {
      const isCurrentlySaved = saved.some((item) => item.input === inputText && item.output === emojiOutput)
      setIsSaved(isCurrentlySaved)
    } else {
      setIsSaved(false)
    }
  }, [inputText, saved])

  const handleCopy = () => {
    const emojiOutput = emojis.join(" ")
    navigator.clipboard.writeText(emojiOutput).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSave = () => {
    if (inputText && emojis.length > 0) {
      const emojiOutput = emojis.join(" ")
      toggleSaved(inputText, emojiOutput)
      setIsSaved(!isSaved) // Toggle local state immediately for better UX
    }
  }

  return (
    <div className="flex flex-col flex-1 relative">
      <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 h-[180px] overflow-auto">
        {emojis.length > 0 ? (
          <div className="text-3xl leading-relaxed break-words">{emojis.join(" ")}</div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-center mt-8">
            Enter text on the left to see emoji translations
          </div>
        )}
      </div>

      {emojis.length > 0 && (
        <div className="absolute bottom-0 right-0 flex items-center p-4 gap-4">
          <button
            onClick={handleSave}
            className={cn(
              "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800",
              isSaved ? "text-yellow-500" : "text-gray-500 dark:text-gray-400",
            )}
            aria-label={isSaved ? "Remove from saved" : "Save as favorite"}
          >
            <Star className={cn("h-5 w-5", isSaved && "fill-current")} />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800" aria-label="Text to speech">
            <Volume2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>

          <button
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800",
              copied && "text-green-500 dark:text-green-400",
            )}
            aria-label="Copy to clipboard"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
