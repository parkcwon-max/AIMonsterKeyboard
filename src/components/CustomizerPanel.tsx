import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Settings, Smartphone, Layout, Palette, Clipboard, HelpCircle, Check, 
  Trash2, Plus, Info, ShieldAlert, ShieldCheck, Cpu, Award, RefreshCw, BarChart2, Eye, Sliders, Type
} from 'lucide-react';
import { KeyboardSettings, CustomTheme, CannedPhrase, ClipboardItem, MLModelStats, KoreanLayout, KeyShape } from '../types';

interface CustomizerPanelProps {
  settings: KeyboardSettings;
  setSettings: React.Dispatch<React.SetStateAction<KeyboardSettings>>;
  cannedPhrases: CannedPhrase[];
  setCannedPhrases: React.Dispatch<React.SetStateAction<CannedPhrase[]>>;
  clipboard: ClipboardItem[];
  setClipboard: React.Dispatch<React.SetStateAction<ClipboardItem[]>>;
  mlStats: MLModelStats;
  clearMLData: () => void;
  onSelectTheme: (theme: CustomTheme) => void;
  activeTab: 'wizard' | 'general' | 'theme' | 'phrases' | 'ml' | 'build';
  setActiveTab: (tab: 'wizard' | 'general' | 'theme' | 'phrases' | 'ml' | 'build') => void;
}

const PRESET_THEMES: CustomTheme[] = [
  {
    id: 'slate-dark',
    name: 'Slate Dark (기본 다크)',
    isDark: true,
    bgType: 'color',
    bgColor: '#1E1E22',
    keyBgColor: '#2D3139',
    keyTextColor: '#E2E8F0',
    accentColor: '#3B82F6',
    keyShape: 'rectangular'
  },
  {
    id: 'aurora-teal',
    name: 'Aurora Teal (오로라 테일)',
    isDark: true,
    bgType: 'gradient',
    bgColor: 'linear-gradient(135deg, #0D9488 0%, #4F46E5 100%)',
    keyBgColor: 'rgba(255, 255, 255, 0.15)',
    keyTextColor: '#FFFFFF',
    accentColor: '#14B8A6',
    keyShape: 'pill'
  },
  {
    id: 'midnight-neon',
    name: 'Midnight Neon (네온 블랙)',
    isDark: true,
    bgType: 'color',
    bgColor: '#000000',
    keyBgColor: '#1A1D20',
    keyTextColor: '#10B981',
    accentColor: '#10B981',
    keyShape: 'square'
  },
  {
    id: 'warm-peach',
    name: 'Warm Peach (웜 피치)',
    isDark: false,
    bgType: 'color',
    bgColor: '#FFF5F0',
    keyBgColor: '#FFE0D3',
    keyTextColor: '#7C2D12',
    accentColor: '#EA580C',
    keyShape: 'round'
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom (벚꽃 핑크)',
    isDark: false,
    bgType: 'gradient',
    bgColor: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    keyBgColor: '#FFFFFF',
    keyTextColor: '#DB2777',
    accentColor: '#EC4899',
    keyShape: 'pill'
  }
];

const PRESET_BACKGROUND_PHOTOS = [
  { name: '에메랄드 숲', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=60' },
  { name: '사이버펑크 시티', url: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=400&auto=format&fit=crop&q=60' },
  { name: '우주 은하수', url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&auto=format&fit=crop&q=60' },
  { name: '라벤더 노을', url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=400&auto=format&fit=crop&q=60' }
];

export default function CustomizerPanel({
  settings,
  setSettings,
  cannedPhrases,
  setCannedPhrases,
  clipboard,
  setClipboard,
  mlStats,
  clearMLData,
  onSelectTheme,
  activeTab,
  setActiveTab
}: CustomizerPanelProps) {
  const [newPhraseText, setNewPhraseText] = useState('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [buildVersionCode, setBuildVersionCode] = useState(30);
  const [buildVersionName, setBuildVersionName] = useState('3.0.0');
  const [isBumping, setIsBumping] = useState(false);
  const [showBumpSuccess, setShowBumpSuccess] = useState(false);

  // Sizing and general inputs
  const handleToggleLanguage = (lang: 'ko' | 'en') => {
    const nextLangs = { ...settings.languages, [lang]: !settings.languages[lang] };
    // Make sure at least one is enabled
    if (nextLangs.ko || nextLangs.en) {
      setSettings({ ...settings, languages: nextLangs });
    }
  };

  const handlePhraseAdd = () => {
    if (!newPhraseText.trim()) return;
    const newPhrase: CannedPhrase = {
      id: Date.now().toString(),
      text: newPhraseText.trim()
    };
    setCannedPhrases([...cannedPhrases, newPhrase]);
    setNewPhraseText('');
  };

  const handlePhraseDelete = (id: string) => {
    setCannedPhrases(cannedPhrases.filter(p => p.id !== id));
  };

  const handleClipboardClear = () => {
    setClipboard([]);
  };

  const handleCustomPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;
    const nextTheme: CustomTheme = {
      ...settings.customTheme,
      bgType: 'image',
      bgImage: customPhotoUrl.trim(),
      keyBgColor: 'rgba(255, 255, 255, 0.25)',
      keyTextColor: '#ffffff'
    };
    setSettings({
      ...settings,
      customTheme: nextTheme
    });
  };

  const handlePresetPhotoSelect = (url: string) => {
    const nextTheme: CustomTheme = {
      ...settings.customTheme,
      bgType: 'image',
      bgImage: url,
      keyBgColor: settings.customTheme.isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.65)',
      keyTextColor: settings.customTheme.isDark ? '#E2E8F0' : '#1E293B'
    };
    setSettings({
      ...settings,
      customTheme: nextTheme
    });
  };

  const handleBumpVersion = () => {
    if (isBumping) return;
    setIsBumping(true);
    setShowBumpSuccess(false);
    setTimeout(() => {
      setBuildVersionCode(prev => {
        const next = prev + 1;
        setBuildVersionName(`3.0.${next - 30}`);
        return next;
      });
      setIsBumping(false);
      setShowBumpSuccess(true);
    }, 800);
  };

  const totalWords = Object.values(mlStats.wordFrequencies).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 lg:p-6 shadow-xl flex flex-col h-full min-h-[500px] lg:h-[600px] overflow-hidden">
      
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>키보드 앱 관리 센터</span>
              <span className="text-[10px] py-0.5 px-2 bg-sky-500/20 text-sky-400 rounded-full font-bold">Android OS</span>
            </h1>
            <p className="text-[10px] text-slate-400">키보드 활성화, 맞춤 테마 설계 및 ML 학습 엔진 모니터링</p>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-2xl border border-slate-800 shrink-0 mb-4 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('wizard')}
          className={`flex-1 py-1.5 px-2 text-center rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'wizard' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          🚀 설치
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-1.5 px-2 text-center rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'general' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          ⚙️ 설정
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-1.5 px-2 text-center rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'theme' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          🎨 테마
        </button>
        <button
          onClick={() => setActiveTab('phrases')}
          className={`flex-1 py-1.5 px-2 text-center rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'phrases' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          🗂️ 상용구
        </button>
        <button
          onClick={() => setActiveTab('ml')}
          className={`flex-1 py-1.5 px-2 text-center rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'ml' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          🧠 분석
        </button>
        <button
          onClick={() => setActiveTab('build')}
          className={`flex-1 py-1.5 px-2 text-center rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'build' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          📦 빌드
        </button>
      </div>

      {/* Tab Contents Viewport */}
      <div className="flex-1 overflow-y-auto pr-1">
        
        {/* TAB 1: INSTALLATION WIZARD (설치 마법사) */}
        {activeTab === 'wizard' && (
          <div className="space-y-4 text-slate-300">
            <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">가상 안드로이드 기기에 설치 진행</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  스마트폰에서 당사 키보드를 원활하게 활성화하려면 안드로이드 시스템 단계별 승인이 필요합니다. 아래 가상 단계를 켜서 승인해 주세요.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Step 1: Enable Keyboard Toggle */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">1단계: 키보드 앱 활성화 (Enable)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">안드로이드 설정 &gt; 입력 및 제어에 등록</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, isKeyboardEnabled: !settings.isKeyboardEnabled })}
                  className={`w-11 h-6 rounded-full p-1 transition-all ${settings.isKeyboardEnabled ? 'bg-sky-500' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${settings.isKeyboardEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Step 2: Select Keyboard default Radio */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">2단계: 기본 입력법으로 지정 (Select Default)</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">가상 단말기 기본 입력기 수동 전환</p>
                  </div>
                  <span className={`text-[9px] py-0.5 px-2 rounded-full font-bold ${settings.isKeyboardSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {settings.isKeyboardSelected ? '완료' : '대기 중'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button
                    onClick={() => setSettings({ ...settings, isKeyboardSelected: false })}
                    className={`p-2 border rounded-xl text-left text-xs font-bold transition ${!settings.isKeyboardSelected ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-slate-800 text-slate-400'}`}
                  >
                    삼성 키보드 / Gboard
                  </button>
                  <button
                    disabled={!settings.isKeyboardEnabled}
                    onClick={() => setSettings({ ...settings, isKeyboardSelected: true })}
                    className={`p-2 border rounded-xl text-left text-xs font-bold transition disabled:opacity-30 ${settings.isKeyboardSelected ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-slate-800 text-slate-400'}`}
                  >
                    ✨ 커스텀 스마트 키보드
                  </button>
                </div>
              </div>

              {/* Step 3: Select Languages checkboxes */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-white">3단계: 기본 활성 언어 팩 지정</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">키보드에서 즉시 전환하며 사용할 언어 선택</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={settings.languages.ko}
                      onChange={() => handleToggleLanguage('ko')}
                      className="accent-sky-500 rounded"
                    />
                    <span>한국어 (Korean)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={settings.languages.en}
                      onChange={() => handleToggleLanguage('en')}
                      className="accent-sky-500 rounded"
                    />
                    <span>영어 (English)</span>
                  </label>
                </div>
              </div>

              {/* Install Complete Banner */}
              {settings.isKeyboardEnabled && settings.isKeyboardSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center"
                >
                  <Award className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
                  <h4 className="text-xs font-bold text-emerald-400">키보드 활성화 및 설정 완료!</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                    이제 가상 스마트폰 입력창을 터치하여 커스텀 키보드로 자유롭게 한글/영어를 조합하고, 개인 맞춤형 ML 추천 엔진의 예측을 테스트해보세요.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL SETTINGS (자판 및 설정) */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            
            {/* Korean layout select */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-sky-500" />
                <span>한국어 자판 레이아웃 설정</span>
              </label>
              <p className="text-[9px] text-slate-400">상황과 손가락 입력 스타일에 가장 적합한 자판을 고르세요.</p>
              
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                {(['qwerty', 'cheonjiin', 'naratgul', 'geomjigeul'] as KoreanLayout[]).map((lay) => (
                  <button
                    key={lay}
                    onClick={() => setSettings({ ...settings, activeKoreanLayout: lay })}
                    className={`py-2 px-1 text-center border text-[11px] font-extrabold rounded-xl transition uppercase ${settings.activeKoreanLayout === lay ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-slate-800 text-slate-400'}`}
                  >
                    {lay === 'qwerty' && '쿼티 (두벌식)'}
                    {lay === 'cheonjiin' && '천지인'}
                    {lay === 'naratgul' && '나랏글'}
                    {lay === 'geomjigeul' && '검지글'}
                  </button>
                ))}
              </div>
            </div>

            {/* Heights and Font Adjustments */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-500" />
                <span>키보드 폼팩터 세부 조정</span>
              </label>

              {/* Height Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">키보드 높이 조정 (Height)</span>
                  <span className="text-white font-mono font-bold">{settings.keyboardHeight}px</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="270"
                  value={settings.keyboardHeight}
                  onChange={(e) => setSettings({ ...settings, keyboardHeight: parseInt(e.target.value) })}
                  className="w-full accent-sky-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Font dropdown */}
              <div className="space-y-1.5 pt-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">키 텍스트 폰트 (Font Family)</span>
                  <span className="text-slate-300 font-bold">{settings.fontFamily}</span>
                </div>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                >
                  <option value="Inter">Inter (기본 산세리프)</option>
                  <option value="Space Grotesk">Space Grotesk (미래 테크)</option>
                  <option value="JetBrains Mono">JetBrains Mono (고해상 코딩)</option>
                  <option value="Playfair Display">Playfair Display (감성 세리프)</option>
                  <option value="system-ui">기본 시스템 고딕</option>
                </select>
              </div>

              {/* Font Size Slider */}
              <div className="space-y-1 pt-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">글자 크기 조정 (Font Size)</span>
                  <span className="text-white font-mono font-bold">{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                  className="w-full accent-sky-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>
            </div>

            {/* Security Settings password hint prevention */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>개인 정보 보호 및 입력 보안</span>
              </label>
              <p className="text-[9px] text-slate-400 leading-relaxed">
                비밀번호 입력 창 등 보호 영역에 진입 시, 입력 제안 및 상단 글자 추천 힌트를 자동으로 감춰 해킹과 시각 유출을 사전에 방지합니다.
              </p>
              
              <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={settings.preventPasswordHints}
                  onChange={(e) => setSettings({ ...settings, preventPasswordHints: e.target.checked })}
                  className="accent-rose-500 rounded"
                />
                <span>비밀번호 입력 시 자동 추천 힌트 방지 활성화</span>
              </label>
            </div>

            {/* Presets Toggle for vibration */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-white font-bold block">햅틱 반응 활성화 (Vibration)</span>
                <span className="text-[9px] text-slate-400">키보드 버튼 터치 시 미세 진동 부여</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, vibrateOnPress: !settings.vibrateOnPress })}
                className={`w-11 h-6 rounded-full p-1 transition-all ${settings.vibrateOnPress ? 'bg-sky-500' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${settings.vibrateOnPress ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: THEMES & SKINS (테마 및 배경스킨) */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            
            {/* Quick preset selector */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-sky-500" />
                <span>원클릭 사전 세팅 테마 스킨</span>
              </label>
              
              <div className="flex flex-col gap-2 pt-1">
                {PRESET_THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => onSelectTheme(th)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${settings.themeId === th.id ? 'border-sky-500 bg-sky-500/10' : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-full border border-slate-700 shrink-0"
                        style={{ background: th.bgColor }}
                      />
                      <span className="text-xs font-bold text-white">{th.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="capitalize">{th.keyShape}형</span>
                      {settings.themeId === th.id && <Check className="w-3.5 h-3.5 text-sky-500" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Custom Wallpaper Skin */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>커스텀 이미지 배경 스킨 교체</span>
              </label>
              <p className="text-[9px] text-slate-400">원하는 풍경이나 일러스트 이미지 주소(URL)를 적용해 키보드 스킨을 커스텀해 보세요.</p>
              
              {/* Presets photos */}
              <div className="grid grid-cols-4 gap-1.5 py-1">
                {PRESET_BACKGROUND_PHOTOS.map((ph, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetPhotoSelect(ph.url)}
                    className="group relative h-12 rounded-lg overflow-hidden border border-slate-800 active:scale-95 transition"
                    title={ph.name}
                  >
                    <img 
                      src={ph.url} 
                      alt={ph.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-white text-center leading-tight">{ph.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Image input Form */}
              <form onSubmit={handleCustomPhotoSubmit} className="flex gap-1.5 pt-1.5">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                />
                <button
                  type="submit"
                  className="px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition active:scale-95 shrink-0"
                >
                  반영
                </button>
              </form>
            </div>

            {/* Custom Shape Design */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white">버튼 모서리 모양 커스텀 (Key Shape)</label>
              
              <div className="grid grid-cols-5 gap-1 pt-1">
                {(['round', 'pill', 'square', 'rectangular', 'borderless'] as KeyShape[]).map((shp) => (
                  <button
                    key={shp}
                    onClick={() => setSettings({
                      ...settings,
                      customTheme: { ...settings.customTheme, keyShape: shp }
                    })}
                    className={`py-1.5 text-center text-[9px] border rounded-lg transition capitalize font-bold ${settings.customTheme.keyShape === shp ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-slate-800 text-slate-400'}`}
                  >
                    {shp === 'round' && '완전둥글'}
                    {shp === 'pill' && '타원형'}
                    {shp === 'square' && '직각'}
                    {shp === 'rectangular' && '완만곡선'}
                    {shp === 'borderless' && '무테'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PHRASES & CLIPBOARD (상용구/클립보드) */}
        {activeTab === 'phrases' && (
          <div className="space-y-4">
            
            {/* Quick canned phrases add/view */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clipboard className="w-4 h-4 text-sky-500" />
                  <span>단축 상용구 관리 (Canned Phrases)</span>
                </div>
                <span className="text-[9px] text-slate-500">자주 쓰는 문장 등록</span>
              </label>

              {/* Add Phrase form */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="예: 지금 이동 중입니다. 나중에 연락드리겠습니다."
                  value={newPhraseText}
                  onChange={(e) => setNewPhraseText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                />
                <button
                  onClick={handlePhraseAdd}
                  className="p-1.5 bg-sky-500 text-white rounded-xl transition active:scale-95 hover:bg-sky-600 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Phrases Scroll list */}
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pt-1">
                {cannedPhrases.map((phrase) => (
                  <div 
                    key={phrase.id} 
                    className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-200 hover:border-slate-700 transition"
                  >
                    <span className="truncate pr-4 font-semibold">{phrase.text}</span>
                    <button
                      onClick={() => handlePhraseDelete(phrase.id)}
                      className="p-1 hover:text-red-500 transition active:scale-95 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Clipboard logs */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-sky-500" />
                  <span>실시간 클립보드 내역 (Clipboard logs)</span>
                </span>
                <button 
                  onClick={handleClipboardClear}
                  disabled={clipboard.length === 0}
                  className="text-[10px] font-bold text-red-400 hover:text-red-500 disabled:opacity-30 flex items-center gap-0.5 cursor-pointer"
                >
                  모두 삭제
                </button>
              </div>
              <p className="text-[9px] text-slate-400">모바일 가상단말이나 메모에서 복사한 모든 내용이 여기에 스토리지 보존됩니다.</p>

              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
                {clipboard.length > 0 ? (
                  clipboard.map((clip) => (
                    <div 
                      key={clip.id}
                      className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-300"
                    >
                      <p className="font-semibold break-all">{clip.text}</p>
                      <span className="text-[7px] text-slate-500 block text-right mt-1">{clip.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 text-[10px] italic">클립보드가 비어 있습니다</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PERSONAL ML INSIGHTS (머신러닝 학습 분석) */}
        {activeTab === 'ml' && (
          <div className="space-y-4">
            
            {/* Visual Stats Gauges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[8px] text-slate-500 block font-bold uppercase">누적 입력 어절수</span>
                <span className="text-lg font-extrabold text-sky-400 font-mono">{mlStats.typedWordsCount}</span>
              </div>
              
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[8px] text-slate-500 block font-bold uppercase">오타 수정 횟수</span>
                <span className="text-lg font-extrabold text-amber-400 font-mono">{mlStats.correctionsCount}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[8px] text-slate-500 block font-bold uppercase">추천 예측 정확도</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">
                  {mlStats.accuracyRate}%
                </span>
              </div>
            </div>

            {/* Explainer */}
            <div className="bg-slate-950/40 p-3.5 border border-slate-800 rounded-2xl space-y-1.5 text-slate-300">
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>스마트폰 로컬 ML 마르코프 체인 원리</span>
              </h4>
              <p className="text-[9px] text-slate-400 leading-relaxed">
                사용자가 스페이스나 엔터를 눌러 어절을 고를 때마다, <strong>단어 간 연속 전이 빈도(Word-Transition counts)</strong> 및 <strong>어절 선호 빈도</strong>를 로컬 스토리지에 기록 학습합니다. 이후 첫 어절이 완료되면 연쇄 가중치가 높은 다음 어절을 실시간 AI 예측 추천합니다.
              </p>
            </div>

            {/* Word frequencies analysis */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-2">
                <span>학습 완료된 개인 단어집 (Top Frequencies)</span>
                <span className="text-[9px] text-emerald-400 font-normal">정상 학습 중</span>
              </div>

              {Object.keys(mlStats.wordFrequencies).length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto text-[11px]">
                  {Object.entries(mlStats.wordFrequencies)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([word, count]) => (
                      <div 
                        key={word}
                        className="flex items-center justify-between p-1.5 bg-slate-900/60 rounded-lg border border-slate-800/80"
                      >
                        <span className="truncate pr-2 text-slate-200 font-bold">{word}</span>
                        <span className="text-[9px] text-sky-400 font-mono font-bold">{count}회</span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 text-[10px] italic">
                  아직 학습된 단어가 없습니다. 우측 폰에서 메시지나 메모를 입력해 보세요!
                </div>
              )}
            </div>

            {/* ML Cleanup Actions */}
            <div className="flex justify-between items-center bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400">
                <span className="text-white font-bold block">개인 ML 사전 초기화</span>
                로컬 수집된 가중치를 공장 초기화
              </div>
              <button
                onClick={clearMLData}
                disabled={Object.keys(mlStats.wordFrequencies).length === 0}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-30 border border-red-500/20 rounded-xl text-xs font-bold transition active:scale-95"
              >
                초기화
              </button>
            </div>

          </div>
        )}

        {activeTab === 'build' && (
          <div className="space-y-4">
            {/* Direct update indicator */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>안드로이드 무삭제 Direct 업데이트 기술</span>
              </label>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                MonsterAI 키보드는 사용자가 기존 버전을 지우지 않고 새 버전을 APK 설치 파일로 덮어쓰기 형태로 즉시 업데이트(In-place update)할 수 있게 최적화되어 있습니다.
              </p>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">앱 고유 명칭:</span>
                  <span className="text-white font-extrabold text-[11px] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 text-red-400">MonsterAI</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">패키지 고유 ID (applicationId):</span>
                  <span className="text-white font-mono font-bold text-[10px]">com.monsterk.ai</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-2">
                  <span className="text-slate-400 font-semibold">버전 코드 (versionCode):</span>
                  <span className="text-sky-400 font-mono font-extrabold text-xs">{buildVersionCode}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">버전 이름 (versionName):</span>
                  <span className="text-sky-400 font-mono font-extrabold text-xs">{buildVersionName}</span>
                </div>
              </div>

              {/* Version Bump Simulation Trigger Button */}
              <button
                onClick={handleBumpVersion}
                disabled={isBumping}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isBumping ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Gradle Manifest 업데이트 빌딩 중...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>새 버전 배포용 버전코드 올리기 (+1 Bump Version)</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {showBumpSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>성공: 버전이 상향되었습니다! 이제 direct 업데이트가 가능합니다.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Android Manifest build.gradle specification snippet */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Gradle 빌드 설정 소스파일 (build.gradle)</span>
              </label>
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-850 font-mono text-[9px] text-emerald-400 leading-normal relative overflow-hidden">
                <div className="absolute top-1.5 right-2 text-[8px] text-slate-500 select-none uppercase font-bold font-sans">Groovy DSL</div>
                <div>android &#123;</div>
                <div className="pl-3 text-slate-400">compileSdk 34</div>
                <div className="pl-3">defaultConfig &#123;</div>
                <div className="pl-6 text-yellow-400">applicationId <span className="text-amber-300">"com.monsterk.ai"</span> <span className="text-slate-500">// 고유 패키지명 고정</span></div>
                <div className="pl-6 text-sky-400">minSdk 26</div>
                <div className="pl-6 text-sky-400">targetSdk 34</div>
                <div className="pl-6 text-sky-300">versionCode <span className="text-emerald-400 font-extrabold">{buildVersionCode}</span> <span className="text-slate-500">// 빌드마다 자동 증가</span></div>
                <div className="pl-6 text-sky-300">versionName <span className="text-emerald-400 font-extrabold">"{buildVersionName}"</span></div>
                <div className="pl-3">&#125;</div>
                <div>&#125;</div>
              </div>
            </div>

            {/* Checklist items for direct updates */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5 text-amber-500">
                <Info className="w-4 h-4" />
                <span>무삭제 업데이트를 위한 4대 필수 체크리스트</span>
              </label>
              
              <div className="space-y-2 pt-1 text-[9px] text-slate-400 leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-extrabold shrink-0">✔</span>
                  <div>
                    <strong className="text-white">동일한 패키지 고유 ID (applicationId) 유지:</strong>
                    <p className="mt-0.5">패키지명이 바뀌면 안드로이드 OS가 다른 앱으로 취급하여 신규 설치를 요구합니다. 반드시 <span className="text-white">com.monsterk.ai</span>로 유지하세요.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-emerald-400 font-extrabold shrink-0">✔</span>
                  <div>
                    <strong className="text-white">동일한 서명 키스토어 (Developer Keystore) 서명:</strong>
                    <p className="mt-0.5">이전 앱과 동일한 키스토어 파일(.jks 또는 .keystore)로 릴리즈 빌드 서명되어야만 안드로이드 OS가 변조되지 않은 본인 앱으로 신뢰하여 업데이트를 허용합니다. 서명키 유실 시 업데이트가 아예 불가능합니다.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-emerald-400 font-extrabold shrink-0">✔</span>
                  <div>
                    <strong className="text-white">정진적 버전 코드 (versionCode) 증가:</strong>
                    <p className="mt-0.5">반드시 새로운 APK의 versionCode가 기존 폰에 설치된 버전보다 높아야만 안드로이드가 설치를 진행합니다. 버전코드가 같거나 낮으면 '앱이 설치되지 않았습니다' 오류가 뜹니다.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-emerald-400 font-extrabold shrink-0">✔</span>
                  <div>
                    <strong className="text-white">GitHub Actions 자동 서명 파이프라인 구축:</strong>
                    <p className="mt-0.5">GitHub 저장소 Secrets에 Keystore 파일의 Base64 데이터 및 암호를 저장한 뒤, PR 머지 시 자동으로 버전을 올려 빌드/서명되도록 워크플로우를 설정하는 것을 강력 추천합니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
