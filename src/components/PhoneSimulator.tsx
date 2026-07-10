import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, FileText, Globe, Lock, Send, Wifi, Battery, Smartphone,
  Menu, ChevronLeft, Volume2, Search, Play, HelpCircle, ArrowRight, ShieldAlert,
  FolderMinus, CheckSquare, Sparkles, LogIn, ExternalLink, Mic, Settings
} from 'lucide-react';
import { ActiveApp, KeyboardSettings, ChatMessage } from '../types';

interface PhoneSimulatorProps {
  settings: KeyboardSettings;
  setSettings?: React.Dispatch<React.SetStateAction<KeyboardSettings>>;
  textValue: string;
  setTextValue: (val: string) => void;
  activeApp: ActiveApp;
  setActiveApp: (app: ActiveApp) => void;
  focusedInputId: string | null;
  setFocusedInputId: (id: string | null) => void;
  children: React.ReactNode; // Renders the keyboard inside the phone
  cannedPhrases: string[];
  addToClipboard: (text: string) => void;
  onLaunchExternalApp: (appName: string) => void;
}

export default function PhoneSimulator({
  settings,
  setSettings,
  textValue,
  setTextValue,
  activeApp,
  setActiveApp,
  focusedInputId,
  setFocusedInputId,
  children,
  cannedPhrases,
  addToClipboard,
  onLaunchExternalApp
}: PhoneSimulatorProps) {
  
  // Simulated clock for top bar
  const [phoneTime, setPhoneTime] = useState('10:18');
  
  // Messages App Chat log
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'minji', text: '안녕! 오늘 약속 몇 시에 볼래?', timestamp: '오후 6:12' },
    { id: '2', sender: 'user', text: '나는 저녁 7시쯤이 좋을 것 같아! 😀', timestamp: '오후 6:13' },
    { id: '3', sender: 'minji', text: '오 좋은데? 맞춤법 맞나 보려고 키보드 테스트해보고 있어? ㅋㅋㅋ', timestamp: '오후 6:15' }
  ]);

  // KakaoTalk Messages Chat log
  const [kakaoMessages, setKakaoMessages] = useState<ChatMessage[]>([
    { id: 'k1', sender: 'minji', text: '톡 가능해? 새로 나온 검지글 키보드 자판 써봤어?? 💛', timestamp: '오전 11:20' },
    { id: 'k2', sender: 'user', text: '오 카톡으로 보니까 진짜 노란색 테마라 더 이쁘다! ㅋㅋㅋ', timestamp: '오전 11:22' }
  ]);

  // Browser suggestions
  const browserQueries = [
    '맞춤법 검사기 한국어',
    '천지인 자판 빠르게 쓰는 법',
    '나랏글 자판 획추가 규칙',
    '안드로이드 커스텀 키보드 추천',
    'AI 스마트 추천 시스템 원리'
  ];

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hrs = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12;
      setPhoneTime(`${hrs}:${mins} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle Send in Messages App
  const handleSendMessage = () => {
    if (!textValue.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textValue,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setTextValue('');
    
    // Simulate auto-reply from Minji to show typing interactions
    setTimeout(() => {
      const replies = [
        '와 진짜 편하다! 키보드 타이핑 반응도 대박이네 👍',
        '나랏글이랑 천지인도 다 지원하는구나!',
        '오타 수정 기능도 완전 신기해!',
        '상용구 기능도 써봤는데 진짜 편함 ㅋㅋㅋ'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'minji',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // Handle Send in KakaoTalk App
  const handleSendKakaoMessage = () => {
    if (!textValue.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textValue,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
    };

    setKakaoMessages([...kakaoMessages, newMsg]);
    setTextValue('');
    
    setTimeout(() => {
      const replies = [
        '와 진짜 편하다! 카톡 치는데 오타가 훨씬 줄었어 😆',
        '검지글 자판에서 슬라이드로 쓰는게 적응되니까 엄청 빠르네!',
        '이거 친구들한테도 써보라고 추천해야겠어!',
        '너가 만든 키보드 진짜 최고당 ㅎㅎ형'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      setKakaoMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'minji',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
      }]);
    }, 1200);
  };

  // Click canned phrase inside phone suggestions
  const handleSelectPhrase = (phrase: string) => {
    setTextValue(textValue + phrase);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none">
      
      {/* Dynamic Smartphone Shell */}
      <div 
        className="relative bg-slate-900 border-[12px] border-slate-950 rounded-[48px] shadow-2xl w-[320px] h-[640px] flex flex-col overflow-hidden ring-4 ring-slate-800"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
        }}
      >
        
        {/* Smartphone Camera Punchhole & Ear Speaker */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center gap-1">
          <div className="w-12 h-1 bg-zinc-800 rounded-full" /> {/* Ear Speaker */}
          <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800" /> {/* Camera */}
        </div>

        {/* 1. Android Status Bar */}
        <div className="bg-slate-950 text-white h-7 px-6 pt-1 flex items-center justify-between text-[10px] font-semibold z-40 shrink-0">
          <span>{phoneTime}</span>
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 text-[8px] tracking-widest">5G</span>
            <Wifi className="w-3 h-3 text-zinc-300" />
            <span className="text-[9px]">94%</span>
            <Battery className="w-3.5 h-3.5 text-zinc-300 rotate-90 scale-90" />
          </div>
        </div>

        {/* 2. Simulated Android App Launcher / Toolbar */}
        <div className="bg-slate-900 text-zinc-300 border-b border-zinc-800 h-10 px-3 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-1">
            <Menu className="w-4 h-4 text-zinc-500 hover:text-white transition cursor-pointer" />
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              {activeApp === 'messages' && '💬 Messages'}
              {activeApp === 'kakaotalk' && '💛 KakaoTalk'}
              {activeApp === 'notes' && '📝 Notepad'}
              {activeApp === 'browser' && '🌐 Google'}
              {activeApp === 'login' && '🔒 Authentication'}
              {activeApp === 'settings' && '⚙️ Settings'}
            </span>
          </div>
          
          {/* Quick App Swapper Icons */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => { setActiveApp('settings'); setFocusedInputId(null); }}
              className={`p-1 flex items-center justify-center rounded-lg transition text-[10px] h-7 w-7 ${activeApp === 'settings' ? 'bg-[#4F46E5] text-white font-extrabold' : 'hover:bg-zinc-800 text-sky-400'}`}
              title="키보드 관리 센터"
            >
              ⚙️
            </button>
            <button 
              onClick={() => { setActiveApp('kakaotalk'); setFocusedInputId('kakao-input'); }}
              className={`p-1 flex items-center justify-center rounded-lg transition text-[10px] h-7 w-7 font-extrabold ${activeApp === 'kakaotalk' ? 'bg-[#FFE000] text-zinc-900' : 'hover:bg-zinc-800 text-yellow-500'}`}
              title="카카오톡 앱"
            >
              톡
            </button>
            <button 
              onClick={() => { setActiveApp('messages'); setFocusedInputId('msg-input'); }}
              className={`p-1.5 rounded-lg transition ${activeApp === 'messages' ? 'bg-sky-500 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
              title="메시지 앱"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { setActiveApp('notes'); setFocusedInputId('notes-input'); }}
              className={`p-1.5 rounded-lg transition ${activeApp === 'notes' ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
              title="메모장 앱"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { setActiveApp('browser'); setFocusedInputId('browser-input'); }}
              className={`p-1.5 rounded-lg transition ${activeApp === 'browser' ? 'bg-emerald-500 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
              title="브라우저 검색"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => { setActiveApp('login'); setFocusedInputId('login-password'); }}
              className={`p-1.5 rounded-lg transition ${activeApp === 'login' ? 'bg-rose-500 text-white' : 'hover:bg-zinc-800 text-zinc-400'}`}
              title="비밀번호 보안 로그인"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Simulator App Core viewport screen */}
        <div className="flex-1 bg-zinc-950 flex flex-col relative overflow-hidden">
          
          {/* APP A: MESSAGES */}
          {activeApp === 'messages' && (
            <div className="flex-1 flex flex-col bg-[#8FA7BD] p-3 overflow-y-auto pb-4 gap-2.5">
              <div className="text-[10px] text-center text-slate-700/80 font-semibold bg-white/30 backdrop-blur-sm rounded-full py-0.5 px-3 mx-auto w-fit mb-1">
                2026년 7월 5일 일요일
              </div>

              {/* Chat room scroll */}
              <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pb-12 pr-1 select-text">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <span className="text-[9px] text-slate-800 mb-0.5 ml-1">{msg.sender === 'user' ? '나' : '민지'}</span>
                    <div className="flex items-end gap-1">
                      {msg.sender === 'user' && <span className="text-[7px] text-slate-800 shrink-0">{msg.timestamp}</span>}
                      <div 
                        className={`px-3 py-1.5 rounded-2xl text-[11px] leading-snug break-all ${
                          msg.sender === 'user' 
                            ? 'bg-[#FEE500] text-zinc-900 rounded-tr-none shadow-sm' 
                            : 'bg-white text-zinc-900 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.sender !== 'user' && <span className="text-[7px] text-slate-800 shrink-0">{msg.timestamp}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Typing Input bar bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2.5 py-1.5 flex items-center gap-1.5 z-10 shadow-md">
                <input
                  id="msg-input"
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  value={textValue}
                  onFocus={() => setFocusedInputId('msg-input')}
                  onChange={(e) => setTextValue(e.target.value)}
                  className="flex-1 text-[11px] px-2 py-1.5 bg-slate-100 rounded-full border border-slate-200 outline-none text-slate-900"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!textValue.trim()}
                  className="p-1.5 bg-sky-500 disabled:opacity-40 text-white rounded-full transition active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* APP E: KAKAOTALK */}
          {activeApp === 'kakaotalk' && (
            <div className="flex-1 flex flex-col bg-[#BACEE0] p-3 overflow-y-auto pb-4 gap-2.5 relative select-none">
              {/* Yellow Kakao Chat Room Header info */}
              <div className="text-[10px] text-center text-slate-700/85 font-bold bg-white/40 backdrop-blur-sm rounded-full py-0.5 px-3 mx-auto w-fit mb-1">
                💬 카카오톡: 민지 💛
              </div>

              {/* Chat room scroll */}
              <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pb-12 pr-1 select-text">
                {kakaoMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <span className="text-[9px] text-slate-800 mb-0.5 ml-1 font-bold">{msg.sender === 'user' ? '나' : '민지 💛'}</span>
                    <div className="flex items-end gap-1">
                      {msg.sender === 'user' && <span className="text-[7px] text-slate-700 shrink-0">{msg.timestamp}</span>}
                      <div 
                        className={`px-3 py-1.5 rounded-2xl text-[11px] leading-snug break-all font-medium ${
                          msg.sender === 'user' 
                            ? 'bg-[#FEE500] text-zinc-900 rounded-tr-none shadow-sm' 
                            : 'bg-white text-zinc-900 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.sender !== 'user' && <span className="text-[7px] text-slate-700 shrink-0">{msg.timestamp}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Typing Input bar bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2.5 py-1.5 flex items-center gap-1.5 z-10 shadow-md">
                <input
                  id="kakao-input"
                  type="text"
                  placeholder="카카오톡 메시지 입력..."
                  value={textValue}
                  onFocus={() => setFocusedInputId('kakao-input')}
                  onChange={(e) => setTextValue(e.target.value)}
                  className="flex-1 text-[11px] px-2.5 py-1.5 bg-slate-50 rounded-full border border-slate-200 outline-none text-slate-950 font-semibold"
                />
                <button
                  onClick={handleSendKakaoMessage}
                  disabled={!textValue.trim()}
                  className="p-1.5 bg-[#FEE500] hover:bg-[#FADA00] disabled:opacity-40 text-zinc-950 rounded-full transition active:scale-95 shrink-0 shadow-sm flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* APP B: NOTES */}
          {activeApp === 'notes' && (
            <div className="flex-1 flex flex-col bg-[#FCF8F2] p-4 text-zinc-800 pb-12">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
                <span className="text-[11px] font-bold text-zinc-500">MEMO (작성 중)</span>
                <span className="text-[9px] text-zinc-400 font-mono">글자 수: {textValue.length}</span>
              </div>
              
              <textarea
                id="notes-input"
                placeholder="여기에 자유롭게 긴 메모를 작성해 보세요. 키보드의 타이핑 기능, 한글 완성기 및 [수정] 버튼 테스트에 안성맞춤입니다!"
                value={textValue}
                onFocus={() => setFocusedInputId('notes-input')}
                onChange={(e) => setTextValue(e.target.value)}
                className="w-full flex-1 bg-transparent resize-none border-none outline-none text-xs leading-relaxed select-text placeholder-zinc-400 focus:ring-0 text-zinc-900"
              />

              {/* Clipboard highlight helper inside Notepad */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-200">
                <button 
                  onClick={() => {
                    if (textValue.trim()) {
                      addToClipboard(textValue.trim());
                    }
                  }}
                  disabled={!textValue.trim()}
                  className="text-[9px] text-indigo-500 font-bold hover:text-indigo-600 disabled:opacity-40 cursor-pointer flex items-center gap-0.5"
                >
                  전체 복사 (클립보드에 추가)
                </button>
                <span className="text-[8px] text-zinc-400">Notepad v1.2</span>
              </div>
            </div>
          )}

          {/* APP C: BROWSER */}
          {activeApp === 'browser' && (
            <div className="flex-1 flex flex-col bg-zinc-900 p-4 pb-12 select-text">
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-extrabold text-blue-500">G</span>
                  <span className="text-xl font-extrabold text-red-500">o</span>
                  <span className="text-xl font-extrabold text-yellow-500">o</span>
                  <span className="text-xl font-extrabold text-blue-500">g</span>
                  <span className="text-xl font-extrabold text-green-500">l</span>
                  <span className="text-xl font-extrabold text-red-500">e</span>
                </div>
                <span className="text-[8px] text-zinc-500">Custom Browser Simulator</span>
              </div>

              {/* Search Bar Input */}
              <div className="relative flex items-center bg-zinc-800 border border-zinc-700 rounded-full px-3.5 py-1.5 gap-2 shadow-sm focus-within:border-emerald-500">
                <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <input
                  id="browser-input"
                  type="text"
                  placeholder="Google 검색 또는 URL 입력"
                  value={textValue}
                  onFocus={() => setFocusedInputId('browser-input')}
                  onChange={(e) => setTextValue(e.target.value)}
                  className="w-full bg-transparent text-xs text-white border-none outline-none placeholder-zinc-500"
                />
              </div>

              {/* Simulated Search suggestions under active typing */}
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-500 mb-1 px-1.5">추천 검색어</span>
                {browserQueries.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setTextValue(q)}
                    className="flex items-center justify-between text-[11px] text-zinc-300 hover:bg-zinc-800 rounded-lg p-2 text-left transition"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-zinc-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* APP D: SECURE LOGIN */}
          {activeApp === 'login' && (
            <div className="flex-1 flex flex-col bg-slate-950 p-5 justify-center items-center text-center">
              <div className="w-11 h-11 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              
              <h2 className="text-xs font-bold text-slate-100 mb-1">인증센터 로그인</h2>
              <p className="text-[9px] text-slate-400 mb-6 leading-relaxed max-w-[200px]">
                보안을 요구하는 가상 비밀번호를 입력해 보세요. 키보드의 <strong>비밀번호 힌트 방지 옵션</strong>을 실시간으로 확인할 수 있습니다.
              </p>

              {/* Form Input fields */}
              <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col text-left gap-1">
                  <label className="text-[9px] text-slate-400 font-semibold px-1">아이디 (ID)</label>
                  <input
                    id="login-id"
                    type="text"
                    defaultValue="smart_user"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs outline-none text-slate-300 pointer-events-none opacity-60"
                  />
                </div>
                
                <div className="flex flex-col text-left gap-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] text-rose-400 font-bold flex items-center gap-0.5">
                      <ShieldAlert className="w-2.5 h-2.5" />
                      비밀번호 (Password)
                    </label>
                    <span className="text-[7px] text-emerald-400 font-bold">보안 입력 작동 중</span>
                  </div>
                  
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••••••"
                    value={textValue}
                    onFocus={() => setFocusedInputId('login-password')}
                    onChange={(e) => setTextValue(e.target.value)}
                    className="w-full bg-slate-900 border border-rose-500/30 rounded-lg py-2 px-3 text-xs outline-none text-white focus:border-rose-500"
                  />
                </div>

                {/* Login Button mockup */}
                <button 
                  onClick={() => {
                    alert(`비밀번호가 안전하게 입력되었습니다: ${textValue}`);
                    setTextValue('');
                  }}
                  disabled={!textValue}
                  className="w-full mt-2 py-2 bg-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>로그인 완료하기</span>
                </button>
              </div>
            </div>
          )}

          {/* APP F: KEYBOARD MANAGEMENT SETTINGS CENTER */}
          {activeApp === 'settings' && (
            <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 p-3 overflow-y-auto pb-12 select-none">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-2.5 shrink-0">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  ⚙️
                </div>
                <div className="text-left">
                  <h3 className="text-[11px] font-black tracking-tight text-white">키보드 앱 관리 센터</h3>
                  <span className="text-[7px] text-slate-400 block -mt-0.5">Mobile Keyboard OS Controller</span>
                </div>
              </div>

              {setSettings ? (
                <div className="flex flex-col gap-2.5">
                  {/* Category 1: Layout Selection */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2">
                    <span className="text-[8px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1.5">⌨️ 한글 자판 배열 선택</span>
                    <div className="grid grid-cols-2 gap-1">
                      {([
                        { id: 'qwerty', name: '두벌식 (QWERTY)' },
                        { id: 'cheonjiin', name: '천지인' },
                        { id: 'naratgul', name: '나랏글' },
                        { id: 'geomjigeul', name: '검지글' }
                      ] as const).map((lay) => (
                        <button
                          key={lay.id}
                          onClick={() => setSettings(prev => ({ ...prev, activeKoreanLayout: lay.id }))}
                          className={`py-1 px-1 rounded-lg text-[9px] font-extrabold text-center transition active:scale-95 border ${
                            settings.activeKoreanLayout === lay.id
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                              : 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-800'
                          }`}
                        >
                          {lay.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: Keyboard Height */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-extrabold text-indigo-400 uppercase tracking-widest">📏 키보드 전체 높이</span>
                      <span className="text-[8px] font-mono font-bold bg-indigo-950 text-indigo-300 px-1 py-0.5 rounded">{settings.keyboardHeight}px</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, keyboardHeight: Math.max(160, prev.keyboardHeight - 10) }))}
                        className="w-7 h-6 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold active:scale-95 flex items-center justify-center text-slate-300 hover:text-white"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="160"
                        max="320"
                        value={settings.keyboardHeight}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSettings(prev => ({ ...prev, keyboardHeight: val }));
                        }}
                        className="flex-1 accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, keyboardHeight: Math.min(320, prev.keyboardHeight + 10) }))}
                        className="w-7 h-6 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold active:scale-95 flex items-center justify-center text-slate-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Category 3: System feedback */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2 flex flex-col gap-1.5">
                    <span className="text-[8px] font-extrabold text-indigo-400 uppercase tracking-widest mb-0.5">⚙️ 입력 피드백 및 인공지능</span>
                    
                    <div className="flex items-center justify-between text-left">
                      <div>
                        <span className="text-[9px] font-bold text-white block">키 누를 때 진동</span>
                        <span className="text-[7px] text-slate-400 block -mt-0.5">촉각 진동 피드백</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.vibrateOnPress}
                        onChange={(e) => setSettings(prev => ({ ...prev, vibrateOnPress: e.target.checked }))}
                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-1.5 text-left">
                      <div>
                        <span className="text-[9px] font-bold text-white block">키 누를 때 효과음</span>
                        <span className="text-[7px] text-slate-400 block -mt-0.5">기계식 효과음 피드백</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.soundOnPress}
                        onChange={(e) => setSettings(prev => ({ ...prev, soundOnPress: e.target.checked }))}
                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-1.5 text-left">
                      <div>
                        <span className="text-[9px] font-bold text-white block">다음 단어 인공지능 추천</span>
                        <span className="text-[7px] text-slate-400 block -mt-0.5">ML Cumulative Predictor</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showNextWordSuggestions}
                        onChange={(e) => setSettings(prev => ({ ...prev, showNextWordSuggestions: e.target.checked }))}
                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-1.5 text-left">
                      <div>
                        <span className="text-[9px] font-bold text-rose-400 block">비밀번호 보안 모드</span>
                        <span className="text-[7px] text-slate-400 block -mt-0.5">비밀번호 입력 시 자동추천 숨김</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.preventPasswordHints}
                        onChange={(e) => setSettings(prev => ({ ...prev, preventPasswordHints: e.target.checked }))}
                        className="w-4 h-4 accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="text-[7px] text-center text-zinc-500 italic mt-0.5">
                    여기서 수정한 자판 설정은 실제 하단 가상 키보드에 실시간으로 즉시 반영됩니다.
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-6 text-xs italic">
                  설정 제어 상태가 바인딩되지 않았습니다.
                </div>
              )}
            </div>
          )}

          {/* Quick Launcher Keyboard Toolbar Overlay ( 다른 앱 실행 메뉴 ) */}
          <div className="absolute top-1/2 right-1.5 transform -translate-y-1/2 flex flex-col gap-2 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-full shadow-2xl z-45 ring-2 ring-slate-800/50">
            <span className="text-[8px] text-zinc-400 font-black tracking-wider text-center border-b border-zinc-800 pb-1 mb-0.5">LAUNCH</span>
            <button
              onClick={() => onLaunchExternalApp('인터넷')}
              className="p-2 bg-zinc-900 text-teal-400 hover:bg-zinc-800 hover:text-teal-300 rounded-full transition active:scale-95 shadow-md flex items-center justify-center"
              title="인터넷 앱 실행"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLaunchExternalApp('음성 검색')}
              className="p-2 bg-zinc-900 text-amber-400 hover:bg-zinc-800 hover:text-amber-300 rounded-full transition active:scale-95 shadow-md flex items-center justify-center"
              title="음성 검색 비서 실행"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLaunchExternalApp('설정')}
              className="p-2 bg-zinc-900 text-sky-400 hover:bg-zinc-800 hover:text-sky-300 rounded-full transition active:scale-95 shadow-md flex items-center justify-center"
              title="시스템 설정 실행"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 4. Custom Virtual Keyboard nested at bottom of the Smartphone viewport */}
        <div className="shrink-0 z-40 bg-zinc-900 border-t border-zinc-800">
          {settings.isKeyboardEnabled && settings.isKeyboardSelected ? (
            children
          ) : (
            <div className="bg-zinc-950 text-zinc-400 p-4 h-[190px] flex flex-col items-center justify-center text-center gap-1.5 select-none relative">
              {/* Fallback layout background grid outline */}
              <div className="absolute inset-0 grid grid-rows-3 grid-cols-5 gap-1 p-2 opacity-10 pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="border border-white rounded-lg" />
                ))}
              </div>
              
              <div className="z-10 flex flex-col items-center gap-1">
                <span className="text-lg">⚙️ 시스템 기본 키보드 대기 중</span>
                <div className="text-[10px] font-bold text-zinc-300 leading-tight">
                  {!settings.isKeyboardEnabled 
                    ? "1단계: 설정에서 키보드 앱을 활성화해 주세요." 
                    : "2단계: 기본 입력기로 '커스텀 키보드'를 선택해 주세요."}
                </div>
                <p className="text-[9px] text-zinc-500 leading-relaxed max-w-[220px] mt-0.5">
                  좌측 <strong className="text-sky-400">설치 마법사</strong> 단계에서 옵션을 켜는 즉시 이 가상 스마트폰에 최첨단 커스텀 키보드가 즉각 탑재됩니다!
                </p>
                {setSettings && (
                  <button
                    onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        isKeyboardEnabled: true,
                        isKeyboardSelected: true
                      }));
                    }}
                    className="z-20 mt-1 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-[10px] text-white rounded font-bold transition shadow-md active:scale-95"
                  >
                    🚀 가상 폰에 바로 활성화 적용하기
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. Android Navigation bar (Back, Home, Apps) */}
        <div className="bg-slate-950 h-6 px-16 flex items-center justify-between z-50 shrink-0 border-t border-slate-900">
          <ChevronLeft className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition cursor-pointer" />
          <div className="w-2.5 h-2.5 border-2 border-zinc-500 rounded hover:border-white transition cursor-pointer" />
          <Menu className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition cursor-pointer" />
        </div>

      </div>
    </div>
  );
}
