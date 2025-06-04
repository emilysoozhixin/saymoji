"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { translateToEmoji, enhancedTranslateToEmoji } from "./emojiParser"

interface HistoryItem {
  input: string
  output: string
  timestamp: number
  isSaved: boolean
}

interface SavedItem {
  input: string
  output: string
  timestamp: number
}

interface EmojiState {
  selectedCategory: string
  recentEmojis: string[]
  inputText: string
  history: HistoryItem[]
  saved: SavedItem[]
  currentEmojiOutput: string
  getEmojiOutput: () => Promise<string>
  setSelectedCategory: (category: string) => void
  addRecentEmoji: (emoji: string) => void
  setInputText: (text: string) => void
  setCurrentEmojiOutput: (output: string) => void
  addHistoryItem: (input: string, output: string) => void
  toggleSaved: (input: string, output: string) => void
  clearHistory: () => void
  loadTranslation: (input: string, output: string) => void
}

export const useEmojiStore = create<EmojiState>()(
  persist(
    (set, get) => ({
      selectedCategory: "faces",
      recentEmojis: [],
      inputText: "",
      history: [],
      saved: [],
      currentEmojiOutput: typeof window !== 'undefined' ? '' : '',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      addRecentEmoji: (emoji) =>
        set((state) => {
          const filteredEmojis = state.recentEmojis.filter((e) => e !== emoji)
          return {
            recentEmojis: [emoji, ...filteredEmojis].slice(0, 16),
          }
        }),
      setInputText: (text) => {
        console.log('Setting input text:', text)
        set({ inputText: text })
      },
      setCurrentEmojiOutput: (output) => set({ currentEmojiOutput: output }),
      getEmojiOutput: async () => {
        const state = get()
        console.log('Getting emoji output for:', state.inputText)
        if (!state.inputText) return ""
        const translationResult = await enhancedTranslateToEmoji(state.inputText)
        console.log('Enhanced translation result:', translationResult)
        return translationResult.emojiSequence
      },
      addHistoryItem: (input, output) =>
        set((state) => ({
          history: [
            {
              input,
              output,
              timestamp: Date.now(),
              isSaved: false,
            },
            ...state.history,
          ],
        })),
      toggleSaved: (input, output) =>
        set((state) => {
          const isSaved = state.saved.some((item) => item.input === input && item.output === output)
          if (isSaved) {
            return {
              saved: state.saved.filter((item) => !(item.input === input && item.output === output)),
            }
          } else {
            return {
              saved: [
                {
                  input,
                  output,
                  timestamp: Date.now(),
                },
                ...state.saved,
              ],
            }
          }
        }),
      clearHistory: () => set({ history: [] }),
      loadTranslation: (input, output) => {
        console.log('Loading translation:', input, output)
        set({ inputText: input, currentEmojiOutput: output })
      },
    }),
    {
      name: "emoji-storage",
      partialize: (state) => {
        const { currentEmojiOutput, inputText, ...rest } = state
        return rest
      },
    }
  )
)
