import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyboardSettings, CustomTheme, CannedPhrase, ClipboardItem, MLModelStats, ActiveApp 
} from './types';
import PhoneSimulator from './components/PhoneSimulator';
import CustomizerPanel from './components/CustomizerPanel';
import VirtualKeyboard from './components/VirtualKeyboard';
import { Sparkles, HelpCircle, Eye, Info, Volume2, ShieldCheck, Cpu, Layout, Palette, Settings, Clipboard, Award, ShieldAlert, Check } from 'lucide-react';

const DEFAULT_SETTINGS: KeyboardSettings = {
  isInstalled: false,
  isKeyboardEnabled: true,
  isKeyboardSelected: true,
  languages: { ko: true, en: true },
  activeKoreanLayout: 'geomjigeul',
  keyboardHeight: 250,
  fontFamily: 'Inter',
  fontSize: 16,
  vibrateOnPress: true,
  soundOnPress: true,
  showNextWordSuggestions: true,
  preventPasswordHints: true,
  themeId: 'slate-dark',
  customTheme: {
    id: 'slate-dark',
    name: 'Slate Dark (기본 다크)',
    isDark: true,
    bgType: 'color',
    bgColor: '#1E1E22',
    keyBgColor: '#2D3139',
    keyTextColor: '#E2E8F0',
    accentColor: '#0ea5e9',
    keyShape: 'rectangular'
  }
};

const INITIAL_PHRASES: CannedPhrase[] = [
  { id: '1', text: '안녕하세요! 지금 바쁩니다.' },
  { id: '2', text: '지금 이동 중입니다. 나중에 연락드리겠습니다.' },
  { id: '3', text: '알겠습니다! 감사합니다.' },
  { id: '4', text: '오늘 저녁 약속 시간 괜찮으신가요?' }
];

export default function App() {
  // Master settings state
  const [settings, setSettings] = useState<KeyboardSettings>(() => {
    const saved = localStorage.getItem('keyboard_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  // Current typed input text inside phone simulator
  const [textValue, setTextValue] = useState('');
  
  // Current active app inside phone simulator
  const [activeApp, setActiveApp] = useState<ActiveApp>('messages');
  
  // Active focused input field in the phone
  const [focusedInputId, setFocusedInputId] = useState<string | null>('msg-input');

  // Phrases list
  const [cannedPhrases, setCannedPhrases] = useState<CannedPhrase[]>(() => {
    const saved = localStorage.getItem('keyboard_phrases');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PHRASES; }
    }
    return INITIAL_PHRASES;
  });

  // Clipboard list
  const [clipboard, setClipboard] = useState<ClipboardItem[]>(() => {
    const saved = localStorage.getItem('keyboard_clipboard');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  // Machine Learning Statistics state
  const [mlStats, setMlStats] = useState<MLModelStats>(() => {
    const saved = localStorage.getItem('keyboard_ml_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { /* ignore */ }
    }
    return {
      typedWordsCount: 0,
      wordFrequencies: {},
      wordTransitions: {},
      correctionsCount: 0,
      accuracyRate: 75,
      learnedWords: []
    };
  });

  // External launcher overlay notification
  const [externalAppNotification, setExternalAppNotification] = useState<string | null>(null);

  // Lifted active tab state for High Density sync
  const [activeTab, setActiveTab] = useState<'wizard' | 'general' | 'theme' | 'phrases' | 'ml' | 'build'>('wizard');
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  
  // Mobile responsive layout and scaling controllers
  const [mobileActiveView, setMobileActiveView] = useState<'simulator' | 'settings'>('simulator');
  const [simulatorScale, setSimulatorScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const isMobile = window.innerWidth < 1024;
      
      if (isMobile) {
        // Safe padding calculation for phone viewports (width and height)
        const scaleX = (window.innerWidth - 24) / 344;
        const scaleY = (window.innerHeight - 100) / 672; // Leave space for header/tabs
        const scaleFactor = Math.min(1, scaleX, scaleY);
        setSimulatorScale(Math.max(0.4, scaleFactor));
      } else {
        // On desktop, check if the viewport height is too small for the full 672px height
        const scaleY = (window.innerHeight - 140) / 672;
        if (scaleY < 1) {
          setSimulatorScale(Math.max(0.5, scaleY));
        } else {
          setSimulatorScale(1);
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 3000);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('keyboard_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('keyboard_phrases', JSON.stringify(cannedPhrases));
  }, [cannedPhrases]);

  useEffect(() => {
    localStorage.setItem('keyboard_clipboard', JSON.stringify(clipboard));
  }, [clipboard]);

  useEffect(() => {
    localStorage.setItem('keyboard_ml_stats', JSON.stringify(mlStats));
  }, [mlStats]);

  // Clean buffers when app changes
  useEffect(() => {
    setTextValue('');
  }, [activeApp]);

  // Add text to Clipboard list
  const addToClipboard = (text: string) => {
    if (!text || text.trim() === '') return;
    
    // Prevent duplicated recent copies
    if (clipboard.length > 0 && clipboard[0].text === text) return;

    const newItem: ClipboardItem = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
    };

    const nextClipboard = [newItem, ...clipboard.slice(0, 9)]; // Keep max 10
    setClipboard(nextClipboard);
  };

  // ML statistics updater
  const updateMLStats = (typedWord: string, prevWord: string) => {
    const wordClean = typedWord.trim();
    if (!wordClean) return;

    setMlStats(prev => {
      const frequencies = { ...prev.wordFrequencies };
      const transitions = { ...prev.wordTransitions };
      
      // Update general frequency
      frequencies[wordClean] = (frequencies[wordClean] || 0) + 1;

      // Update transitions
      if (prevWord) {
        const prevClean = prevWord.trim();
        if (prevClean) {
          if (!transitions[prevClean]) {
            transitions[prevClean] = {};
          }
          transitions[prevClean][wordClean] = (transitions[prevClean][wordClean] || 0) + 1;
        }
      }

      const totalTyped = prev.typedWordsCount + 1;
      
      // Accuracy increases as the model learns more word sequences
      const uniqueWords = Object.keys(frequencies).length;
      let calculatedAccuracy = 75 + Math.min(20, Math.floor(uniqueWords * 0.8) + Math.floor(totalTyped * 0.2));

      return {
        ...prev,
        typedWordsCount: totalTyped,
        wordFrequencies: frequencies,
        wordTransitions: transitions,
        accuracyRate: Math.min(98, calculatedAccuracy)
      };
    });
  };

  const incrementCorrections = () => {
    setMlStats(prev => ({
      ...prev,
      correctionsCount: prev.correctionsCount + 1
    }));
  };

  const clearMLData = () => {
    setMlStats({
      typedWordsCount: 0,
      wordFrequencies: {},
      wordTransitions: {},
      correctionsCount: 0,
      accuracyRate: 75,
      learnedWords: []
    });
  };

  // Preset themes selector
  const handleSelectTheme = (theme: CustomTheme) => {
    setSettings(prev => ({
      ...prev,
      themeId: theme.id,
      customTheme: theme
    }));
  };

  // External launcher simulations
  const handleLaunchExternalApp = (appName: string) => {
    setExternalAppNotification(appName);
    if (appName === '설정') {
      setActiveApp('settings');
      setFocusedInputId(null);
    } else if (appName === '인터넷') {
      setActiveApp('browser');
      setFocusedInputId('browser-input');
    } else if (appName === '음성 검색') {
      setActiveApp('browser');
      setFocusedInputId('browser-input');
    }
    setTimeout(() => {
      setExternalAppNotification(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col overflow-y-auto lg:overflow-hidden bg-slate-950 text-slate-100 font-sans relative antialiased select-none">
      
      {/* 1. Global Visual Background Glows */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-sky-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* 2. Top Header (High Density layout) */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#EF4444] rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow">
            M
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span>MonsterAI Studio</span>
            <span className="text-slate-500 font-normal text-xs">v3.0.0 (Direct Update)</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ML Input Engine Active</span>
          </div>
          <button 
            onClick={() => triggerToast('설정 및 학습 가중치가 로컬 스토리지에 안전하게 기록되었습니다!')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow active:scale-95"
          >
            설정 변경 적용 (Apply)
          </button>
        </div>
      </header>

      {/* Mobile-only Segmented View Switcher */}
      <div className="flex lg:hidden bg-slate-900 border-b border-slate-800 p-1.5 shrink-0 sticky top-0 z-30">
        <button
          onClick={() => setMobileActiveView('simulator')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${mobileActiveView === 'simulator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span>📱</span> 시뮬레이터 (Simulator)
        </button>
        <button
          onClick={() => setMobileActiveView('settings')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${mobileActiveView === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span>⚙️</span> 키보드 앱 관리 센터 (Settings)
        </button>
      </div>

      {/* 3. Main Workspace Row (High Density three-pane view) */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Left Sidebar Pane */}
        <nav className="hidden lg:flex w-64 border-r border-slate-800 bg-slate-900 flex-col p-4 shrink-0 justify-between overflow-y-auto">
          <div className="space-y-6">
            
            {/* System Setup Menu */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">System Setup</div>
              
              <button
                onClick={() => setActiveTab('wizard')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition ${activeTab === 'wizard' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">🚀</span>
                  <span>설치 마법사 (Wizard)</span>
                </span>
                {activeTab === 'wizard' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition ${activeTab === 'general' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">⚙️</span>
                  <span>자판 및 설정 (Layout)</span>
                </span>
                {activeTab === 'general' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab('theme')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition ${activeTab === 'theme' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">🎨</span>
                  <span>테마 스킨 에디터 (Theme)</span>
                </span>
                {activeTab === 'theme' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

            </div>

            {/* Advanced Features Menu */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Advanced Features</div>

              <button
                onClick={() => setActiveTab('phrases')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition ${activeTab === 'phrases' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">🗂️</span>
                  <span>상용구 / 클립 (Macros)</span>
                </span>
                {activeTab === 'phrases' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab('ml')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition ${activeTab === 'ml' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">🧠</span>
                  <span>ML 학습 분석 (Insights)</span>
                </span>
                {activeTab === 'ml' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab('build')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition ${activeTab === 'build' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">📦</span>
                  <span>빌드 및 무삭제 업데이트 (Build)</span>
                </span>
                {activeTab === 'build' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

            </div>

          </div>

          {/* Bottom Settings Overview & Status Checks */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            
            {/* Live Environment Toggle details */}
            <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
              <span>테마 모드</span>
              <span className="font-semibold text-slate-300">
                {settings.customTheme.isDark ? '다크 모드 작동' : '라이트 모드 작동'}
              </span>
            </div>

            {/* Password Shield Status Card */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[9px] text-slate-500 mb-1 font-bold uppercase tracking-wider">Security Shield</div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{settings.preventPasswordHints ? '보안 쉴드 작동' : '보안 쉴드 미작동'}</span>
              </div>
            </div>

            {/* Cloud Storage Card */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <div className="text-indigo-400 text-sm mt-0.5">☁︎</div>
              <div>
                <div className="text-[9px] font-bold text-slate-500 tracking-wider">CLOUD STORAGE</div>
                <div className="text-[10px] text-slate-300 font-mono">Last synced: 방금 전</div>
              </div>
            </div>

          </div>
        </nav>

        {/* Center Device Emulator Space (With amazing radial glow) */}
        <main className={`${mobileActiveView === 'settings' ? 'hidden lg:flex' : 'flex'} flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_70%)] relative`}>
          
          <div className="w-full flex justify-center py-4 overflow-hidden items-center min-h-[350px]">
            <div
              style={{
                transform: `scale(${simulatorScale})`,
                transformOrigin: 'center center',
                width: `${344 * simulatorScale}px`,
                height: `${672 * simulatorScale}px`,
              }}
              className="flex items-center justify-center shrink-0 transition-all duration-150"
            >
              <PhoneSimulator
                settings={settings}
                setSettings={setSettings}
                textValue={textValue}
                setTextValue={setTextValue}
                activeApp={activeApp}
                setActiveApp={setActiveApp}
                focusedInputId={focusedInputId}
                setFocusedInputId={setFocusedInputId}
                cannedPhrases={cannedPhrases.map(p => p.text)}
                addToClipboard={addToClipboard}
                onLaunchExternalApp={handleLaunchExternalApp}
              >
                {/* Embedded Keyboard Custom component inside Phone */}
                <VirtualKeyboard
                  settings={settings}
                  setSettings={setSettings}
                  textValue={textValue}
                  setTextValue={setTextValue}
                  focusedInputId={focusedInputId}
                  setFocusedInputId={setFocusedInputId}
                  clipboard={clipboard.map(c => c.text)}
                  addToClipboard={addToClipboard}
                  mlStats={mlStats}
                  updateMLStats={updateMLStats}
                  incrementCorrections={incrementCorrections}
                  activeApp={activeApp}
                  setActiveApp={setActiveApp}
                  cannedPhrases={cannedPhrases.map(p => p.text)}
                />
              </PhoneSimulator>
            </div>
          </div>

          {/* Automata and Core highlights */}
          <div className="max-w-md w-full grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-[10px] leading-relaxed">
              <span className="font-bold text-white block mb-0.5">한글 오토마타 (Automata)</span>
              초성, 중성, 종성 표준 조합 규칙을 지원합니다.
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-[10px] leading-relaxed">
              <span className="font-bold text-white block mb-0.5">보안 입력 힌트 방지</span>
              비밀번호 입력 시 실시간 마이닝 예측을 지능적으로 차단합니다.
            </div>
          </div>

        </main>

        {/* Right Properties Panel Column */}
        <section className={`${mobileActiveView === 'simulator' ? 'hidden lg:flex' : 'flex'} w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 p-4 lg:p-6 flex flex-col shrink-0 overflow-y-auto`}>
          <CustomizerPanel
            settings={settings}
            setSettings={setSettings}
            cannedPhrases={cannedPhrases}
            setCannedPhrases={setCannedPhrases}
            clipboard={clipboard}
            setClipboard={setClipboard}
            mlStats={mlStats}
            clearMLData={clearMLData}
            onSelectTheme={handleSelectTheme}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </section>

      </div>

      {/* 4. App Launch simulation Overlay notification */}
      <AnimatePresence>
        {externalAppNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-sky-500/30 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 max-w-sm"
          >
            <div className="w-10 h-10 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center shrink-0 animate-bounce">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">가상 앱 실행 알림</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                키보드 단축 메뉴에서 <strong>[{externalAppNotification}]</strong> 앱을 시뮬레이터 상에 가상으로 연동 기동하였습니다.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Success Toast notification */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/40 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">시스템 설정 동기화</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{toastNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Minimal elegant footer */}
      <footer className="py-2 text-center border-t border-slate-900 bg-slate-950 shrink-0 text-[9px] text-slate-500 font-mono">
        Android Input System Simulation Suite · Powered by MonsterAI Studio
      </footer>

    </div>
  );
}
