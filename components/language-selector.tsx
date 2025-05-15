"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type LanguageSelectorProps = {
  side: "source" | "target"
}

const languages = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "arabic", label: "Arabic" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
]

export function LanguageSelector({ side }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(side === "source" ? "english" : "emoji")
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)

  const selectLanguage = (langId: string) => {
    setSelectedLanguage(langId)
    closeDropdown()
  }

  return (
    <div className="relative border-b border-gray-200 dark:border-gray-800">
      <div className="flex px-4 py-3">
        {side === "source" ? (
          <div className="flex items-center">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {languages.find((lang) => lang.id === selectedLanguage)?.label || "Select language"}
              <ChevronDown className="h-4 w-4" />
            </button>
            {side === "source" && <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">- Detected</div>}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Emoji</div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-md bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => selectLanguage(language.id)}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm",
                  selectedLanguage === language.id
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                )}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
