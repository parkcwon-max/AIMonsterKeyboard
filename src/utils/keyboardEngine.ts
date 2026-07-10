import { MLModelStats } from '../types';
import { DICTIONARY_KO, DICTIONARY_EN, getLevenshteinDistance } from './hangul';

/**
 * Common typo mappings for high-fidelity autocorrection demos.
 */
export const COMMON_TYPOS: Record<string, string> = {
  // Korean typos
  '안녀하세여': '안녕하세요',
  '안녕하새요': '안녕하세요',
  '감사합니당': '감사합니다',
  '감사함니다': '감사합니다',
  '반갑습니당': '반갑습니다',
  '반갑슴니다': '반갑습니다',
  '앙대요': '안돼요',
  '오늘도': '오늘',
  '맞춤법이': '맞춤법',
  '스마트폰이': '스마트폰',
  '머신러닝이': '머신러닝',
  
  // English typos
  'teh': 'the',
  'thx': 'thanks',
  'tks': 'thanks',
  'tomorow': 'tomorrow',
  'yasterday': 'yesterday',
  'computar': 'computer',
  'keybord': 'keyboard',
  'custum': 'custom',
  'helou': 'hello',
  'dont': "don't",
  'aint': "ain't"
};

/**
 * Suggests autocompletions for a word prefix based on the dictionary and ML frequency.
 */
export function getAutocompleteSuggestions(
  currentWord: string,
  isKorean: boolean,
  mlStats: MLModelStats
): string[] {
  if (!currentWord || currentWord.trim() === '') return [];

  const dict = isKorean ? DICTIONARY_KO : DICTIONARY_EN;
  const wordLower = currentWord.toLowerCase();
  const suggestions: Set<string> = new Set();

  // 1. Check common typos first
  if (COMMON_TYPOS[currentWord]) {
    suggestions.add(COMMON_TYPOS[currentWord]);
  }

  // 2. Check ML learned words that start with prefix
  const learnedMatching = Object.keys(mlStats.wordFrequencies)
    .filter(word => word.toLowerCase().startsWith(wordLower))
    .sort((a, b) => mlStats.wordFrequencies[b] - mlStats.wordFrequencies[a]);
  
  for (const word of learnedMatching) {
    suggestions.add(word);
    if (suggestions.size >= 4) break;
  }

  // 3. Fall back to standard dictionary
  const dictMatching = dict
    .filter(word => word.toLowerCase().startsWith(wordLower))
    .sort((a, b) => a.length - b.length); // prefer shorter matches

  for (const word of dictMatching) {
    suggestions.add(word);
    if (suggestions.size >= 5) break;
  }

  // 4. If suggestions are scarce, search by Levenshtein distance
  if (suggestions.size < 3) {
    const sortedByDist = [...dict]
      .map(word => ({ word, dist: getLevenshteinDistance(wordLower, word.toLowerCase()) }))
      .filter(item => item.dist <= 2)
      .sort((a, b) => a.dist - b.dist)
      .map(item => item.word);

    for (const word of sortedByDist) {
      suggestions.add(word);
      if (suggestions.size >= 5) break;
    }
  }

  return Array.from(suggestions).slice(0, 3);
}

/**
 * Predicts the next word given the previously typed word.
 * Uses ML transition statistics first, then falls back to common pairs.
 */
export function predictNextWords(
  lastWord: string,
  isKorean: boolean,
  mlStats: MLModelStats
): string[] {
  if (!lastWord) return [];

  const wordClean = lastWord.trim();
  const predictions: Set<string> = new Set();

  // 1. Check ML transitions
  const transitions = mlStats.wordTransitions[wordClean];
  if (transitions) {
    const sortedTransitions = Object.keys(transitions)
      .sort((a, b) => transitions[b] - transitions[a]);
    
    for (const word of sortedTransitions) {
      predictions.add(word);
      if (predictions.size >= 3) break;
    }
  }

  // 2. Common language transitions fallbacks
  const commonKoPairs: Record<string, string[]> = {
    '안녕하세요': ['반갑습니다', '오늘', '좋은 아침'],
    '오늘': ['날씨', '점심', '하루', '뭐해'],
    '내일': ['만나자', '날씨', '시간', '가자'],
    '지금': ['바빠요', '어디야', '가는 중', '출발'],
    '감사합니다': ['좋은 하루', '축하합니다', '수고하셨습니다'],
    '맞춤법': ['교정', '검사', '추천'],
    '키보드': ['테마', '추천', '스킨']
  };

  const commonEnPairs: Record<string, string[]> = {
    'hello': ['there', 'friend', 'world'],
    'thank': ['you', 'your', 'everyone'],
    'thanks': ['for', 'a lot', 'anyway'],
    'today': ['is', 'was', 'weather'],
    'tomorrow': ['is', 'morning', 'afternoon'],
    'where': ['are', 'is', 'did'],
    'what': ['are', 'is', 'about'],
    'how': ['are', 'about', 'is'],
    'good': ['morning', 'night', 'day', 'luck']
  };

  const pairSource = isKorean ? commonKoPairs : commonEnPairs;
  const fallback = pairSource[wordClean];
  if (fallback) {
    for (const word of fallback) {
      predictions.add(word);
      if (predictions.size >= 3) break;
    }
  }

  // 3. Fallback to general frequent dictionary words
  const defaultKo = ['오늘', '지금', '감사합니다'];
  const defaultEn = ['the', 'you', 'it'];
  const defaults = isKorean ? defaultKo : defaultEn;

  for (const word of defaults) {
    predictions.add(word);
    if (predictions.size >= 3) break;
  }

  return Array.from(predictions).slice(0, 3);
}

/**
 * Finds the most likely typo word in a full sentence and corrects it.
 * This is used for the [수정] correct button logic.
 */
export function getSentenceCorrection(
  sentence: string,
  isKorean: boolean
): { original: string; corrected: string; sentence: string } | null {
  if (!sentence || sentence.trim() === '') return null;

  // Split sentence into words (어절)
  const words = sentence.trim().split(/\s+/);
  if (words.length === 0) return null;

  // Search words from right-to-left (most recently typed word)
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    
    // Clean word from punctuation
    const wordClean = word.replace(/[.,?!~']/g, '');
    if (!wordClean) continue;

    // 1. Direct typo match
    if (COMMON_TYPOS[wordClean]) {
      const correctedWord = COMMON_TYPOS[wordClean];
      words[i] = word.replace(wordClean, correctedWord);
      return {
        original: wordClean,
        corrected: correctedWord,
        sentence: words.join(' ')
      };
    }

    // 2. Levenshtein dictionary check
    const dict = isKorean ? DICTIONARY_KO : DICTIONARY_EN;
    let closestWord = null;
    let minDistance = 2; // Strict threshold for similarity

    for (const dictWord of dict) {
      const dist = getLevenshteinDistance(wordClean, dictWord);
      if (dist < minDistance) {
        minDistance = dist;
        closestWord = dictWord;
      }
    }

    if (closestWord) {
      words[i] = word.replace(wordClean, closestWord);
      return {
        original: wordClean,
        corrected: closestWord,
        sentence: words.join(' ')
      };
    }
  }

  return null;
}
