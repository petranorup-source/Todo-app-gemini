import React, { useState, useMemo } from 'react';
import {
  Menu,
  Search,
  LayoutGrid,
  StretchHorizontal,
  ArrowUpDown,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  Users,
  MessageSquare,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react';
import { TodoList, COLOR_THEMES } from '../types/todo';

interface HomeViewProps {
  lists: TodoList[];
  onOpenList: (listId: string) => void;
  onCreateNewList: () => void;
  onDeleteList: (listId: string) => void;
  onResetDemo: () => void;
  onClearEmpty: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lists,
  onOpenList,
  onCreateNewList,
  onDeleteList,
  onResetDemo,
  onClearEmpty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'items'>('updated');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    lists.forEach((list) => {
      list.sections.forEach((sec) => {
        sec.items.forEach((item) => {
          if (item.tags) item.tags.forEach((t) => tags.add(t));
          if (item.isImportant) tags.add('Important');
        });
      });
    });
    return Array.from(tags);
  }, [lists]);

  // Filter & Sort
  const filteredLists = useMemo(() => {
    let result = lists.filter((list) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        list.title.toLowerCase().includes(q) ||
        list.sections.some((sec) =>
          sec.title.toLowerCase().includes(q) ||
          sec.items.some(
            (item) =>
              item.text.toLowerCase().includes(q) ||
              (item.comment && item.comment.toLowerCase().includes(q))
          )
        );

      const matchesTag =
        !selectedTagFilter ||
        list.sections.some((sec) =>
          sec.items.some(
            (item) =>
              (selectedTagFilter === 'Important' && item.isImportant) ||
              (item.tags && item.tags.includes(selectedTagFilter))
          )
        );

      return matchesQuery && matchesTag;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'items') {
        const countA = a.sections.reduce((acc, s) => acc + s.items.length, 0);
        const countB = b.sections.reduce((acc, s) => acc + s.items.length, 0);
        return countB - countA;
      }
      return b.updatedAt - a.updatedAt;
    });

    return result;
  }, [lists, searchQuery, selectedTagFilter, sortBy]);

  const toggleSort = () => {
    if (sortBy === 'updated') setSortBy('title');
    else if (sortBy === 'title') setSortBy('items');
    else setSortBy('updated');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#e4e5e9] text-[#1f2937] relative font-sans select-none">
      {/* Top Search Pill Header (Matches Home-empty_7218dac7.png) */}
      <div className="px-4 pt-3 pb-3 shrink-0">
        <div className="flex items-center justify-between bg-[#f0f2f5] rounded-full px-3.5 py-2.5 shadow-sm border border-stone-300/60">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 -ml-1 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-200/70 transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Search Input */}
          <div className="flex-1 mx-2 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-base text-stone-800 placeholder-stone-600 focus:outline-none font-medium px-1"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Icons: Grid/List View & Sort */}
          <div className="flex items-center gap-1 text-stone-700">
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="p-1.5 hover:text-stone-900 rounded-full hover:bg-stone-200/70 transition"
              title={isGridView ? 'Switch to Column View' : 'Switch to Grid View'}
            >
              {isGridView ? (
                <StretchHorizontal className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
              )}
            </button>
            <button
              onClick={toggleSort}
              className="p-1.5 hover:text-stone-900 rounded-full hover:bg-stone-200/70 transition"
              title={`Sorting by: ${sortBy}. Click to change.`}
            >
              <ArrowUpDown className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Active Tag filter indicator */}
        {selectedTagFilter && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <span className="text-xs text-stone-500 font-medium">Filtered by:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-300 text-stone-800">
              <Tag className="w-3 h-3" />
              {selectedTagFilter}
              <button
                onClick={() => setSelectedTagFilter(null)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 scroll-smooth">
        {/* If no lists or empty filter: Show the exact mockup empty state from Home-empty_7218dac7.png */}
        {filteredLists.length === 0 ? (
          <div className="flex flex-col items-center pt-8 pb-4">
            <h2 className="text-[22px] sm:text-2xl font-normal text-[#383a4f] text-center mb-8 tracking-tight">
              {searchQuery ? 'No matching lists found' : 'Lists you add appear here'}
            </h2>

            {/* Stylized Empty State Cards Stack (Pixel-perfect recreation of Home-empty_7218dac7.png) */}
            <div className="w-full max-w-[340px] space-y-3.5 opacity-95">
              {/* Card 1: Deep Purple Card */}
              <div
                onClick={onCreateNewList}
                className="bg-[#482098] rounded-2xl p-4 shadow-sm hover:scale-[1.01] transition-transform cursor-pointer space-y-2.5"
                title="Click to create a list"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#7654d0] shrink-0"></div>
                  <div className="h-6 bg-[#7654d0] rounded-full w-44"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#7654d0] shrink-0"></div>
                  <div className="h-6 bg-[#7654d0] rounded-full w-56"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#7654d0] shrink-0"></div>
                  <div className="h-6 bg-[#7654d0] rounded-full w-44"></div>
                </div>
              </div>

              {/* Card 2: Warm Terracotta Card */}
              <div
                onClick={onCreateNewList}
                className="bg-[#d59e7e] rounded-2xl p-4 shadow-sm hover:scale-[1.01] transition-transform cursor-pointer space-y-2.5"
                title="Click to create a list"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#e8c0a2] shrink-0"></div>
                  <div className="h-6 bg-[#e8c0a2] rounded-full w-44"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#e8c0a2] shrink-0"></div>
                  <div className="h-6 bg-[#e8c0a2] rounded-full w-56"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#e8c0a2] shrink-0"></div>
                  <div className="h-6 bg-[#e8c0a2] rounded-full w-44"></div>
                </div>
              </div>

              {/* Card 3: Lavender / Slate Grey Card */}
              <div
                onClick={onCreateNewList}
                className="bg-[#9c9aa8] rounded-2xl p-4 shadow-sm hover:scale-[1.01] transition-transform cursor-pointer space-y-2.5"
                title="Click to create a list"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#737281] shrink-0"></div>
                  <div className="h-6 bg-[#737281] rounded-full w-44"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#737281] shrink-0"></div>
                  <div className="h-6 bg-[#737281] rounded-full w-56"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-[#737281] shrink-0"></div>
                  <div className="h-6 bg-[#737281] rounded-full w-44"></div>
                </div>
              </div>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-sm text-stone-600 underline font-medium"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          /* Render Active Lists */
          <div
            className={`grid gap-3 pt-2 ${
              isGridView ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {filteredLists.map((list) => {
              const theme = COLOR_THEMES[list.colorTheme] || COLOR_THEMES.sage;
              const allItems = list.sections.flatMap((s) => s.items);
              const unchecked = allItems.filter((i) => !i.checked);
              const checked = allItems.filter((i) => i.checked);
              const previewItems = unchecked.slice(0, 4);

              return (
                <div
                  key={list.id}
                  onClick={() => onOpenList(list.id)}
                  className={`rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 border border-black/5 hover:-translate-y-0.5 relative group ${theme.bgClass} ${theme.textClass}`}
                >
                  {/* List Header */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                      {list.title || 'Untitled list'}
                    </h3>
                    {list.contributors.length > 0 && (
                      <div
                        className="w-6 h-6 rounded-full border border-stone-800 bg-[#f7c4a5] flex items-center justify-center shrink-0 shadow-xs"
                        title={`Contributor: ${list.contributors[0].name}`}
                      >
                        <span className="text-[10px] font-bold text-stone-800">
                          {list.contributors[0].name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Section indicator if multiple sections */}
                  {list.sections.length > 1 && (
                    <div className="text-[11px] font-medium opacity-75 mb-1.5">
                      {list.sections.length} sections
                    </div>
                  )}

                  {/* Items Preview */}
                  <div className="space-y-1.5 mb-3">
                    {previewItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm leading-snug"
                      >
                        <div className="w-3.5 h-3.5 rounded-sm border border-current shrink-0 opacity-70"></div>
                        <span className="truncate flex-1 font-normal">
                          {item.text || 'List item'}
                        </span>
                        {item.comment && (
                          <MessageSquare className="w-3 h-3 shrink-0 opacity-80" />
                        )}
                        {item.isImportant && (
                          <span className="text-[10px] font-bold bg-red-500/20 text-red-900 px-1 rounded">
                            !
                          </span>
                        )}
                      </div>
                    ))}

                    {unchecked.length > 4 && (
                      <div className="text-xs opacity-75 italic pl-5.5">
                        +{unchecked.length - 4} more items
                      </div>
                    )}

                    {previewItems.length === 0 && checked.length > 0 && (
                      <div className="text-xs opacity-75 italic pl-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                        All {checked.length} items checked
                      </div>
                    )}

                    {allItems.length === 0 && (
                      <div className="text-xs opacity-60 italic">Empty list</div>
                    )}
                  </div>

                  {/* Footer info: checked count */}
                  {checked.length > 0 && (
                    <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs opacity-80 font-medium">
                      <span>{checked.length} checked</span>
                      <span className="text-[10px] opacity-70">
                        {new Date(list.updatedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) (Matches Home-empty_7218dac7.png bottom right) */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          onClick={onCreateNewList}
          className="w-16 h-16 rounded-[22px] bg-[#002244] text-white shadow-xl hover:bg-[#001730] active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
          title="Create new list"
          aria-label="Add new list"
        >
          <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Drawer Menu / Sidebar Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-xs"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-72 max-w-[80vw] h-full bg-[#f4f5f8] text-stone-800 shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#002244] text-white flex items-center justify-center font-bold">
                  L
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 leading-tight">
                    Listify
                  </h3>
                  <p className="text-xs text-stone-500">Todo & Notes</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tags / Categories */}
            <div className="py-3 flex-1 overflow-y-auto">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                Tags & Labels
              </div>

              <button
                onClick={() => {
                  setSelectedTagFilter(null);
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  selectedTagFilter === null
                    ? 'bg-stone-200/80 text-stone-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <StretchHorizontal className="w-4 h-4" />
                <span>All Notes</span>
                <span className="ml-auto text-xs opacity-60">{lists.length}</span>
              </button>

              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTagFilter(tag);
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    selectedTagFilter === tag
                      ? 'bg-stone-200/80 text-stone-900 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span className="truncate">{tag}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-stone-200">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Sample & State
                </div>

                <button
                  onClick={() => {
                    onResetDemo();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-700 hover:bg-stone-100 transition"
                >
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>Restore Demo (Grocery list)</span>
                </button>

                <button
                  onClick={() => {
                    onClearEmpty();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-700 hover:bg-stone-100 transition"
                >
                  <Trash2 className="w-4 h-4 text-stone-500" />
                  <span>Clear All (View Empty State)</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500 text-center">
              Works 100% in browser with auto-save
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
