import React from 'react';
import { Search, X } from 'lucide-react';

interface FindInNoteBarProps {
  query: string;
  onChangeQuery: (query: string) => void;
  onClose: () => void;
  matchCount: number;
}

export const FindInNoteBar: React.FC<FindInNoteBarProps> = ({
  query,
  onChangeQuery,
  onClose,
  matchCount,
}) => {
  return (
    <div className="px-4 py-2 bg-white/40 backdrop-blur-md border-b border-black/10 flex items-center gap-2 animate-in slide-in-from-top duration-200">
      <Search className="w-4 h-4 text-stone-700 shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => onChangeQuery(e.target.value)}
        placeholder="Find in note..."
        className="flex-1 bg-transparent text-sm text-stone-900 placeholder-stone-600 focus:outline-none font-medium"
        autoFocus
      />
      {query && (
        <span className="text-xs font-semibold text-stone-600 px-1.5 py-0.5 rounded bg-stone-200/80">
          {matchCount} found
        </span>
      )}
      <button
        onClick={onClose}
        className="p-1 rounded-full text-stone-600 hover:text-stone-900 hover:bg-black/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
