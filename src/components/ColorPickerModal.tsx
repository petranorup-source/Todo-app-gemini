import React from 'react';
import { Check, X, Palette } from 'lucide-react';
import { ColorThemeKey, COLOR_THEMES } from '../types/todo';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: ColorThemeKey;
  onSelectColor: (colorKey: ColorThemeKey) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  currentColor,
  onSelectColor,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#e4e5eb] text-stone-900 rounded-t-[32px] sm:rounded-[28px] p-5 shadow-2xl border border-stone-300 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-300/80 mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-stone-800" />
            <h3 className="font-bold text-base text-stone-900">List Color Theme</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-300/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 py-2">
          {(Object.keys(COLOR_THEMES) as ColorThemeKey[]).map((key) => {
            const theme = COLOR_THEMES[key];
            const isSelected = currentColor === key;
            return (
              <button
                key={key}
                onClick={() => {
                  onSelectColor(key);
                  onClose();
                }}
                className="flex flex-col items-center gap-1.5 group p-1.5 rounded-2xl hover:bg-black/5 transition"
                title={theme.name}
              >
                <div
                  className="w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-transform group-hover:scale-105 border-2 border-white/60 relative"
                  style={{ backgroundColor: theme.bgHex }}
                >
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-medium text-stone-700 text-center leading-tight truncate w-16">
                  {theme.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
