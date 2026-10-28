import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, RotateCcw } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  bgHex?: string;
  onResetDemo?: () => void;
  onClearEmpty?: () => void;
  isListEmpty?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  bgHex = '#e3e5e9',
  onResetDemo,
  onClearEmpty,
  isListEmpty,
}) => {
  const [isMobileMode, setIsMobileMode] = useState<boolean>(true);
  const [timeStr, setTimeStr] = useState<string>('9:30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-start p-0 sm:py-6 md:py-8 select-none transition-colors duration-300">
      {/* Top Device & View Mode Switcher bar (subtle desktop toolbar) */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-md md:max-w-xl mb-3 px-4 py-2 bg-stone-800/80 backdrop-blur rounded-full text-xs text-stone-300 border border-stone-700/60 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Listify
          </span>
          <span className="text-stone-500">|</span>
          <div className="flex items-center bg-stone-900/60 p-0.5 rounded-full border border-stone-700/40">
            <button
              onClick={() => setIsMobileMode(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                isMobileMode
                  ? 'bg-stone-700 text-white font-medium shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Mobile Mockup View (as in user screenshots)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setIsMobileMode(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                !isMobileMode
                  ? 'bg-stone-700 text-white font-medium shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Expanded Browser View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Web</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isListEmpty ? (
            <button
              onClick={onResetDemo}
              className="flex items-center gap-1 px-2 py-1 bg-stone-700/70 hover:bg-stone-700 text-emerald-300 rounded-lg text-[11px] transition"
              title="Load screenshot Grocery list demo"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Load Grocery List</span>
            </button>
          ) : (
            <button
              onClick={onClearEmpty}
              className="flex items-center gap-1 px-2 py-1 bg-stone-700/50 hover:bg-stone-700 text-stone-300 rounded-lg text-[11px] transition"
              title="View empty state as in screenshot"
            >
              <span>See Empty State</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col overflow-hidden ${
          isMobileMode
            ? 'sm:max-w-[412px] sm:h-[860px] sm:rounded-[48px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:border-[8px] sm:border-stone-800'
            : 'max-w-4xl min-h-[92vh] sm:rounded-3xl sm:border border-stone-800 shadow-2xl'
        }`}
        style={{ backgroundColor: bgHex }}
      >
        {/* Mobile Status Bar (Pixel phone style) */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-sm font-medium shrink-0 relative text-stone-800/90 z-20">
          <span className="text-[14px] font-semibold tracking-tight">{timeStr}</span>
          
          {/* Centered Camera Punch-hole */}
          <div className="w-4 h-4 rounded-full bg-stone-900 mx-auto shadow-inner"></div>

          <div className="flex items-center gap-1.5 text-stone-800">
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Dynamic App Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </div>

        {/* Mobile Bottom Gesture Handle Bar */}
        <div className="shrink-0 flex items-center justify-center py-2 z-20">
          <div className="w-32 h-1 bg-stone-900/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
