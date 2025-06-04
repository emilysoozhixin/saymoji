import nlp from 'compromise'
import { getEmojiForWord } from './emojiLookup'
import {
  composeEmojiSequenceWithScoring,
  analyzeUniversalityScore,
  getUniversalEmojiWithScoring
} from './universalityScoring'

// Define types for our symbol mappings (Update based on new structure)
type EntityKey = keyof typeof UNIVERSAL_SYMBOLS.entities;
type SpatialKey = keyof typeof UNIVERSAL_SYMBOLS.spatial;
type ActionKey = keyof typeof UNIVERSAL_SYMBOLS.actions;
type StateKey = keyof typeof UNIVERSAL_SYMBOLS.states;
type NeedKey = keyof typeof UNIVERSAL_SYMBOLS.needs;
type QuantityKey = keyof typeof UNIVERSAL_SYMBOLS.quantities;
type EmotionKey = keyof typeof UNIVERSAL_SYMBOLS.emotions;
type CommunicationKey = keyof typeof UNIVERSAL_SYMBOLS.communication;
type EnvironmentKey = keyof typeof UNIVERSAL_SYMBOLS.environment;


// Replace the old SYMBOLS object with the new UNIVERSAL_SYMBOLS structure
export const UNIVERSAL_SYMBOLS = {

  // TOP-LEVEL CATEGORIES (8 main groups)

  // 1. ENTITIES - Who/what is involved
  entities: {
    self: "●",           // The speaker/communicator
    other: "○",          // The listener/recipient
    unknown: "◯",        // Unknown entity
    multiple: "●●●",     // Multiple entities/group
    small: "⚫",         // Small entity
    large: "⭕",         // Large entity
    organic: "🟫",       // Living/biological entity
    artificial: "⬜",    // Made/constructed entity
  },

  // 2. SPATIAL - Where things are/direction
  spatial: {
    here: "📍",          // Current location
    there: "📌",         // Different location
    up: "⬆️",           // Away from gravity
    down: "⬇️",         // Toward gravity
    forward: "➡️",      // Ahead direction
    backward: "⬅️",     // Behind direction
    around: "🔄",        // Circular/surrounding
    inside: "🔘",        // Within something
    outside: "⭕",       // External to something
    near: "↔️",         // Close distance
    far: "↕️",          // Long distance
  },

  // 3. ACTIONS - What is being done
  actions: {
    // Movement actions
    move: "➡️",          // Change position
    stop: "⏹️",         // Cease movement
    fast: "⚡",          // High speed
    slow: "🐌",          // Low speed

    // Physical interactions
    take: "⬅️●",        // Acquire/grab
    give: "●➡️",        // Transfer/provide
    combine: "🔗",       // Join together
    separate: "✂️",      // Divide/cut apart

    // Energy/matter changes
    create: "✨",         // Bring into existence
    destroy: "💥",       // Remove from existence
    grow: "📈",          // Increase size/amount
    shrink: "📉",        // Decrease size/amount

    // Information/sensing actions
    see: "👁️",          // Visual perception
    listen: "👂",        // Audio perception
    know: "💡",          // Possess information
    learn: "📚",         // Acquire information
    forget: "🧠❌",      // Lose information
  },

  // 4. STATES - Current condition of things
  states: {
    // Energy/temperature states
    hot: "🔥",           // High heat energy
    cold: "❄️",         // Low heat energy
    energy: "⚡",        // General energy
    tired: "🔋",         // Low energy level

    // Physical matter states
    solid: "🧊",         // Solid phase
    liquid: "💧",        // Liquid phase
    gas: "💨",           // Gas phase

    // Functional states
    working: "⚙️",       // Operating correctly
    broken: "❌",        // Not functioning
    empty: "⭕",         // Contains nothing
    full: "⚫",          // Completely filled

    // Time-related states
    now: "⏰",           // Present moment
    before: "⏪",        // Past time
    after: "⏩",         // Future time
    always: "♾️",        // All time
    never: "🚫⏰",       // No time
  },

  // 5. NEEDS - Universal survival requirements
  needs: {
    energy: "🔋",        // Food/fuel/power
    liquid: "💧",        // Water/fluids
    gas: "💨",           // Air/atmosphere
    shelter: "🏠",       // Protection/housing
    repair: "🔧",        // Healing/maintenance
    rest: "😴",          // Sleep/recovery
    temperature: "🌡️",   // Heat regulation
  },

  // 6. QUANTITIES - How much/many
  quantities: {
    none: "⭕",          // Zero amount
    one: "●",            // Single unit
    few: "●●",           // Small number
    many: "●●●",         // Large number
    all: "●●●●●",        // Everything
    more: "➕",          // Increase amount
    less: "➖",          // Decrease amount
    equal: "=",          // Same amount
  },

  // 7. EMOTIONS - Energy/feeling states
  emotions: {
    // Positive energy states
    good: "✅",          // Positive/favorable
    happy: "☀️",         // High positive energy
    calm: "〰️",         // Stable energy

    // Negative energy states
    bad: "❌",           // Negative/unfavorable
    sad: "⬇️",          // Low energy
    angry: "🔥",         // High negative energy
    fear: "⚠️",         // Danger detection

    // Neutral/uncertain states
    confused: "❓",      // Lack of information
    neutral: "➖",       // Balanced energy
  },

  // 8. COMMUNICATION - Intent/purpose of message
  communication: {
    question: "❓",       // Requesting information
    answer: "💡",        // Providing information
    warning: "⚠️",       // Alert about danger
    greeting: "👋",       // Starting interaction
    goodbye: "🔚",       // Ending interaction
    help: "🆘",          // Request assistance
    understand: "✅",     // Comprehension confirmed
    not_understand: "❌", // Comprehension failed
  },

  // BONUS: ENVIRONMENT - Observable surroundings
  environment: {
    light: "☀️",         // Visible electromagnetic radiation
    dark: "🌑",          // Absence of light
    sound: "🔊",         // Audio vibrations
    quiet: "🔇",         // Absence of sound
    gravity: "⬇️",       // Attractive force
    space: "🌌",         // Vacuum/cosmos
    ground: "🟫",        // Solid surface
    sky: "🔵",           // Atmosphere/above
  }
};

interface ParsedComponents {
  speaker: "human" | "alien" | string;
  subject: string;
  subjectEntity: "human" | "alien" | string;
  action: {
    type: "state" | "movement" | "desire" | "question" | "social" | string;
    verb: string;
  };
  object: string | null;
  isQuestion: boolean;
  isNegated: boolean;
  isUrgent: boolean;
  emotion: string | null;
  contextualMeaning: string | null;
}

export function parseInput(text: string): ParsedComponents {
  console.log('Parsing input:', text)
  const doc = nlp(text)

  // Defaults
  let speaker: "human" | "alien" | string = "human"
  let subject = ""
  let subjectEntity: "human" | "alien" | string = "human"
  let actionType: string = ""
  let actionVerb: string = ""
  let object: string | null = null
  let isQuestion = false
  let isNegated = false
  let isUrgent = false
  let emotion: string | null = null
  let contextualMeaning: string | null = null

  // Social action and friendly emotion detection
  const greetingPhrases = ["nice to meet you", "hello", "hi", "greetings"]
  const socialVerbs = ["meet", "greet", "welcome", "introduce"]
  const friendlyWords = ["nice", "happy", "pleased", "glad", "welcome", "friend", "friendly", "smile"]
  const lowerText = text.toLowerCase();

  // Special case: 'this is a [noun]' or 'that is a [noun]'
  const descriptionMatch = lowerText.match(/^(this|that) is (a |an )?([a-z]+)/)
  if (descriptionMatch) {
    actionType = "description"
    object = descriptionMatch[3]
    subject = ""
    actionVerb = "is"
  }

  // Check for questions
  isQuestion = doc.questions().length > 0

  // Check for negation
  isNegated = lowerText.includes('not') ||
              lowerText.includes('no') ||
              lowerText.includes("don't")

  // Check for urgency
  isUrgent = lowerText.includes('need') ||
             lowerText.includes('help') ||
             lowerText.includes('urgent')

  // Extract subject
  if (!subject) {
    const pronouns = doc.match('#Pronoun').text()
    if (pronouns) {
      subject = pronouns.toLowerCase()
    } else {
      subject = "I"
    }
  }

  // For now, assume human if subject is I/you/we/he/she/they
  if (["i", "we", "he", "she", "they"].includes(subject)) {
    subjectEntity = "human"
  } else if (subject === "you") {
    subjectEntity = "alien"
  }

  // Extract action and state
  if (!actionType) {
    const verbs = doc.verbs().out('array')
    if (verbs.length > 0) {
      actionVerb = verbs[0].toLowerCase()
      // Social action detection (only for explicit greeting phrases)
      if (greetingPhrases.some(phrase => lowerText.includes(phrase))) {
        actionType = "social"
        actionVerb = greetingPhrases.find(phrase => lowerText.includes(phrase)) || actionVerb
      } else if (["am", "is", "are", "be"].includes(actionVerb)) {
        // If copula and "from [noun]" is present, extract as object/location
        const fromNoun = doc.match('from #Noun').text();
        if (fromNoun) {
          object = fromNoun.replace(/^from /, '').toLowerCase();
          actionType = "location";
          actionVerb = "from";
        } else {
          // Look for state after copula
          const stateWord = doc.match('#Adjective').text() || doc.match('#Noun').text()
          if (stateWord) {
            actionType = "state"
            actionVerb = stateWord.toLowerCase()
            // Set emotion/context for common states
            if (["hungry", "thirsty"].includes(actionVerb)) {
              emotion = "need"
              contextualMeaning = actionVerb === "hungry" ? "needs food" : "needs water"
            } else if (["tired", "sleepy"].includes(actionVerb)) {
              emotion = "tired"
              contextualMeaning = "needs rest"
            } else if (["scared", "afraid"].includes(actionVerb)) {
              emotion = "fear"
              contextualMeaning = "is scared"
            }
          }
        }
      } else if (["want", "need"].includes(actionVerb)) {
        actionType = "desire"
        // Try to find object of desire
        const nounTerms = doc.nouns().out('array')
        if (nounTerms.length > 0) {
          object = nounTerms[nounTerms.length - 1].toLowerCase()
          if (object === subject) object = null
          if (actionVerb === "need") {
            isUrgent = true
          }
          // Set emotion/context for common objects
          if (object === "water") {
            emotion = "need"
            contextualMeaning = "needs water"
          } else if (object === "food") {
            emotion = "need"
            contextualMeaning = "needs food"
          }
        }
      } else {
        actionType = "movement"
      }
    } else if (greetingPhrases.some(phrase => lowerText.includes(phrase))) {
      actionType = "social"
      actionVerb = greetingPhrases.find(phrase => lowerText.includes(phrase)) || "meet"
    }
  }

  // Friendly emotion detection
  if (friendlyWords.some(word => lowerText.includes(word))) {
    emotion = "friendly"
  }

  // If not set, try to extract object as last noun
  if (!object) {
    const nounTerms = doc.nouns().out('array')
    if (nounTerms.length > 0) {
      object = nounTerms[nounTerms.length - 1].toLowerCase()
      if (object === subject) object = null
    }
  }

  // If action is 'want' or 'need', look for an infinitive verb as the object
  if ((actionVerb === 'want' || actionVerb === 'need') && !object) {
    const infinitive = doc.match('to #Verb').text();
    if (infinitive) {
      object = infinitive.replace(/^to /, '').toLowerCase();
    }
  }

  // Compose the result
  const components: ParsedComponents = {
    speaker,
    subject,
    subjectEntity,
    action: {
      type: actionType || "unknown",
      verb: actionVerb || "unknown"
    },
    object,
    isQuestion,
    isNegated,
    isUrgent,
    emotion,
    contextualMeaning
  }
  console.log('Parsed components:', components)
  return components
}

export async function translateToEmoji(text: string): Promise<string> {
  console.log('Translating text:', text)
  const components = parseInput(text)
  // This function might no longer be necessary if enhancedTranslateToEmoji is the primary translation method
  // For now, let's keep it but acknowledge it might be refactored later.
  const result = await composeEmojiSequence(components)
  console.log('Translation result:', result)
  return result.sequence
}

export async function enhancedTranslateToEmoji(text: string) {
  const components = parseInput(text);
  const result = composeEmojiSequenceWithScoring(components);
  const analysis = analyzeUniversalityScore(result);
  return {
    emojiSequence: result.sequence,
    universalityAnalysis: analysis,
    shouldShowWarning: result.shouldWarn
  };
}

// Example usage:
// translateToEmoji("I want water") -> "👤➡️💧"
// translateToEmoji("Water please") -> "👤➡️💧"
// translateToEmoji("Where are you?") -> "❓👤👈"
// translateToEmoji("I need help") -> "👤❗❗❗"
// translateToEmoji("I am scared") -> "👤💢😱" 