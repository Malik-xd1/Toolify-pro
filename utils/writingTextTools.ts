// Text & Writing Processing Suite for ToolifyPro

export function removeExtraSpaces(text: string): string {
  return text
    .replace(/[ \t]+/g, " ") // Collapse multiple spaces and tabs to single space
    .replace(/\n\s+\n/g, "\n\n") // Collapse blank lines with whitespace
    .replace(/\n{3,}/g, "\n\n") // Max two consecutive newlines
    .trim();
}

export function findAndReplace(
  text: string,
  search: string,
  replacement: string,
  options: { caseSensitive?: boolean; wholeWord?: boolean; useRegex?: boolean } = {}
): { result: string; count: number } {
  if (!search) return { result: text, count: 0 };

  let flags = "g";
  if (!options.caseSensitive) flags += "i";

  let pattern = search;
  if (!options.useRegex) {
    // Escape regex special chars
    pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  if (options.wholeWord) {
    pattern = `\\b${pattern}\\b`;
  }

  const regex = new RegExp(pattern, flags);
  const matches = text.match(regex);
  const count = matches ? matches.length : 0;
  const result = text.replace(regex, replacement);

  return { result, count };
}

export interface GrammarIssue {
  type: "grammar" | "style" | "clarity";
  message: string;
  suggestion: string;
  offset: number;
  word: string;
}

export function checkGrammarAndStyle(text: string): { score: number; issues: GrammarIssue[] } {
  const issues: GrammarIssue[] = [];

  // Common grammar rules & cliches
  const rules = [
    { pattern: /\b(their|there|they're)\b\s+(is|are)\b/gi, msg: "Check homophone agreement (their/there/they're)", sug: "Verify context" },
    { pattern: /\b(could of|should of|would of)\b/gi, msg: "Incorrect modal construction", sug: "could have / should have / would have" },
    { pattern: /\b(in order to)\b/gi, msg: "Wordy phrase", sug: "to" },
    { pattern: /\b(due to the fact that)\b/gi, msg: "Wordy phrase", sug: "because" },
    { pattern: /\b(at this point in time)\b/gi, msg: "Wordy phrase", sug: "now / currently" },
    { pattern: /\b(very unique|more unique)\b/gi, msg: "'Unique' is an absolute adjective", sug: "unique / unusual" },
    { pattern: /\b(irregardless)\b/gi, msg: "Non-standard word", sug: "regardless" },
  ];

  for (const r of rules) {
    let match;
    while ((match = r.pattern.exec(text)) !== null) {
      issues.push({
        type: "grammar",
        message: r.msg,
        suggestion: r.sug,
        offset: match.index,
        word: match[0],
      });
    }
  }

  const score = Math.max(60, 100 - issues.length * 8);
  return { score, issues };
}

export const COMMON_DICTIONARY = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
  "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
  "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
  "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
  "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "create", "convert",
  "tool", "tools", "online", "platform", "document", "image", "video", "audio", "file", "download",
  "secure", "speed", "fast", "privacy", "system", "website", "code", "development", "project"
]);

export function checkSpelling(text: string): { misspelled: string[]; suggestions: Record<string, string[]> } {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const misspelled = new Set<string>();
  const suggestions: Record<string, string[]> = {};

  for (const w of words) {
    if (!COMMON_DICTIONARY.has(w) && w.length > 3) {
      // Small sample check
      misspelled.add(w);
      suggestions[w] = [`${w}s`, `${w}ed`, `${w}ing`];
    }
  }

  return {
    misspelled: Array.from(misspelled).slice(0, 15),
    suggestions,
  };
}

export function checkPlagiarismScore(text: string): { originalityScore: number; uniquePhrasesPercent: number; wordCount: number } {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  if (wordCount === 0) return { originalityScore: 100, uniquePhrasesPercent: 100, wordCount: 0 };

  // Calculate 3-gram uniqueness
  const triGrams = new Set<string>();
  for (let i = 0; i < words.length - 2; i++) {
    triGrams.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  const totalTriGrams = Math.max(1, words.length - 2);
  const uniquePercent = Math.min(100, Math.round((triGrams.size / totalTriGrams) * 100));
  const score = Math.min(100, Math.max(70, uniquePercent));

  return {
    originalityScore: score,
    uniquePhrasesPercent: uniquePercent,
    wordCount,
  };
}

export function calculateReadingTime(text: string): {
  words: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  fleschScore: number;
  gradeLevel: string;
} {
  const words = (text.match(/\b\w+\b/g) || []).length;
  const sentences = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  const syllables = Math.max(1, Math.round(words * 1.4)); // Average syllables per English word

  // Silent reading pace: ~225 WPM. Speaking pace: ~130 WPM.
  const readingTimeMinutes = parseFloat((words / 225).toFixed(1));
  const speakingTimeMinutes = parseFloat((words / 130).toFixed(1));

  // Flesch Reading Ease formula = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  const flesch = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words))));

  let gradeLevel = "Standard (8th-9th Grade)";
  if (flesch >= 90) gradeLevel = "Very Easy (5th Grade)";
  else if (flesch >= 80) gradeLevel = "Easy (6th Grade)";
  else if (flesch >= 70) gradeLevel = "Fairly Easy (7th Grade)";
  else if (flesch >= 60) gradeLevel = "Standard (8th-9th Grade)";
  else if (flesch >= 50) gradeLevel = "Fairly Difficult (10th-12th Grade)";
  else if (flesch >= 30) gradeLevel = "Difficult (College Level)";
  else gradeLevel = "Very Confusing (Graduate Level)";

  return {
    words,
    readingTimeMinutes,
    speakingTimeMinutes,
    fleschScore: flesch,
    gradeLevel,
  };
}

export function convertTextToSlug(text: string, separator: "-" | "_" = "-"): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric
    .replace(/[\s-]+/g, separator); // Replace spaces and dashes with chosen separator
}
