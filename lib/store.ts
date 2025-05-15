"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Map common phrases to emojis
const phraseToEmoji: Record<string, string[]> = {
  hello: ["👋", "😊", "🙂"],
  goodbye: ["👋", "😢", "🚶"],
  "thank you": ["🙏", "😊", "❤️"],
  please: ["🙏", "🥺"],
  yes: ["👍", "✅", "🙂"],
  no: ["👎", "❌", "🙅"],
  help: ["🆘", "🙋", "❓"],
  bathroom: ["🚻", "🚽", "🧻"],
  water: ["💧", "🚰", "🥤"],
  food: ["🍽️", "🍴", "🍲"],
  where: ["❓", "🧭", "🗺️"],
  when: ["⏰", "📅", "❓"],
  how: ["❓", "🤔"],
  why: ["❓", "🤷"],
  who: ["👤", "❓"],
  what: ["❓", "🤔"],
  love: ["❤️", "😍", "💕"],
  happy: ["😊", "😁", "🎉"],
  sad: ["😢", "😭", "💔"],
  angry: ["😠", "😡", "💢"],
  sick: ["🤒", "😷", "🤢"],
  sleep: ["😴", "💤", "🛌"],
  eat: ["🍽️", "🍴", "😋"],
  drink: ["🥤", "🍺", "🍷"],
  walk: ["🚶", "👣"],
  run: ["🏃", "💨"],
  stop: ["🛑", "✋", "⛔"],
  go: ["🚶", "➡️", "🏁"],
  wait: ["⏳", "⌛", "🙏"],
  look: ["👀", "👁️", "🔍"],
  listen: ["👂", "🔊", "🎧"],
  speak: ["🗣️", "💬", "🎤"],
  write: ["✍️", "📝", "🖊️"],
  read: ["📖", "👓", "📚"],
  think: ["🤔", "💭", "🧠"],
  understand: ["👍", "💡", "🧠"],
  confused: ["😕", "❓", "🤷"],
  hot: ["🔥", "🥵", "☀️"],
  cold: ["❄️", "🥶", "☃️"],
  pain: ["😣", "🤕", "💉"],
  medicine: ["💊", "🏥", "👨‍⚕️"],
  money: ["💰", "💵", "💲"],
  phone: ["📱", "☎️", "📞"],
  time: ["⏰", "⌚", "⏱️"],
  day: ["☀️", "📅", "🌞"],
  night: ["🌙", "🌃", "🌜"],
  home: ["🏠", "🏡", "🔑"],
  work: ["💼", "🏢", "👨‍💼"],
  school: ["🏫", "📚", "🎒"],
  friend: ["👫", "🤝", "😊"],
  family: ["👪", "👨‍👩‍👧‍👦", "❤️"],
  child: ["👶", "🧒", "👧"],
  adult: ["👨", "👩", "🧑"],
  old: ["👴", "👵", "🧓"],
  man: ["👨", "🧔", "👱‍♂️"],
  woman: ["👩", "👱‍♀️", "👧"],
  doctor: ["👨‍⚕️", "👩‍⚕️", "🏥"],
  police: ["👮", "🚓", "🚨"],
  teacher: ["👨‍🏫", "👩‍🏫", "📚"],
  student: ["👨‍🎓", "👩‍🎓", "📝"],
  car: ["🚗", "🚙", "🚘"],
  bus: ["🚌", "🚍", "🚏"],
  train: ["🚆", "🚄", "🚉"],
  airplane: ["✈️", "🛫", "🛬"],
  boat: ["🚢", "⛵", "🛥️"],
  bicycle: ["🚲", "🚴", "🛴"],
  walk: ["🚶", "👣", "🏃"],
  run: ["🏃", "💨", "🏁"],
  swim: ["🏊", "🌊", "💦"],
  dance: ["💃", "🕺", "🎵"],
  sing: ["🎤", "🎵", "🎶"],
  play: ["🎮", "🎯", "🎪"],
  watch: ["👀", "📺", "🎬"],
  listen: ["👂", "🎧", "🔊"],
  read: ["📖", "📚", "👓"],
  write: ["✍️", "📝", "🖊️"],
  draw: ["🎨", "✏️", "🖌️"],
  paint: ["🎨", "🖌️", "🖼️"],
  cook: ["👨‍🍳", "👩‍🍳", "🍳"],
  clean: ["🧹", "🧼", "🧽"],
  wash: ["🧼", "💦", "🚿"],
  fix: ["🔧", "🔨", "🛠️"],
  build: ["🏗️", "🔨", "🧱"],
  buy: ["🛒", "💰", "🛍️"],
  sell: ["💰", "💵", "🏷️"],
  pay: ["💰", "💳", "💵"],
  open: ["🔓", "📭", "🔑"],
  close: ["🔒", "📪", "🚪"],
  start: ["🏁", "▶️", "🎬"],
  finish: ["🏁", "✅", "🎯"],
  win: ["🏆", "🥇", "🎖️"],
  lose: ["😢", "👎", "💔"],
  try: ["🔄", "🧪", "🎯"],
  fail: ["❌", "👎", "💔"],
  succeed: ["✅", "👍", "🎯"],
  learn: ["📚", "🧠", "🎓"],
  teach: ["👨‍🏫", "👩‍🏫", "📚"],
  remember: ["🧠", "💭", "📝"],
  forget: ["🤔", "❓", "🧠"],
  find: ["🔍", "👀", "💡"],
  lose: ["❓", "🔍", "😕"],
  hide: ["🙈", "🤫", "🕵️"],
  seek: ["🔍", "👀", "🕵️"],
  give: ["🎁", "🤲", "📦"],
  take: ["👐", "🤲", "📥"],
  send: ["📤", "📩", "📨"],
  receive: ["📥", "📩", "📨"],
  call: ["📞", "📱", "☎️"],
  text: ["📱", "💬", "📝"],
  email: ["📧", "📨", "📩"],
  message: ["💬", "📝", "📱"],
  talk: ["🗣️", "💬", "👄"],
  chat: ["💬", "👄", "🗣️"],
  argue: ["🗣️", "😠", "💢"],
  agree: ["👍", "🤝", "✅"],
  disagree: ["👎", "🙅", "❌"],
  like: ["👍", "❤️", "😊"],
  dislike: ["👎", "💔", "😒"],
  want: ["🙏", "🤲", "❤️"],
  need: ["🙏", "🆘", "❗"],
  have: ["✅", "👍", "🙌"],
  "don't have": ["❌", "👎", "🙅"],
  can: ["💪", "✅", "👍"],
  "can't": ["🙅", "❌", "👎"],
  should: ["👍", "✅", "💭"],
  "shouldn't": ["👎", "❌", "🙅"],
  must: ["❗", "⚠️", "❕"],
  "mustn't": ["🚫", "⛔", "❌"],
  may: ["🤔", "❓", "💭"],
  might: ["🤔", "❓", "💭"],
  will: ["✅", "👍", "⏱️"],
  "won't": ["❌", "👎", "🙅"],
  do: ["✅", "👍", "🔄"],
  "don't": ["❌", "👎", "🙅"],
  did: ["✅", "👍", "⏮️"],
  "didn't": ["❌", "👎", "🙅"],
  is: ["✅", "👍", "🟰"],
  "isn't": ["❌", "👎", "🙅"],
  are: ["✅", "👍", "🟰"],
  "aren't": ["❌", "👎", "🙅"],
  was: ["✅", "👍", "⏮️"],
  "wasn't": ["❌", "👎", "🙅"],
  were: ["✅", "👍", "⏮️"],
  "weren't": ["❌", "👎", "🙅"],
  has: ["✅", "👍", "🟰"],
  "hasn't": ["❌", "👎", "🙅"],
  have: ["✅", "👍", "🟰"],
  "haven't": ["❌", "👎", "🙅"],
  had: ["✅", "👍", "⏮️"],
  "hadn't": ["❌", "👎", "🙅"],
}

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
  getEmojiOutput: () => string
  setSelectedCategory: (category: string) => void
  addRecentEmoji: (emoji: string) => void
  setInputText: (text: string) => void
  addHistoryItem: (input: string, output: string) => void
  toggleSaved: (input: string, output: string) => void
  clearHistory: () => void
}

export const useEmojiStore = create<EmojiState>()(
  persist(
    (set, get) => ({
      selectedCategory: "faces",
      recentEmojis: [],
      inputText: "",
      history: [],
      saved: [],
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      addRecentEmoji: (emoji) =>
        set((state) => {
          // Remove the emoji if it already exists
          const filteredEmojis = state.recentEmojis.filter((e) => e !== emoji)

          // Add the emoji to the beginning of the array
          return {
            recentEmojis: [emoji, ...filteredEmojis].slice(0, 16), // Keep only the 16 most recent emojis
          }
        }),
      setInputText: (text) => set({ inputText: text }),
      getEmojiOutput: () => {
        const state = get()
        if (!state.inputText) return ""

        // Convert text to emojis using the same algorithm as in OutputPanel
        const words = state.inputText.toLowerCase().split(/\s+/)
        const result: string[] = []

        // First try to match phrases (up to 3 words)
        for (let i = 0; i < words.length; i++) {
          let matched = false

          // Try 3-word phrases
          if (i + 2 < words.length) {
            const phrase3 = words.slice(i, i + 3).join(" ")
            if (phraseToEmoji[phrase3]) {
              result.push(...phraseToEmoji[phrase3])
              i += 2
              matched = true
              continue
            }
          }

          // Try 2-word phrases
          if (i + 1 < words.length) {
            const phrase2 = words.slice(i, i + 2).join(" ")
            if (phraseToEmoji[phrase2]) {
              result.push(...phraseToEmoji[phrase2])
              i += 1
              matched = true
              continue
            }
          }

          // Try single words
          if (phraseToEmoji[words[i]]) {
            result.push(...phraseToEmoji[words[i]])
            matched = true
          }

          // If no match found, add a question mark emoji
          if (!matched && words[i].length > 0) {
            result.push("❓")
          }
        }

        return result.join(" ")
      },
      addHistoryItem: (input, output) =>
        set((state) => {
          // Check if this exact translation already exists in history
          const existingIndex = state.history.findIndex((item) => item.input === input && item.output === output)

          // If it exists, remove it so we can add it to the top
          const newHistory =
            existingIndex >= 0
              ? [...state.history.slice(0, existingIndex), ...state.history.slice(existingIndex + 1)]
              : [...state.history]

          // Check if this item is saved
          const isSaved = state.saved.some((item) => item.input === input && item.output === output)

          // Add the new item to the beginning
          return {
            history: [{ input, output, timestamp: Date.now(), isSaved }, ...newHistory].slice(0, 100), // Keep only the 100 most recent history items
          }
        }),
      toggleSaved: (input, output) =>
        set((state) => {
          // Check if this translation is already saved
          const existingIndex = state.saved.findIndex((item) => item.input === input && item.output === output)

          let newSaved
          if (existingIndex >= 0) {
            // Remove from saved
            newSaved = [...state.saved.slice(0, existingIndex), ...state.saved.slice(existingIndex + 1)]
          } else {
            // Add to saved
            newSaved = [{ input, output, timestamp: Date.now() }, ...state.saved]
          }

          // Update isSaved flag in history items
          const newHistory = state.history.map((item) => {
            if (item.input === input && item.output === output) {
              return { ...item, isSaved: existingIndex < 0 }
            }
            return item
          })

          return {
            saved: newSaved,
            history: newHistory,
          }
        }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "saymoji-storage",
    },
  ),
)
