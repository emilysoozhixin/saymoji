import { UNIVERSAL_SYMBOLS } from './emojiParser'

export async function getEmojiForWord(word: string, fallback: string = "❓"): Promise<string> {
  const upperWord = word.toUpperCase();

  // Iterate through all categories in UNIVERSAL_SYMBOLS
  for (const categoryKey in UNIVERSAL_SYMBOLS) {
    // Ensure the category exists and is an object
    if (UNIVERSAL_SYMBOLS.hasOwnProperty(categoryKey) && typeof UNIVERSAL_SYMBOLS[categoryKey] === 'object') {
      const category = UNIVERSAL_SYMBOLS[categoryKey] as Record<string, string>;
      // Try direct mapping within the category
      if (category[upperWord]) {
        return category[upperWord];
      }
    }
  }

  // If not found directly, try synonyms from Datamuse in each category
  try {
    const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}`)
    if (!response.ok) return fallback
    const data = await response.json()
    for (const item of data) {
      const synonym = item.word.toUpperCase()
      for (const categoryKey in UNIVERSAL_SYMBOLS) {
        if (UNIVERSAL_SYMBOLS.hasOwnProperty(categoryKey) && typeof UNIVERSAL_SYMBOLS[categoryKey] === 'object') {
          const category = UNIVERSAL_SYMBOLS[categoryKey] as Record<string, string>;
          if (category[synonym]) {
            return category[synonym];
          }
        }
      }
    }
  } catch (e) {
    // Ignore errors, fallback
  }

  // If still not found, return the fallback emoji
  return fallback;
} 