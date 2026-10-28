import React, { useEffect, useRef } from 'react';
import { MessageSquare, Pencil, AlertCircle, Bell, Trash2, X } from 'lucide-react';
import { ListItem } from '../types/todo';

interface ItemContextMenuProps {
  item: ListItem;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: () => void;
  onToggleImportant: () => void;
  onToggleSnooze: () => void;
  onOpenCustomTags: () => void;
  onDelete: () => void;
  position?: { top: number; right: number };
}

export const ItemContextMenu: React.FC<ItemContextMenuProps> = ({
  item,
  isOpen,
  onClose,
  onAddComment,
  onToggleImportant,
  onToggleSnooze,
  onOpenCustomTags,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-2 top-8 z-50 w-52 bg-[#e4e5ea] text-[#1f2937] rounded-2xl shadow-xl border border-stone-300/80 py-1.5 animate-in fade-in zoom-in-95 duration-150 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Add comment */}
      <button
        onClick={() => {
          onAddComment();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-stone-800 hover:bg-stone-300/60 transition text-left"
      >
        <MessageSquare className="w-4 h-4 text-stone-700" />
        <span>{item.comment ? 'Edit comment' : 'Add comment'}</span>
      </button>

      <div className="h-[1px] bg-stone-300/80 my-1 mx-2"></div>

      {/* Custom tags */}
      <button
        onClick={() => {
          onOpenCustomTags();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3.5 py-2 text-sm font-medium text-stone-800 hover:bg-stone-300/60 transition text-left"
      >
        <span className="text-stone-800">Custom tags</span>
        <Pencil className="w-3.5 h-3.5 text-stone-600" />
      </button>

      {/* Important */}
      <button
        onClick={() => {
          onToggleImportant();
          onClose();
        }}
        className={`w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium transition text-left ${
          item.isImportant
            ? 'bg-red-100/80 text-red-800 font-semibold'
            : 'text-stone-800 hover:bg-stone-300/60'
        }`}
      >
        <AlertCircle className={`w-4 h-4 ${item.isImportant ? 'text-red-600' : 'text-stone-700'}`} />
        <span>{item.isImportant ? 'Remove Important' : 'Important'}</span>
      </button>

      {/* Snooze */}
      <button
        onClick={() => {
          onToggleSnooze();
          onClose();
        }}
        className={`w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium transition text-left ${
          item.isSnoozed
            ? 'bg-amber-100/80 text-amber-800 font-semibold'
            : 'text-stone-800 hover:bg-stone-300/60'
        }`}
      >
        <Bell className={`w-4 h-4 ${item.isSnoozed ? 'text-amber-600' : 'text-stone-700'}`} />
        <span>{item.isSnoozed ? 'Un-snooze' : 'Snooze'}</span>
      </button>

      <div className="h-[1px] bg-stone-300/80 my-1 mx-2"></div>

      {/* Delete */}
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-stone-800 hover:bg-red-100 hover:text-red-700 transition text-left"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
};
