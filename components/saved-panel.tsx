"use client"

import type React from "react"

import { X, ChevronLeft, ChevronRight, Search, Star, MoreVertical } from "lucide-react"
import { useEmojiStore } from "@/lib/store"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

type SavedPanelProps = {
  onClose: () => void
}

export function SavedPanel({ onClose }: SavedPanelProps) {
  const { saved, toggleSaved } = useEmojiStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const panelRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if the click is on the overlay (outside the panel)
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const filteredSaved = searchQuery
    ? saved.filter(
        (item) =>
          item.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.output.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : saved

  const totalPages = Math.ceil(filteredSaved.length / itemsPerPage)
  const currentItems = filteredSaved.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 dark:bg-black/50 flex justify-end" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        className="w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-auto shadow-lg flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-medium">Saved</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search saved phrases"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredSaved.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? "No saved phrases match your search" : "Your saved phrases will appear here"}
            </div>
          ) : (
            <>
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                {filteredSaved.length === 1
                  ? "1 phrase"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredSaved.length,
                    )} of ${filteredSaved.length} phrases`}
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {currentItems.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <span>English</span>
                        <span>→</span>
                        <span>Emoji</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleSaved(item.input, item.output)}
                          className="text-yellow-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          aria-label="Remove from saved"
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
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

              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={cn(
                      "p-2 rounded-full",
                      currentPage === 1
                        ? "text-gray-300 dark:text-gray-600"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                    )}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "p-2 rounded-full",
                      currentPage === totalPages
                        ? "text-gray-300 dark:text-gray-600"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                    )}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
