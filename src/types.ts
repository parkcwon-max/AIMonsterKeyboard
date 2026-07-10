/**
 * Shared Type Definitions for Custom Keyboard Simulator
 */

export type KoreanLayout = 'qwerty' | 'cheonjiin' | 'naratgul' | 'geomjigeul';
export type ActiveApp = 'messages' | 'notes' | 'browser' | 'login' | 'kakaotalk' | 'settings';
export type KeyShape = 'round' | 'pill' | 'square' | 'rectangular' | 'borderless';

export interface CustomTheme {
  id: string;
  name: string;
  isDark: boolean;
  bgType: 'color' | 'gradient' | 'image';
  bgColor: string; // Hex color or CSS gradient
  bgImage?: string; // Image URL
  keyBgColor: string;
  keyTextColor: string;
  accentColor: string;
  keyShape: KeyShape;
}

export interface CannedPhrase {
  id: string;
  text: string;
}

export interface ClipboardItem {
  id: string;
  text: string;
  timestamp: string;
}

export interface KeyboardSettings {
  // Wizard states
  isInstalled: boolean;
  isKeyboardEnabled: boolean;
  isKeyboardSelected: boolean;
  languages: { ko: boolean; en: boolean };
  
  // Customization
  activeKoreanLayout: KoreanLayout;
  keyboardHeight: number; // in pixels (e.g. 240 - 360)
  fontFamily: string;
  fontSize: number; // in px
  vibrateOnPress: boolean;
  soundOnPress: boolean;
  showNextWordSuggestions: boolean;
  preventPasswordHints: boolean;
  
  // Theme
  themeId: string;
  customTheme: CustomTheme;
}

export interface MLModelStats {
  typedWordsCount: number;
  wordFrequencies: Record<string, number>;
  wordTransitions: Record<string, Record<string, number>>;
  correctionsCount: number;
  accuracyRate: number; // percentage
  learnedWords: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'minji';
  text: string;
  timestamp: string;
}
