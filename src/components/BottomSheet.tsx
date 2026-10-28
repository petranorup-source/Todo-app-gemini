import React, { useEffect, useRef } from 'react';
import {
  Search,
  Copy,
  Share2,
  UserPlus,
  Trash2,
  FolderPlus,
  X,
} from 'lucide-react';

export type BottomSheetMode = 'add_menu' | 'more_menu' | null;

interface BottomSheetProps {
  mode: BottomSheetMode;
  onClose: () => void;
  onAddNewSection: () => void;
  onOpenInviteContributor: () => void;
  onFindInNote: () => void;
  onMakeCopy: () => void;
  onSendList: () => void;
  onDeleteList: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  mode,
  onClose,
  onAddNewSection,
  onOpenInviteContributor,
  onFindInNote,
  onMakeCopy,
  onSendList,
  onDeleteList,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (mode) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, onClose]);

  if (!mode) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#e4e5eb] text-stone-900 rounded-t-[32px] pt-3 pb-8 px-5 shadow-2xl border-t border-stone-300 animate-in slide-in-from-bottom duration-250 select-none"
      >
        {/* Top Handle Pill (Matches screenshot) */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-stone-500/70 rounded-full"></div>
        </div>

        {/* 1. Add Menu Mode (ad_section___button_on_toolbar_8a90f5d7.png) */}
        {mode === 'add_menu' && (
          <div className="space-y-1">
            <button
              onClick={() => {
                onAddNewSection();
                onClose();
              }}
              className="w-full text-left px-4 py-3.5 text-base font-normal text-stone-900 hover:bg-stone-300/60 rounded-2xl transition flex items-center gap-3.5"
            >
              <FolderPlus className="w-5 h-5 text-stone-700" />
              <span>Add new list section</span>
            </button>

            <button
              onClick={() => {
                onOpenInviteContributor();
                onClose();
              }}
              className="w-full text-left px-4 py-3.5 text-base font-normal text-stone-900 hover:bg-stone-300/60 rounded-2xl transition flex items-center gap-3.5"
            >
              <UserPlus className="w-5 h-5 text-stone-700" />
              <span>Invite contributor</span>
            </button>
          </div>
        )}

        {/* 2. More Menu Mode (Toolbar-invite_contributor_0eeb094e.png) */}
        {mode === 'more_menu' && (
          <div className="space-y-1">
            {/* Find in note */}
            <button
              onClick={() => {
                onFindInNote();
                onClose();
              }}
              className="w-full text-left px-4 py-3 text-base font-normal text-stone-900 hover:bg-stone-300/60 rounded-2xl transition flex items-center gap-3.5"
            >
              <Search className="w-5 h-5 text-stone-700" />
              <span>Find in note</span>
            </button>

            {/* Make a copy */}
            <button
              onClick={() => {
                onMakeCopy();
                onClose();
              }}
              className="w-full text-left px-4 py-3 text-base font-normal text-stone-900 hover:bg-stone-300/60 rounded-2xl transition flex items-center gap-3.5"
            >
              <Copy className="w-5 h-5 text-stone-700" />
              <span>Make a copy</span>
            </button>

            {/* Send */}
            <button
              onClick={() => {
                onSendList();
                onClose();
              }}
              className="w-full text-left px-4 py-3 text-base font-normal text-stone-900 hover:bg-stone-300/60 rounded-2xl transition flex items-center gap-3.5"
            >
              <Share2 className="w-5 h-5 text-stone-700" />
              <span>Send</span>
            </button>

            {/* Invite contributor (highlighted pill in screenshot) */}
            <button
              onClick={() => {
                onOpenInviteContributor();
                onClose();
              }}
              className="w-full text-left px-4 py-3 text-base font-normal text-stone-900 bg-stone-300/70 hover:bg-stone-300 rounded-2xl transition flex items-center gap-3.5"
            >
              <UserPlus className="w-5 h-5 text-stone-800" />
              <span>Invite contributor</span>
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                onDeleteList();
                onClose();
              }}
              className="w-full text-left px-4 py-3 text-base font-normal text-stone-900 hover:bg-red-100 hover:text-red-700 rounded-2xl transition flex items-center gap-3.5"
            >
              <Trash2 className="w-5 h-5 text-stone-700" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
