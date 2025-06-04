"use client"

import { useState, useEffect } from "react"
import { Copy, Star, Volume2 } from "lucide-react"
import { useEmojiStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function OutputPanel() {
  const { inputText, toggleSaved, saved, currentEmojiOutput } = useEmojiStore()

  // Check for the warning symbol and filter it out for display
  const hasWarning = typeof currentEmojiOutput === 'string' && currentEmojiOutput.includes("⚠️");
  const displayOutput = hasWarning ? currentEmojiOutput.replace("⚠️", "").trim() : currentEmojiOutput;

  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const emojis = typeof displayOutput === 'string' && displayOutput.trim() !== '' ? displayOutput.split(" ") : []

  useEffect(() => {
    // Check if this translation is saved
    if (inputText && displayOutput) {
      const isCurrentlySaved = saved.some((item) => item.input === inputText && item.output === displayOutput);
      setIsSaved(isCurrentlySaved);
    } else {
      setIsSaved(false);
    }
  }, [inputText, saved, displayOutput]);

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
          <>
            <div className="text-3xl leading-relaxed break-words">{emojis.join(" ")}</div>
            {/* Display the warning message if the symbol is present */}
            {hasWarning && (
              <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                Translation may be inaccurate. Try simpler phrasing.
              </div>
            )}
          </>
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
            disabled={hasWarning}
            className={cn(
              "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800",
              isSaved ? "text-yellow-500" : "text-gray-500 dark:text-gray-400",
              hasWarning && "opacity-50 cursor-not-allowed",
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
