/**
 * Hangul Composer Utility
 * Supports QWERTY, Cheonjiin, and Naratgul input methods.
 */

// Cho (Initial) Jamos
export const CHO_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// Jung (Medial) Jamos
export const JUNG_LIST = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

// Jong (Final) Jamos
export const JONG_LIST = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// Double consonant mapping
export const DOUBLE_CONSONANTS: Record<string, string> = {
  'ㄱ': 'ㄲ',
  'ㄷ': 'ㄸ',
  'ㅂ': 'ㅃ',
  'ㅅ': 'ㅆ',
  'ㅈ': 'ㅉ',
  'ㄲ': 'ㄱ',
  'ㄸ': 'ㄷ',
  'ㅃ': 'ㅂ',
  'ㅆ': 'ㅅ',
  'ㅉ': 'ㅈ'
};

// Stroke additions
export const STROKE_ADDITIONS: Record<string, string> = {
  // Consonants
  'ㄱ': 'ㅋ',
  'ㅋ': 'ㄲ',
  'ㄴ': 'ㄷ',
  'ㄷ': 'ㅌ',
  'ㅌ': 'ㄸ',
  'ㅁ': 'ㅂ',
  'ㅂ': 'ㅍ',
  'ㅍ': 'ㅃ',
  'ㅅ': 'ㅈ',
  'ㅈ': 'ㅊ',
  'ㅊ': 'ㅉ',
  'ㅇ': 'ㅎ',
  
  // Vowels
  'ㅏ': 'ㅑ',
  'ㅓ': 'ㅕ',
  'ㅗ': 'ㅛ',
  'ㅜ': 'ㅠ',
  'ㅐ': 'ㅒ',
  'ㅔ': 'ㅖ',
  'ㅑ': 'ㅏ',
  'ㅕ': 'ㅓ',
  'ㅛ': 'ㅗ',
  'ㅠ': 'ㅜ'
};

// Compound vowels mapping (when two vowels are entered sequentially)
export const COMPOUND_VOWELS: Record<string, string> = {
  'ㅗㅏ': 'ㅘ',
  'ㅗㅐ': 'ㅙ',
  'ㅗㅣ': 'ㅚ',
  'ㅜㅓ': 'ㅝ',
  'ㅜㅔ': 'ㅞ',
  'ㅜㅣ': 'ㅟ',
  'ㅡㅣ': 'ㅢ',
  'ㅏㅣ': 'ㅐ',
  'ㅓㅣ': 'ㅔ',
  'ㅑㅣ': 'ㅒ',
  'ㅕㅣ': 'ㅖ',
  'ㅘㅣ': 'ㅙ',
  'ㅝㅣ': 'ㅞ'
};

// Geomjigeul compound vowels mapping (ㅣ-based visual combinations)
export const GEOMJIGEUL_COMPOUND_VOWELS: Record<string, string> = {
  'ㅣㅏ': 'ㅑ',
  'ㅣㅓ': 'ㅕ',
  'ㅣㅗ': 'ㅛ',
  'ㅣㅜ': 'ㅠ',
  'ㅡㅣ': 'ㅢ'
};

/**
 * Pre-processes a flat sequence of Jamos to combine Geomjigeul-specific vowels.
 */
export function composeGeomjigeulVowels(jamos: string[]): string[] {
  let resolved: string[] = [];
  let i = 0;
  while (i < jamos.length) {
    if (i + 1 < jamos.length) {
      const combined = jamos[i] + jamos[i + 1];
      if (GEOMJIGEUL_COMPOUND_VOWELS[combined]) {
        resolved.push(GEOMJIGEUL_COMPOUND_VOWELS[combined]);
        i += 2;
        continue;
      }
    }
    resolved.push(jamos[i]);
    i++;
  }
  return resolved;
}

// Compound final consonants mapping
export const COMPOUND_JONGS: Record<string, string> = {
  'ㄱㅅ': 'ㄳ',
  'ㄴㅈ': 'ㄵ',
  'ㄴㅎ': 'ㄶ',
  'ㄹㄱ': 'ㄺ',
  'ㄹㅁ': 'ㄻ',
  'ㄹㅂ': 'ㄼ',
  'ㄹㅅ': 'ㄽ',
  'ㄹㅌ': 'ㄾ',
  'ㄹㅍ': 'ㄿ',
  'ㄹㅎ': 'ㅀ',
  'ㅂㅅ': 'ㅄ'
};

// Map Dubeolsik (English keyboard layout keys) to Jamos
export const ENGLISH_TO_KOREAN: Record<string, string> = {
  'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
  'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
  'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
  'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
  'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'b': 'ㅠ',
  'n': 'ㅜ', 'm': 'ㅡ',
  'Q': 'ㅃ', 'W': 'ㅉ', 'E': 'ㄸ', 'R': 'ㄲ', 'T': 'ㅆ',
  'O': 'ㅒ', 'P': 'ㅖ'
};

/**
 * Checks if a Jamo is a vowel.
 */
export function isVowel(jamo: string): boolean {
  return JUNG_LIST.includes(jamo) || ['ㅣ', '·', 'ㅡ', 'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅛ', 'ㅠ', 'ㅑ', 'ㅕ', 'ㅐ', 'ㅔ', 'ㅒ', 'ㅖ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ'].includes(jamo);
}

/**
 * Reconstructs compound vowel from Cheonjiin vowel keys.
 * Inputs: Array of 'ㅣ', '·', 'ㅡ'
 * Returns: Array of equivalent composite vowels.
 */
export function composeCheonjiinVowels(keys: string[]): string {
  let text = keys.join('');
  
  // Custom Cheonjiin vowel mapping rules:
  // ㅣ + · -> ㅏ
  // · + ㅣ -> ㅓ
  // ㅣ + · + · -> ㅑ
  // · + · + ㅣ -> ㅕ
  // ㅡ + · -> ㅜ
  // · + ㅡ -> ㅗ
  // ㅡ + · + · -> ㅠ
  // · + · + ㅡ -> ㅛ
  // ㅣ + ㅡ -> ㅢ
  
  // Replace combinations in order of length
  const replacements: Array<[string, string]> = [
    ['ㅣ··', 'ㅑ'],
    ['··ㅣ', 'ㅕ'],
    ['ㅡ··', 'ㅠ'],
    ['··ㅡ', 'ㅛ'],
    ['ㅣ·', 'ㅏ'],
    ['·ㅣ', 'ㅓ'],
    ['ㅡ·', 'ㅜ'],
    ['·ㅡ', 'ㅗ'],
    ['ㅣㅡ', 'ㅢ']
  ];
  
  for (const [pattern, replacement] of replacements) {
    while (text.includes(pattern)) {
      text = text.replace(pattern, replacement);
    }
  }
  
  // Apply compounding vowels e.g. ㅏ + ㅣ -> ㅐ
  let chars = Array.from(text);
  let resolved: string[] = [];
  
  for (let i = 0; i < chars.length; i++) {
    let current = chars[i];
    if (resolved.length > 0) {
      let last = resolved[resolved.length - 1];
      let combined = last + current;
      if (COMPOUND_VOWELS[combined]) {
        resolved[resolved.length - 1] = COMPOUND_VOWELS[combined];
        continue;
      }
    }
    resolved.push(current);
  }
  
  return resolved.join('');
}

/**
 * Pre-processes a flat sequence of Jamos to resolve Cheonjiin-specific vowel input sequences.
 */
export function resolveCheonjiinBuffer(buffer: string[]): string[] {
  const resolved: string[] = [];
  let tempVowels: string[] = [];
  
  for (const item of buffer) {
    if (item === 'ㅣ' || item === '·' || item === 'ㅡ') {
      tempVowels.push(item);
    } else {
      if (tempVowels.length > 0) {
        const composedVowel = composeCheonjiinVowels(tempVowels);
        resolved.push(...Array.from(composedVowel));
        tempVowels = [];
      }
      resolved.push(item);
    }
  }
  if (tempVowels.length > 0) {
    const composedVowel = composeCheonjiinVowels(tempVowels);
    resolved.push(...Array.from(composedVowel));
  }
  return resolved;
}

/**
 * Assembles a flat sequence of Hangul Jamos into a fully composed string.
 * Implements standard Hangul Automaton logic.
 */
export function assembleJamos(jamoSeq: string[]): string {
  if (jamoSeq.length === 0) return '';
  
  let result = '';
  let i = 0;
  
  while (i < jamoSeq.length) {
    let cho = -1;
    let jung = -1;
    let jong = -1;
    
    // 1. Find Consonant for Cho (Initial)
    let char = jamoSeq[i];
    if (isVowel(char)) {
      // Vowel starts without consonant (standalone vowel syllable)
      // Check compound vowels
      let vowel = char;
      i++;
      while (i < jamoSeq.length && isVowel(jamoSeq[i])) {
        let combined = vowel + jamoSeq[i];
        if (COMPOUND_VOWELS[combined]) {
          vowel = COMPOUND_VOWELS[combined];
          i++;
        } else {
          break;
        }
      }
      result += vowel;
      continue;
    }
    
    // Consonant found
    cho = CHO_LIST.indexOf(char);
    if (cho === -1) {
      // Non-hangul or weird character
      result += char;
      i++;
      continue;
    }
    
    let choChar = char;
    i++;
    
    // 2. Expect Vowel for Jung (Medial)
    if (i < jamoSeq.length && isVowel(jamoSeq[i])) {
      let vowel = jamoSeq[i];
      i++;
      // Check compound vowels
      while (i < jamoSeq.length && isVowel(jamoSeq[i])) {
        let combined = vowel + jamoSeq[i];
        if (COMPOUND_VOWELS[combined]) {
          vowel = COMPOUND_VOWELS[combined];
          i++;
        } else {
          break;
        }
      }
      jung = JUNG_LIST.indexOf(vowel);
      
      // 3. Expect Jong (Final) or next syllables
      if (i < jamoSeq.length && !isVowel(jamoSeq[i])) {
        // We have a consonant. Is it a final consonant, or start of next syllable?
        // To be a final consonant, either it is followed by nothing, by a non-vowel,
        // or if followed by a vowel, it is split (the vowel takes the consonant).
        let nextConsonant = jamoSeq[i];
        let hasVowelAfter = false;
        
        // Peek ahead to see if a vowel follows nextConsonant
        if (i + 1 < jamoSeq.length && isVowel(jamoSeq[i + 1])) {
          hasVowelAfter = true;
        }
        
        if (hasVowelAfter) {
          // The next consonant must be the Cho of the next syllable.
          // So this syllable has NO final consonant.
          let code = 0xAC00 + (cho * 21 + jung) * 28;
          result += String.fromCharCode(code);
          continue;
        } else {
          // This consonant might be Jong
          let tempJong = JONG_LIST.indexOf(nextConsonant);
          if (tempJong !== -1) {
            jong = tempJong;
            i++;
            
            // Can it be compound final consonant? (e.g., ㄱ + ㅅ = ㄳ)
            if (i < jamoSeq.length && !isVowel(jamoSeq[i])) {
              let nextNextConsonant = jamoSeq[i];
              let hasVowelAfter2 = (i + 1 < jamoSeq.length && isVowel(jamoSeq[i + 1]));
              
              if (hasVowelAfter2) {
                // The next-next consonant belongs to the next syllable.
                // But wait, can we split a compound final consonant?
                // e.g. 닭 + 은 -> 달 + 근 (ㄹ belongs to 닭, ㄱ moves to 은)
                let compoundKey = nextConsonant + nextNextConsonant;
                if (COMPOUND_JONGS[compoundKey]) {
                  // Split it!
                  // Current syllable ends with first part of compound (ㄹ -> 8 in JONG)
                  let splitFirst = JONG_LIST.indexOf(nextConsonant);
                  let code = 0xAC00 + (cho * 21 + jung) * 28 + splitFirst;
                  result += String.fromCharCode(code);
                  
                  // Next syllable starts with the second part of compound as CHO
                  // i remains pointing to nextNextConsonant so the outer loop handles it.
                  continue;
                }
              } else {
                let compoundKey = nextConsonant + nextNextConsonant;
                if (COMPOUND_JONGS[compoundKey]) {
                  jong = JONG_LIST.indexOf(COMPOUND_JONGS[compoundKey]);
                  i++;
                }
              }
            }
            
            // Build the character with final consonant
            let code = 0xAC00 + (cho * 21 + jung) * 28 + jong;
            result += String.fromCharCode(code);
          } else {
            // Cannot be a final consonant, build without it
            let code = 0xAC00 + (cho * 21 + jung) * 28;
            result += String.fromCharCode(code);
          }
        }
      } else {
        // No consonant after vowel, build character
        let code = 0xAC00 + (cho * 21 + jung) * 28;
        result += String.fromCharCode(code);
      }
    } else {
      // Just a standalone consonant
      result += choChar;
    }
  }
  
  return result;
}

/**
 * Calculates Levenshtein distance between two strings.
 * Used for autocorrection [수정] button similarity matching.
 */
export function getLevenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // Deletion
          dp[i][j - 1] + 1,     // Insertion
          dp[i - 1][j - 1] + 1  // Substitution
        );
      }
    }
  }
  return dp[m][n];
}

/**
 * Custom dictionary for autocorrection & predictive recommendations
 */
export const DICTIONARY_KO = [
  '안녕하세요', '감사합니다', '반갑습니다', '오늘', '내일', '어제', '지금', '어디야', '뭐해',
  '바빠요', '사랑해', '화이팅', '좋은 하루', '축하합니다', '죄송합니다', '맞춤법', '자동완성',
  '스마트폰', '컴퓨터', '키보드', '나중에 연락드릴게요', '알겠습니다', '커스텀', '인공지능',
  '안녕히 주무세요', '밥 먹었어', '조심히 들어가세요', '수고하셨습니다', '대한민국', '한국어', '영어'
];

export const DICTIONARY_EN = [
  'hello', 'thanks', 'thank you', 'welcome', 'today', 'tomorrow', 'yesterday', 'now', 'where', 'busy',
  'what', 'doing', 'love', 'congrats', 'sorry', 'autocorrect', 'autocomplete', 'smartphone', 'computer',
  'keyboard', 'custom', 'artificial', 'intelligence', 'goodnight', 'have a nice day', 'see you later',
  'understand', 'perfect', 'awesome', 'amazing', 'beautiful', 'korean', 'english'
];

/**
 * Suggests the closest word from a dictionary using Levenshtein distance.
 * Returns null if no close matches found.
 */
export function findClosestCorrection(word: string, isKorean: boolean): string | null {
  if (!word) return null;
  const dict = isKorean ? DICTIONARY_KO : DICTIONARY_EN;
  let bestWord = null;
  let minDistance = 3; // Maximum distance to consider a correction
  
  for (const dictWord of dict) {
    const dist = getLevenshteinDistance(word, dictWord);
    if (dist < minDistance) {
      minDistance = dist;
      bestWord = dictWord;
    }
  }
  return bestWord;
}
