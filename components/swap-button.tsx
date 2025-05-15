"use client"

import { ArrowLeftRight } from "lucide-react"

export function SwapButton() {
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
      <button
        className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
        aria-label="Swap languages"
      >
        <ArrowLeftRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  )
}
