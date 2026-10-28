import React, { useState } from 'react';
import { User, UserPlus, X, Trash2, Mail, Check } from 'lucide-react';
import { Contributor } from '../types/todo';

interface ContributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributors: Contributor[];
  onAddContributor: (name: string, email: string) => void;
  onRemoveContributor: (id: string) => void;
}

export const ContributorModal: React.FC<ContributorModalProps> = ({
  isOpen,
  onClose,
  contributors,
  onAddContributor,
  onRemoveContributor,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setError('Please enter an email or name');
      return;
    }
    const derivedName = nameInput.trim() || emailInput.split('@')[0] || 'Friend';
    onAddContributor(derivedName, emailInput.trim());
    setEmailInput('');
    setNameInput('');
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#e8e9ef] text-stone-900 rounded-[28px] p-5 shadow-2xl border border-stone-300 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-300/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#09223f] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Invite Contributor</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-300/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing contributors */}
        <div className="py-3">
          <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
            Shared with ({contributors.length})
          </p>
          {contributors.length === 0 ? (
            <div className="text-xs text-stone-500 italic py-2">
              No contributors yet. Invite someone below!
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {contributors.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/70 border border-stone-200 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-stone-800 bg-[#f7c4a5] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-stone-800" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-stone-900 truncate">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">{c.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveContributor(c.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition"
                    title="Remove contributor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite form */}
        <form onSubmit={handleSubmit} className="pt-2 border-t border-stone-300/80 space-y-2.5">
          <div className="text-xs font-semibold text-stone-700">Add person</div>
          <div>
            <input
              type="text"
              placeholder="Name (e.g. Alex)"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-white text-sm text-stone-900 rounded-xl px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#09223f] placeholder-stone-400 font-medium"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email (e.g. alex@example.com)"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-white text-sm text-stone-900 rounded-xl px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#09223f] placeholder-stone-400 font-medium"
            />
          </div>

          {error && <div className="text-xs text-red-600 font-medium">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-300/60 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-[#09223f] text-white hover:bg-[#07182c] rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
