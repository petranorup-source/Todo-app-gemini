import React, { useState, useRef, useEffect } from 'react';
import {
  GripVertical,
  Check,
  MoreVertical,
  MessageSquare,
  AlertCircle,
  Bell,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { ListItem } from '../types/todo';
import { ItemContextMenu } from './ItemContextMenu';
import { CommentEditor } from './CommentEditor';

interface ListItemRowProps {
  item: ListItem;
  index: number;
  totalItems: number;
  authorName?: string;
  onToggleCheck: (itemId: string) => void;
  onUpdateText: (itemId: string, text: string) => void;
  onSaveComment: (itemId: string, comment: string) => void;
  onDeleteComment: (itemId: string) => void;
  onToggleImportant: (itemId: string) => void;
  onToggleSnooze: (itemId: string) => void;
  onAddTag: (itemId: string, tag: string) => void;
  onRemoveTag: (itemId: string, tag: string) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  highlightQuery?: string;
}

export const ListItemRow: React.FC<ListItemRowProps> = ({
  item,
  index,
  totalItems,
  authorName = 'Petra Norup',
  onToggleCheck,
  onUpdateText,
  onSaveComment,
  onDeleteComment,
  onToggleImportant,
  onToggleSnooze,
  onAddTag,
  onRemoveTag,
  onDeleteItem,
  onMoveUp,
  onMoveDown,
  highlightQuery = '',
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditText(item.text);
  }, [item.text]);

  useEffect(() => {
    if (isEditingText) {
      textInputRef.current?.focus();
    }
  }, [isEditingText]);

  const handleTextSubmit = () => {
    setIsEditingText(false);
    if (editText.trim() !== item.text) {
      onUpdateText(item.id, editText.trim() || 'List item');
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagText.trim()) {
      onAddTag(item.id, newTagText.trim());
      setNewTagText('');
      setIsTagInputOpen(false);
    }
  };

  const isMatchedInSearch =
    highlightQuery &&
    (item.text.toLowerCase().includes(highlightQuery.toLowerCase()) ||
      (item.comment && item.comment.toLowerCase().includes(highlightQuery.toLowerCase())));

  return (
    <div className={`group/item relative transition-all duration-150 py-1 ${isMatchedInSearch ? 'bg-amber-300/30 rounded-xl px-1' : ''}`}>
      <div className="flex items-center gap-2.5 sm:gap-3 py-1">
        {/* 6-dot drag handle (Matches Opening_a_list_39e7bd93.png) */}
        {!item.checked ? (
          <div className="flex items-center gap-0.5 text-current opacity-70 hover:opacity-100 transition shrink-0">
            <div className="p-0.5 cursor-grab active:cursor-grabbing hover:bg-black/10 rounded">
              <GripVertical className="w-5 h-5 stroke-[2.3]" />
            </div>
            {/* Quick reorder buttons visible on hover / touch */}
            <div className="hidden group-hover/item:flex flex-col -space-y-1">
              {index > 0 && (
                <button
                  onClick={() => onMoveUp(index)}
                  className="p-0.5 hover:bg-black/15 rounded text-current"
                  title="Move item up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
              )}
              {index < totalItems - 1 && (
                <button
                  onClick={() => onMoveDown(index)}
                  className="p-0.5 hover:bg-black/15 rounded text-current"
                  title="Move item down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-6 shrink-0"></div>
        )}

        {/* Square Checkbox (Matches screenshot: border-2 rounded square) */}
        <button
          onClick={() => onToggleCheck(item.id)}
          className={`w-5 h-5 rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
            item.checked
              ? 'bg-[#1b2f28] text-white border-2 border-[#1b2f28]'
              : 'border-2 border-current hover:bg-black/10'
          }`}
          aria-label={item.checked ? 'Mark uncompleted' : 'Mark completed'}
        >
          {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Item Text */}
        <div className="flex-1 min-w-0 pr-1">
          {isEditingText ? (
            <input
              ref={textInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleTextSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTextSubmit();
                if (e.key === 'Escape') {
                  setEditText(item.text);
                  setIsEditingText(false);
                }
              }}
              className="w-full bg-white/70 text-current text-base font-medium px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-current"
            />
          ) : (
            <div
              onClick={() => setIsEditingText(true)}
              className={`text-[16px] leading-snug cursor-text select-text transition-all ${
                item.checked
                  ? 'line-through opacity-70 font-normal'
                  : 'font-normal tracking-wide text-current'
              }`}
            >
              {item.text}
            </div>
          )}

          {/* Tags preview underneath */}
          {((item.tags && item.tags.length > 0) || item.isImportant || item.isSnoozed) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {item.isImportant && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-600/20 text-red-950 px-2 py-0.5 rounded-full border border-red-700/30">
                  <AlertCircle className="w-3 h-3" />
                  Important
                </span>
              )}
              {item.isSnoozed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-600/20 text-amber-950 px-2 py-0.5 rounded-full border border-amber-700/30">
                  <Bell className="w-3 h-3" />
                  Snoozed
                </span>
              )}
              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-black/10 text-current px-2 py-0.5 rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => onRemoveTag(item.id, tag)}
                    className="hover:opacity-100 opacity-60 text-xs ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons: Comment indicator & 3-dots Moore button */}
        <div className="flex items-center gap-1 shrink-0">
          {/* If comment exists: show speech bubble (Viewing_comment__edit_by_clicking_b72713c3.png) */}
          {item.comment && (
            <button
              onClick={() => setIsCommentExpanded(!isCommentExpanded)}
              className="p-1 rounded-full text-current opacity-80 hover:opacity-100 hover:bg-black/10 transition"
              title="Click to view/edit comment"
            >
              <MessageSquare className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          {/* 3-dots Moore Menu button (Moore-button_in_list_items_a9833a29.png) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full text-current opacity-60 hover:opacity-100 hover:bg-black/10 transition"
              title="Item options"
            >
              <MoreVertical className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Context menu popup */}
            <ItemContextMenu
              item={item}
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onAddComment={() => {
                setIsCommentExpanded(true);
                setIsCommentEditing(true);
              }}
              onToggleImportant={() => onToggleImportant(item.id)}
              onToggleSnooze={() => onToggleSnooze(item.id)}
              onOpenCustomTags={() => setIsTagInputOpen(true)}
              onDelete={() => onDeleteItem(item.id)}
            />
          </div>
        </div>
      </div>

      {/* Inline Tag Adder Input */}
      {isTagInputOpen && (
        <form
          onSubmit={handleAddCustomTag}
          className="flex items-center gap-2 mt-1.5 ml-8 mr-2 bg-white/60 p-1.5 rounded-xl border border-black/10"
        >
          <input
            type="text"
            value={newTagText}
            onChange={(e) => setNewTagText(e.target.value)}
            placeholder="Enter custom tag (e.g. Urgent, Produce)..."
            className="flex-1 bg-transparent text-xs text-stone-900 placeholder-stone-600 focus:outline-none font-medium px-2"
            autoFocus
          />
          <button
            type="submit"
            className="text-xs font-semibold bg-stone-800 text-white px-2.5 py-1 rounded-lg hover:bg-stone-900"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsTagInputOpen(false)}
            className="text-xs text-stone-600 hover:text-stone-900 px-1"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Comment Bubble & Editor (Matches Adding_comment-1_3814c768.png & Viewing_comment__edit_by_clicking_b72713c3.png) */}
      {(isCommentExpanded || isCommentEditing) && (
        <div className="ml-8 mr-2">
          <CommentEditor
            initialComment={item.comment || ''}
            authorName={item.commentAuthor || authorName}
            isEditing={isCommentEditing}
            onSave={(cmt) => {
              onSaveComment(item.id, cmt);
              setIsCommentEditing(false);
              setIsCommentExpanded(true);
            }}
            onCancel={() => {
              setIsCommentEditing(false);
              if (!item.comment) setIsCommentExpanded(false);
            }}
            onDelete={() => {
              onDeleteComment(item.id);
              setIsCommentEditing(false);
              setIsCommentExpanded(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
