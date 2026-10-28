import React, { useState, useEffect, useRef } from 'react';
import { User, Trash2 } from 'lucide-react';

interface CommentEditorProps {
  initialComment?: string;
  authorName?: string;
  isEditing: boolean;
  onSave: (commentText: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const CommentEditor: React.FC<CommentEditorProps> = ({
  initialComment = '',
  authorName = 'Petra Norup',
  isEditing,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [commentText, setCommentText] = useState(initialComment);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCommentText(initialComment);
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [initialComment, isEditing]);

  if (!isEditing && !initialComment) return null;

  return (
    <div className="mt-2 mb-3 bg-[#e8eaef] rounded-[24px] p-3 shadow-md border border-stone-300/80 text-stone-900 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Top row: Avatar + Comment bubble (Matches Adding_comment-1_3814c768.png) */}
      <div className="flex items-center gap-3">
        {/* Contributor Avatar Circle */}
        <div className="w-10 h-10 rounded-full border-2 border-[#09223f] bg-[#f7c4a5] flex items-center justify-center shrink-0 shadow-xs">
          <User className="w-5 h-5 text-[#09223f] stroke-[2.2]" />
        </div>

        {/* Comment Bubble Input / Display */}
        {isEditing ? (
          <div className="flex-1 bg-[#f4f3f9] rounded-2xl px-3.5 py-2 border border-stone-300/60 shadow-inner">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (commentText.trim()) onSave(commentText.trim());
                } else if (e.key === 'Escape') {
                  onCancel();
                }
              }}
              placeholder="Add a comment..."
              className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-500 focus:outline-none font-medium"
            />
          </div>
        ) : (
          <div
            onClick={onCancel} // toggle edit
            className="flex-1 bg-[#f4f3f9] rounded-2xl px-4 py-2 border border-stone-300/60 shadow-xs cursor-pointer hover:bg-white transition"
            title="Click to edit comment"
          >
            <p className="text-sm text-stone-900 font-medium leading-relaxed">
              {initialComment}
            </p>
          </div>
        )}
      </div>

      {/* Bottom actions (Matches Adding_comment-1_3814c768.png: Cancel & Save) */}
      {isEditing ? (
        <div className="flex items-center justify-end gap-3 mt-3 pt-1">
          {initialComment && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="mr-auto text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave(commentText.trim())}
            disabled={!commentText.trim()}
            className="text-sm font-semibold bg-[#d8d9e2] hover:bg-[#cbccd7] text-stone-900 px-5 py-2 rounded-full transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 px-1">
          <span>Comment by {authorName}</span>
          <span className="text-[10px] text-stone-400">Click bubble to edit</span>
        </div>
      )}
    </div>
  );
};
