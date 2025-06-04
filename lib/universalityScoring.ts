import { UNIVERSAL_SYMBOLS } from './emojiParser';

// 1. UNIVERSALITY TIER DEFINITIONS
export const UNIVERSALITY_TIERS = {
  TIER_1_UNIVERSAL: {
    score: 5,
    description: "Pure physics/math - understood by any intelligent species",
    emojis: [
      // Mathematical/geometric symbols
      "●", "○", "◯", "⚫", "⭕", "⬜", "🟫",
      // Directional/movement (physics)
      "➡️", "⬅️", "⬆️", "⬇️", "↔️", "↕️", "🔄",
      // Energy/matter states
      "⚡", "💧", "🔥", "❄️", "💨", "🧊",
      // Mathematical operators
      "➕", "➖", "=", "❌", "✅"
    ]
  },
  TIER_2_NATURAL: {
    score: 4,
    description: "Natural phenomena - observable across planets",
    emojis: [
      // Celestial/environmental
      "☀️", "🌑", "⭐", "🌌",
      // Natural forces/phenomena
      "💥", "✨", "⚠️", "📈", "📉"
    ]
  },
  TIER_3_FUNCTIONAL: {
    score: 3,
    description: "Functional symbols - recognizable purposes",
    emojis: [
      // Tools/mechanical
      "🔧", "⚙️", "🔋", "🏠", "🌡️",
      // Information/communication
      "💡", "❓", "📍", "📌", "🆘",
      // Controls/interfaces
      "⏹️", "⏰", "⏪", "⏩", "🔊", "🔇"
    ]
  },
  TIER_4_BIOLOGICAL: {
    score: 2,
    description: "Biological concepts - if aliens are organic",
    emojis: [
      // Body parts/senses
      "👁️", "👂", "🧠",
      // Biological states
      "😴", "🐌"
    ]
  },
  TIER_5_CULTURAL: {
    score: 1,
    description: "Cultural symbols - use only when necessary",
    emojis: [
      // Human gestures/customs
      "👋", "🔚", "📚",
      // Cultural objects
      "🏠" // (when used as house vs shelter)
    ]
  }
};

// 2. SCORING FUNCTION
export function getUniversalityScore(emoji: string): number {
  for (const tier of Object.values(UNIVERSALITY_TIERS)) {
    if (tier.emojis.includes(emoji)) {
      return tier.score;
    }
  }
  return 0; // Unknown/unscored emoji
}

export function getTierName(emoji: string): string {
  for (const [tierName, tierData] of Object.entries(UNIVERSALITY_TIERS)) {
    if (tierData.emojis.includes(emoji)) {
      return tierName;
    }
  }
  return "UNSCORED";
}

// 3. ENHANCED EMOJI SELECTION WITH SCORING
export function selectBestEmoji(concept: string, candidateEmojis: string[]): string {
  console.log(`Selecting best emoji for concept: ${concept}, candidates: ${candidateEmojis}`);
  if (candidateEmojis.length === 0) { console.log('No candidates, returning ❓'); return "❓"; }
  if (candidateEmojis.length === 1) { console.log(`Only one candidate: ${candidateEmojis[0]}`); return candidateEmojis[0]; }

  // Score each candidate emoji
  const scoredCandidates = candidateEmojis.map(emoji => ({
    emoji,
    score: getUniversalityScore(emoji),
    tier: getTierName(emoji)
  }));

  console.log('Scored candidates:', scoredCandidates);

  // Sort by score (highest first)
  scoredCandidates.sort((a, b) => b.score - a.score);

  console.log('Sorted candidates:', scoredCandidates);

  // Return the highest scoring emoji
  console.log('Selected emoji:', scoredCandidates[0].emoji);
  return scoredCandidates[0].emoji;
}

// 4. ENHANCED CONCEPT-TO-EMOJI MAPPING
export function getUniversalEmojiWithScoring(concept: string, context: Record<string, any> = {}): string {
  const candidates: string[] = [];
  const lowerConcept = concept.toLowerCase(); // Ensure concept is lowercase for lookup

  console.log(`Getting universal emoji for concept: ${concept}`);

  // Check direct mapping in UNIVERSAL_SYMBOLS (using lowercase concept)
  for (const category in UNIVERSAL_SYMBOLS) {
    if (Object.prototype.hasOwnProperty.call(UNIVERSAL_SYMBOLS, category)) {
      const mapping = UNIVERSAL_SYMBOLS[category as keyof typeof UNIVERSAL_SYMBOLS] as Record<string, string>;
      if (mapping[lowerConcept]) {
        candidates.push(mapping[lowerConcept]);
        console.log(`Found direct mapping in category ${category}: ${mapping[lowerConcept]}`);
      }
    }
  }

  // Add contextual alternatives based on concept (using lowercase concept)
  const contextualCandidates = getContextualCandidates(lowerConcept, context);
  console.log('Contextual candidates:', contextualCandidates);
  candidates.push(...contextualCandidates);

  // Remove duplicates
  const uniqueCandidates = [...new Set(candidates)];
  console.log('Unique candidates:', uniqueCandidates);

  // Select best emoji based on universality score
  return selectBestEmoji(concept, uniqueCandidates); // Pass original concept or lowercase? Let's use original for selectBestEmoji debug if needed.
}

export function getContextualCandidates(concept: string, context: Record<string, any> = {}): string[] {
  const candidates: string[] = [];

  // Example: "food" concept
  if (concept === "food" || concept === "eat" || concept === "hungry") {
    candidates.push("🔋");  // Energy (Tier 3) - preferred
    // candidates.push("🍎");  // Apple (Cultural) - fallback (not in universal set)
  }

  // Example: "person" concept
  if (concept === "person" || concept === "human" || concept === "i") { // Added 'i'
    candidates.push("●");   // Mathematical dot (Tier 1) - preferred
    // candidates.push("👤"); // Person silhouette (Cultural) - fallback (not in universal set)
  }

  // Example: "hot" concept
  if (concept === "hot" || concept === "warm") {
    candidates.push("🔥");  // Fire (Tier 1) - preferred
    candidates.push("🌡️"); // Thermometer (Tier 3) - alternative
  }

  // Add contextual mapping for "need" verb
  if (concept === "need") {
      candidates.push("⬅️"); // Representing "take" or "acquire" (Tier 1)
  }

  // Add more contextual mappings as needed

  return candidates;
}

// 5. ENHANCED COMPOSITION LOGIC
export function composeEmojiSequenceWithScoring(parsedComponents: any) {
  const sequence: string[] = [];
  let totalUniversalityScore = 0;
  let emojiCount = 0;

  console.log('Composing with scoring for components:', parsedComponents);

  // 1. Handle Subject (Entity)
  if (parsedComponents.subject) {
    const emoji = getUniversalEmojiWithScoring(parsedComponents.subject);
    sequence.push(emoji);
    totalUniversalityScore += getUniversalityScore(emoji);
    emojiCount++;
  }

  let actionOrObjectAdded = false;

  // 2. Handle Action (Verb) or Object
  // Prioritize adding an action or object if they exist
  if (parsedComponents.action?.verb) {
      const emoji = getUniversalEmojiWithScoring(parsedComponents.action.verb);
      sequence.push(emoji);
      totalUniversalityScore += getUniversalityScore(emoji);
      emojiCount++;
      actionOrObjectAdded = true;
  }

  // Add object if it exists AND it wasn't already handled as the action verb (e.g., infinitive objects)
  // or if there was no action verb
  if (parsedComponents.object && parsedComponents.object !== parsedComponents.action?.verb) {
      const emoji = getUniversalEmojiWithScoring(parsedComponents.object);
      sequence.push(emoji);
      totalUniversalityScore += getUniversalityScore(emoji);
      emojiCount++;
      actionOrObjectAdded = true;
  }

  // 3. Handle Emotion or Contextual Meaning ONLY if no primary action or object was added
  // This avoids double-counting concepts like 'need' when it's both action and emotion.
  if (!actionOrObjectAdded && (parsedComponents.emotion || parsedComponents.contextualMeaning)) {
       // For simplicity, let's try mapping the emotion or contextual meaning string
       // A more complex approach would be needed for nuanced emotion representation
       const conceptToMap = parsedComponents.emotion || parsedComponents.contextualMeaning;
       if (conceptToMap) {
            const emoji = getUniversalEmojiWithScoring(conceptToMap);
            if (emoji && emoji !== "❓") { // Only add if a specific emoji is found
               sequence.push(emoji);
               totalUniversalityScore += getUniversalityScore(emoji);
               emojiCount++;
            }
       }
  }

  // Calculate average universality score
  const averageScore = emojiCount > 0 ? totalUniversalityScore / emojiCount : 0;

  // Add warning if average score is too low
  const shouldWarn = averageScore < 3; // Below Tier 3

  return {
    sequence: sequence.join(" "),
    universalityScore: averageScore,
    shouldWarn,
    breakdown: sequence.map(emoji => ({
      emoji,
      score: getUniversalityScore(emoji),
      tier: getTierName(emoji)
    }))
  };
}

// 6. SCORING ANALYTICS & FEEDBACK
export function analyzeUniversalityScore(result: any) {
  const { universalityScore, breakdown } = result;

  let feedback = "";

  if (universalityScore >= 4.5) {
    feedback = "Excellent universality! This message uses highly universal symbols.";
  } else if (universalityScore >= 3.5) {
    feedback = "Good universality. Most symbols should be recognizable.";
  } else if (universalityScore >= 2.5) {
    feedback = "Moderate universality. Some symbols may need cultural context.";
  } else {
    feedback = "Low universality. Consider using more universal symbols.";
  }

  // Identify problematic emojis
  const lowScoreEmojis = breakdown.filter((item: any) => item.score <= 2);
  if (lowScoreEmojis.length > 0) {
    feedback += ` Consider alternatives for: ${lowScoreEmojis.map((item: any) => item.emoji).join(" ")}`;
  }

  return {
    score: universalityScore,
    feedback,
    lowScoreEmojis,
    tierBreakdown: breakdown
  };
}

// 7. INTEGRATION EXAMPLE
export function enhancedTranslateToEmoji(inputText: string) {
  // Your existing parsing logic
  // Import parseInput from emojiParser
  // (imported at usage site)
  // const parsedComponents = parseInput(inputText);
  // Enhanced composition with scoring
  // const result = composeEmojiSequenceWithScoring(parsedComponents);
  // Analyze the result
  // const analysis = analyzeUniversalityScore(result);
  // return {
  //   emojiSequence: result.sequence,
  //   universalityAnalysis: analysis,
  //   shouldShowWarning: result.shouldWarn
  // };
  // (see usage in emojiParser.ts)
} 