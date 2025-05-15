"use client"

import { useEmojiStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Smile, Hand, Users, Coffee, Car, Activity, Briefcase, Heart, Flag } from "lucide-react"

const categories = [
  { id: "faces", icon: Smile, label: "Faces" },
  { id: "gestures", icon: Hand, label: "Gestures" },
  { id: "people", icon: Users, label: "People" },
  { id: "food", icon: Coffee, label: "Food" },
  { id: "travel", icon: Car, label: "Travel" },
  { id: "activities", icon: Activity, label: "Activities" },
  { id: "objects", icon: Briefcase, label: "Objects" },
  { id: "symbols", icon: Heart, label: "Symbols" },
  { id: "flags", icon: Flag, label: "Flags" },
]

export function CategorySelector() {
  const { selectedCategory, setSelectedCategory } = useEmojiStore()

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md min-w-[60px]",
                "transition-colors duration-200",
                selectedCategory === category.id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900",
              )}
              aria-label={category.label}
              aria-pressed={selectedCategory === category.id}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{category.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
