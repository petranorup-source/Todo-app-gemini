import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  User,
  Check,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { TodoList, COLOR_THEMES, ListItem, ColorThemeKey } from '../types/todo';
import { ListItemRow } from './ListItemRow';
import { BottomToolbar } from './BottomToolbar';
import { BottomSheet, BottomSheetMode } from './BottomSheet';
import { ContributorModal } from './ContributorModal';
import { ColorPickerModal } from './ColorPickerModal';
import { FindInNoteBar } from './FindInNoteBar';

interface ListViewProps {
  list: TodoList;
  onBack: () => void;
  onUpdateList: (updated: TodoList) => void;
  onDeleteList: (listId: string) => void;
  onDuplicateList: (list: TodoList) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  list,
  onBack,
  onUpdateList,
  onDeleteList,
  onDuplicateList,
}) => {
  // Undo/Redo history stack for this list
  const [history, setHistory] = useState<TodoList[]>([list]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active UI modal states
  const [bottomSheetMode, setBottomSheetMode] = useState<BottomSheetMode>(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
  const [isFindInNoteOpen, setIsFindInNoteOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editing state for section & list titles
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleText, setEditingTitleText] = useState(list.title);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionText, setEditingSectionText] = useState('');

  // Quick "+ List item" active section
  const [addingItemToSectionId, setAddingItemToSectionId] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const titleInputRef = useRef<HTMLInputElement>(null);
  const newItemInputRef = useRef<HTMLInputElement>(null);

  const theme = COLOR_THEMES[list.colorTheme] || COLOR_THEMES.sage;

  // Show toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // State commit with history tracking
  const commitListChange = (newList: TodoList) => {
    const nextList = { ...newList, updatedAt: Date.now() };
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(nextList);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    onUpdateList(nextList);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onUpdateList(prev);
      showToast('Undo');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onUpdateList(next);
      showToast('Redo');
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Title edit
  const saveTitle = () => {
    setIsEditingTitle(false);
    if (editingTitleText.trim() !== list.title) {
      commitListChange({
        ...list,
        title: editingTitleText.trim() || 'Untitled list',
      });
    }
  };

  // Add Item to a Section
  const handleAddNewItem = (sectionId: string, text: string) => {
    if (!text.trim()) return;
    const newItem: ListItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      text: text.trim(),
      checked: false,
      createdAt: Date.now(),
    };

    const newSections = list.sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: [...sec.items, newItem],
        };
      }
      return sec;
    });

    commitListChange({ ...list, sections: newSections });
    setNewItemText('');
  };

  // Toggle item check status
  const handleToggleCheck = (itemId: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
    commitListChange({ ...list, sections: newSections });
  };

  // Update item text
  const handleUpdateItemText = (itemId: string, newText: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) =>
        item.id === itemId ? { ...item, text: newText } : item
      ),
    }));
    commitListChange({ ...list, sections: newSections });
  };

  // Save comment on item
  const handleSaveComment = (itemId: string, comment: string) => {
    const author = list.contributors[0]?.name || 'You';
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) =>
        item.id === itemId
          ? { ...item, comment, commentAuthor: item.commentAuthor || author }
          : item
      ),
    }));
    commitListChange({ ...list, sections: newSections });
    showToast('Comment saved');
  };

  // Delete comment on item
  const handleDeleteComment = (itemId: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) =>
        item.id === itemId
          ? { ...item, comment: undefined, commentAuthor: undefined }
          : item
      ),
    }));
    commitListChange({ ...list, sections: newSections });
    showToast('Comment deleted');
  };

  // Toggle Important tag
  const handleToggleImportant = (itemId: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) =>
        item.id === itemId ? { ...item, isImportant: !item.isImportant } : item
      ),
    }));
    commitListChange({ ...list, sections: newSections });
  };

  // Toggle Snooze
  const handleToggleSnooze = (itemId: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) =>
        item.id === itemId ? { ...item, isSnoozed: !item.isSnoozed } : item
      ),
    }));
    commitListChange({ ...list, sections: newSections });
  };

  // Add tag
  const handleAddTag = (itemId: string, tag: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) => {
        if (item.id === itemId) {
          const tags = item.tags ? [...item.tags] : [];
          if (!tags.includes(tag)) tags.push(tag);
          return { ...item, tags };
        }
        return item;
      }),
    }));
    commitListChange({ ...list, sections: newSections });
  };

  // Remove tag
  const handleRemoveTag = (itemId: string, tag: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.map((item) => {
        if (item.id === itemId && item.tags) {
          return { ...item, tags: item.tags.filter((t) => t !== tag) };
        }
        return item;
      }),
    }));
    commitListChange({ ...list, sections: newSections });
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    const newSections = list.sections.map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => item.id !== itemId),
    }));
    commitListChange({ ...list, sections: newSections });
    showToast('Item deleted');
  };

  // Move item up / down within section
  const handleMoveItem = (sectionId: string, fromIndex: number, toIndex: number) => {
    const newSections = list.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const unChecked = sec.items.filter((i) => !i.checked);
      const checked = sec.items.filter((i) => i.checked);
      if (toIndex < 0 || toIndex >= unChecked.length) return sec;

      const itemToMove = unChecked[fromIndex];
      const reordered = [...unChecked];
      reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, itemToMove);
      return {
        ...sec,
        items: [...reordered, ...checked],
      };
    });
    commitListChange({ ...list, sections: newSections });
  };

  // Add New Section
  const handleAddNewSection = () => {
    const newSectionTitle = `Section ${list.sections.length + 1}`;
    const newSection = {
      id: 'sec-' + Date.now(),
      title: newSectionTitle,
      isCollapsed: false,
      items: [],
    };
    commitListChange({
      ...list,
      sections: [...list.sections, newSection],
    });
    showToast(`Added "${newSectionTitle}"`);
  };

  // Toggle section collapse
  const handleToggleSectionCollapse = (sectionId: string) => {
    const newSections = list.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, isCollapsed: !sec.isCollapsed } : sec
    );
    commitListChange({ ...list, sections: newSections });
  };

  // Save section title
  const handleSaveSectionTitle = (sectionId: string) => {
    if (editingSectionText.trim()) {
      const newSections = list.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, title: editingSectionText.trim() } : sec
      );
      commitListChange({ ...list, sections: newSections });
    }
    setEditingSectionId(null);
  };

  // Delete section
  const handleDeleteSection = (sectionId: string) => {
    if (list.sections.length <= 1) {
      showToast('Cannot delete the only section');
      return;
    }
    const newSections = list.sections.filter((sec) => sec.id !== sectionId);
    commitListChange({ ...list, sections: newSections });
    showToast('Section deleted');
  };

  // Color picker
  const handleSelectColor = (colorKey: ColorThemeKey) => {
    commitListChange({ ...list, colorTheme: colorKey });
  };

  // Add contributor
  const handleAddContributor = (name: string, email: string) => {
    const newContributor = {
      id: 'contrib-' + Date.now(),
      name,
      email,
      avatarColor: '#f7c4a5',
    };
    commitListChange({
      ...list,
      contributors: [...list.contributors, newContributor],
    });
    showToast(`Invited ${name}`);
  };

  const handleRemoveContributor = (id: string) => {
    commitListChange({
      ...list,
      contributors: list.contributors.filter((c) => c.id !== id),
    });
    showToast('Contributor removed');
  };

  // Share / Send
  const handleSendList = () => {
    let text = `${list.title}\n\n`;
    list.sections.forEach((sec) => {
      text += `--- ${sec.title} ---\n`;
      sec.items.forEach((item) => {
        text += `[${item.checked ? 'x' : ' '}] ${item.text}${
          item.comment ? ` (Note: ${item.comment})` : ''
        }\n`;
      });
      text += '\n';
    });

    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        showToast('List copied to clipboard!');
      })
      .catch(() => {
        showToast('Shared list copied');
      });
  };

  // Checked items across all sections (or grouped)
  const allCheckedItems = useMemo(() => {
    return list.sections.flatMap((s) => s.items.filter((i) => i.checked));
  }, [list.sections]);

  // Search match count in note
  const matchCount = useMemo(() => {
    if (!findQuery) return 0;
    const q = findQuery.toLowerCase();
    let count = 0;
    list.sections.forEach((s) => {
      s.items.forEach((i) => {
        if (i.text.toLowerCase().includes(q) || (i.comment && i.comment.toLowerCase().includes(q))) {
          count++;
        }
      });
    });
    return count;
  }, [findQuery, list.sections]);

  return (
    <div
      className={`flex-1 flex flex-col min-h-0 select-none transition-colors duration-300 font-sans ${theme.bgClass} ${theme.textClass} relative`}
    >
      {/* Top Header Bar (Matches New_list_740c9024.png & Opening_a_list_39e7bd93.png) */}
      <div className="px-4 pt-2.5 pb-2 shrink-0 flex items-center justify-between z-20">
        {/* Back Button & Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-current opacity-80 hover:opacity-100 hover:bg-black/10 rounded-full transition cursor-pointer"
            aria-label="Back to all lists"
            title="Back to all lists"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.3]" />
          </button>

          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editingTitleText}
              onChange={(e) => setEditingTitleText(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTitle();
                if (e.key === 'Escape') {
                  setEditingTitleText(list.title);
                  setIsEditingTitle(false);
                }
              }}
              className="text-[22px] font-medium tracking-tight bg-white/60 text-current px-2 py-0.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-current flex-1 max-w-xs"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => {
                setIsEditingTitle(true);
                setEditingTitleText(list.title);
              }}
              className="text-[22px] font-normal tracking-tight text-current truncate cursor-pointer hover:opacity-80 py-0.5"
              title="Click to rename list"
            >
              {list.title || 'List title'}
            </h1>
          )}
        </div>

        {/* Contributor Avatar in Top Right (Matches Viewing_contributor_99f5508e.png) */}
        {list.contributors.length > 0 ? (
          <button
            onClick={() => setIsContributorModalOpen(true)}
            className="w-9 h-9 rounded-full border-2 border-current bg-[#f7c4a5] flex items-center justify-center shrink-0 shadow-xs hover:scale-105 transition cursor-pointer relative"
            title={`Contributor: ${list.contributors[0].name} (${list.contributors.length} total)`}
          >
            <User className="w-5 h-5 text-stone-900 stroke-[2.2]" />
            {list.contributors.length > 1 && (
              <span className="absolute -bottom-1 -right-1 bg-stone-900 text-white text-[9px] font-bold px-1 rounded-full">
                +{list.contributors.length - 1}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setIsContributorModalOpen(true)}
            className="p-1.5 rounded-full text-current opacity-70 hover:opacity-100 hover:bg-black/10 transition"
            title="Invite contributor"
          >
            <User className="w-5 h-5 stroke-[2]" />
          </button>
        )}
      </div>

      {/* Find In Note Bar (if opened from 3 dots) */}
      {isFindInNoteOpen && (
        <FindInNoteBar
          query={findQuery}
          onChangeQuery={setFindQuery}
          onClose={() => {
            setIsFindInNoteOpen(false);
            setFindQuery('');
          }}
          matchCount={matchCount}
        />
      )}

      {/* Main Scrollable Content: Sections, Items, and Checked items */}
      <div className="flex-1 overflow-y-auto px-5 py-2 scroll-smooth">
        {list.sections.map((section) => {
          const uncheckedItems = section.items.filter((i) => !i.checked);
          const isAdding = addingItemToSectionId === section.id;

          return (
            <div key={section.id} className="mb-6">
              {/* Section Header: e.g. "Weekly Shopping v" (Matches Opening_a_list_39e7bd93.png) */}
              <div className="flex items-center justify-between mb-3 group/sec">
                {editingSectionId === section.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingSectionText}
                      onChange={(e) => setEditingSectionText(e.target.value)}
                      onBlur={() => handleSaveSectionTitle(section.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveSectionTitle(section.id);
                        if (e.key === 'Escape') setEditingSectionId(null);
                      }}
                      className="text-lg font-medium bg-white/70 text-current px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-current"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleSectionCollapse(section.id)}
                      className="flex items-center gap-2 text-current text-left hover:opacity-80 transition py-1"
                    >
                      <h2 className="text-[19px] font-normal tracking-tight text-current truncate">
                        {section.title || 'Title'}
                      </h2>
                      {section.isCollapsed ? (
                        <ChevronRight className="w-4 h-4 stroke-[2.3] opacity-80" />
                      ) : (
                        <ChevronDown className="w-4 h-4 stroke-[2.3] opacity-80" />
                      )}
                    </button>
                    {/* Section edit / delete options */}
                    <div className="hidden group-sec:flex items-center gap-1 ml-2 opacity-60 hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingSectionId(section.id);
                          setEditingSectionText(section.title);
                        }}
                        className="p-1 hover:bg-black/10 rounded"
                        title="Rename section"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {list.sections.length > 1 && (
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1 hover:bg-black/10 rounded hover:text-red-700"
                          title="Delete section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Unchecked Items List */}
              {!section.isCollapsed && (
                <div className="space-y-1">
                  {uncheckedItems.map((item, index) => (
                    <ListItemRow
                      key={item.id}
                      item={item}
                      index={index}
                      totalItems={uncheckedItems.length}
                      authorName={list.contributors[0]?.name || 'Petra Norup'}
                      onToggleCheck={handleToggleCheck}
                      onUpdateText={handleUpdateItemText}
                      onSaveComment={handleSaveComment}
                      onDeleteComment={handleDeleteComment}
                      onToggleImportant={handleToggleImportant}
                      onToggleSnooze={handleToggleSnooze}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                      onDeleteItem={handleDeleteItem}
                      onMoveUp={(idx) => handleMoveItem(section.id, idx, idx - 1)}
                      onMoveDown={(idx) => handleMoveItem(section.id, idx, idx + 1)}
                      highlightQuery={findQuery}
                    />
                  ))}

                  {/* Quick Inline "+ List item" Row (Matches New_list_740c9024.png) */}
                  {isAdding ? (
                    <div className="flex items-center gap-3 py-2 pl-9">
                      <input
                        ref={newItemInputRef}
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newItemText.trim()) {
                              handleAddNewItem(section.id, newItemText);
                            }
                          } else if (e.key === 'Escape') {
                            setAddingItemToSectionId(null);
                            setNewItemText('');
                          }
                        }}
                        placeholder="List item..."
                        className="flex-1 bg-white/70 text-current text-base px-2.5 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-current placeholder-current/50 font-normal"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          if (newItemText.trim()) {
                            handleAddNewItem(section.id, newItemText);
                          }
                        }}
                        className="text-xs font-semibold bg-[#09223f] text-white px-3 py-1.5 rounded-lg hover:bg-[#07182c]"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingItemToSectionId(null);
                          setNewItemText('');
                        }}
                        className="text-xs text-current opacity-70 hover:opacity-100"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAddingItemToSectionId(section.id);
                        setTimeout(() => newItemInputRef.current?.focus(), 50);
                      }}
                      className="flex items-center gap-3 py-2 text-current opacity-80 hover:opacity-100 pl-9 transition text-base font-normal tracking-wide"
                    >
                      <Plus className="w-4 h-4 stroke-[2.3]" />
                      <span>List item</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Collapsible "Checked items" Section (Matches Opening_a_list_39e7bd93.png) */}
        {allCheckedItems.length > 0 && (
          <div className="mt-8 pt-4 border-t border-black/10">
            <button
              onClick={() =>
                commitListChange({
                  ...list,
                  checkedItemsCollapsed: !list.checkedItemsCollapsed,
                })
              }
              className="flex items-center gap-2 text-current hover:opacity-80 transition py-1 mb-3 w-full"
            >
              <h3 className="text-[19px] font-normal tracking-tight text-current">
                Checked items ({allCheckedItems.length})
              </h3>
              {list.checkedItemsCollapsed ? (
                <ChevronRight className="w-4 h-4 stroke-[2.3] opacity-80" />
              ) : (
                <ChevronDown className="w-4 h-4 stroke-[2.3] opacity-80" />
              )}
            </button>

            {!list.checkedItemsCollapsed && (
              <div className="space-y-1">
                {allCheckedItems.map((item, index) => (
                  <ListItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    totalItems={allCheckedItems.length}
                    authorName={list.contributors[0]?.name || 'Petra Norup'}
                    onToggleCheck={handleToggleCheck}
                    onUpdateText={handleUpdateItemText}
                    onSaveComment={handleSaveComment}
                    onDeleteComment={handleDeleteComment}
                    onToggleImportant={handleToggleImportant}
                    onToggleSnooze={handleToggleSnooze}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    onDeleteItem={handleDeleteItem}
                    onMoveUp={() => {}}
                    onMoveDown={() => {}}
                    highlightQuery={findQuery}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Fixed Action Toolbar (Matches Opening_a_list_39e7bd93.png) */}
      <BottomToolbar
        onOpenAddMenu={() => setBottomSheetMode('add_menu')}
        onOpenColorPalette={() => setIsColorModalOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onOpenMoreMenu={() => setBottomSheetMode('more_menu')}
      />

      {/* Material 3 Bottom Sheets */}
      <BottomSheet
        mode={bottomSheetMode}
        onClose={() => setBottomSheetMode(null)}
        onAddNewSection={handleAddNewSection}
        onOpenInviteContributor={() => setIsContributorModalOpen(true)}
        onFindInNote={() => setIsFindInNoteOpen(true)}
        onMakeCopy={() => {
          onDuplicateList(list);
          showToast('Copy created');
        }}
        onSendList={handleSendList}
        onDeleteList={() => onDeleteList(list.id)}
      />

      {/* Contributor Modal */}
      <ContributorModal
        isOpen={isContributorModalOpen}
        onClose={() => setIsContributorModalOpen(false)}
        contributors={list.contributors}
        onAddContributor={handleAddContributor}
        onRemoveContributor={handleRemoveContributor}
      />

      {/* Color Palette Modal */}
      <ColorPickerModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        currentColor={list.colorTheme}
        onSelectColor={handleSelectColor}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#09223f] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
