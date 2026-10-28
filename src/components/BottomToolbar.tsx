import React from 'react';
import { Plus, Palette, Undo2, Redo2, MoreVertical } from 'lucide-react';

interface BottomToolbarProps {
  onOpenAddMenu: () => void;
  onOpenColorPalette: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenMoreMenu: () => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  onOpenAddMenu,
  onOpenColorPalette,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenMoreMenu,
}) => {
  return (
    <div className="shrink-0 px-4 py-3 bg-transparent flex items-center justify-between select-none z-30">
      {/* 1. Add menu (+) */}
      <button
        onClick={onOpenAddMenu}
        className="w-12 h-12 rounded-full bg-[#09223f] text-white shadow-md hover:bg-[#06182c] active:scale-95 transition flex items-center justify-center cursor-pointer"
        title="Add list section or invite contributor"
        aria-label="Add options"
      >
        <Plus className="w-6 h-6 stroke-[2.4]" />
      </button>

      {/* 2. Color Palette */}
      <button
        onClick={onOpenColorPalette}
        className="w-12 h-12 rounded-full bg-[#09223f] text-white shadow-md hover:bg-[#06182c] active:scale-95 transition flex items-center justify-center cursor-pointer"
        title="Change list color"
        aria-label="Color palette"
      >
        <Palette className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* 3. Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`w-12 h-12 rounded-full bg-[#09223f] text-white shadow-md active:scale-95 transition flex items-center justify-center cursor-pointer ${
          canUndo ? 'hover:bg-[#06182c] opacity-100' : 'opacity-40 cursor-not-allowed'
        }`}
        title="Undo change"
        aria-label="Undo"
      >
        <Undo2 className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* 4. Redo */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`w-12 h-12 rounded-full bg-[#09223f] text-white shadow-md active:scale-95 transition flex items-center justify-center cursor-pointer ${
          canRedo ? 'hover:bg-[#06182c] opacity-100' : 'opacity-40 cursor-not-allowed'
        }`}
        title="Redo change"
        aria-label="Redo"
      >
        <Redo2 className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* 5. More Menu (...) */}
      <button
        onClick={onOpenMoreMenu}
        className="w-12 h-12 rounded-full bg-[#09223f] text-white shadow-md hover:bg-[#06182c] active:scale-95 transition flex items-center justify-center cursor-pointer"
        title="More list actions"
        aria-label="More list actions"
      >
        <MoreVertical className="w-5 h-5 stroke-[2.2]" />
      </button>
    </div>
  );
};
