export interface ListItem {
  id: string;
  text: string;
  checked: boolean;
  comment?: string;
  commentAuthor?: string;
  tags?: string[];
  isImportant?: boolean;
  isSnoozed?: boolean;
  snoozeDate?: string;
  createdAt: number;
}

export interface ListSection {
  id: string;
  title: string;
  isCollapsed?: boolean;
  items: ListItem[];
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

export type ColorThemeKey =
  | 'sage'
  | 'purple'
  | 'terracotta'
  | 'slate'
  | 'peach'
  | 'ocean'
  | 'clay'
  | 'default';

export interface ColorThemeDef {
  key: ColorThemeKey;
  name: string;
  bgHex: string;
  bgClass: string;
  textClass: string;
  subtextClass: string;
  borderClass: string;
  cardPreviewBg: string;
  accentBtnClass: string;
}

export interface TodoList {
  id: string;
  title: string;
  colorTheme: ColorThemeKey;
  sections: ListSection[];
  checkedItemsCollapsed?: boolean;
  contributors: Contributor[];
  updatedAt: number;
  createdAt: number;
}

export const COLOR_THEMES: Record<ColorThemeKey, ColorThemeDef> = {
  sage: {
    key: 'sage',
    name: 'Sage Green',
    bgHex: '#759c8f',
    bgClass: 'bg-[#759c8f]',
    textClass: 'text-[#1d352c]',
    subtextClass: 'text-[#304e43]',
    borderClass: 'border-[#5e8477]',
    cardPreviewBg: '#759c8f',
    accentBtnClass: 'bg-[#09223f] text-white hover:bg-[#07182c]',
  },
  purple: {
    key: 'purple',
    name: 'Deep Purple',
    bgHex: '#4a2399',
    bgClass: 'bg-[#4a2399]',
    textClass: 'text-[#f5f1fe]',
    subtextClass: 'text-[#cfbeef]',
    borderClass: 'border-[#5f36b6]',
    cardPreviewBg: '#4a2399',
    accentBtnClass: 'bg-[#180938] text-white hover:bg-[#100528]',
  },
  terracotta: {
    key: 'terracotta',
    name: 'Warm Terracotta',
    bgHex: '#d49e7e',
    bgClass: 'bg-[#d49e7e]',
    textClass: 'text-[#391e0f]',
    subtextClass: 'text-[#553420]',
    borderClass: 'border-[#bb8666]',
    cardPreviewBg: '#d49e7e',
    accentBtnClass: 'bg-[#291307] text-white hover:bg-[#1a0a03]',
  },
  slate: {
    key: 'slate',
    name: 'Lavender Slate',
    bgHex: '#8e8ca3',
    bgClass: 'bg-[#8e8ca3]',
    textClass: 'text-[#1c1b2c]',
    subtextClass: 'text-[#333149]',
    borderClass: 'border-[#75738c]',
    cardPreviewBg: '#8e8ca3',
    accentBtnClass: 'bg-[#0f172a] text-white hover:bg-[#020617]',
  },
  peach: {
    key: 'peach',
    name: 'Soft Peach',
    bgHex: '#e89e93',
    bgClass: 'bg-[#e89e93]',
    textClass: 'text-[#3e1b17]',
    subtextClass: 'text-[#572b27]',
    borderClass: 'border-[#cf867b]',
    cardPreviewBg: '#e89e93',
    accentBtnClass: 'bg-[#2b0f0b] text-white hover:bg-[#1b0805]',
  },
  ocean: {
    key: 'ocean',
    name: 'Ocean Teal',
    bgHex: '#6c9db3',
    bgClass: 'bg-[#6c9db3]',
    textClass: 'text-[#0f2838]',
    subtextClass: 'text-[#204055]',
    borderClass: 'border-[#538298]',
    cardPreviewBg: '#6c9db3',
    accentBtnClass: 'bg-[#081a27] text-white hover:bg-[#030d15]',
  },
  clay: {
    key: 'clay',
    name: 'Sandstone',
    bgHex: '#d8b688',
    bgClass: 'bg-[#d8b688]',
    textClass: 'text-[#37270f]',
    subtextClass: 'text-[#503b1d]',
    borderClass: 'border-[#bfa073]',
    cardPreviewBg: '#d8b688',
    accentBtnClass: 'bg-[#251705] text-white hover:bg-[#150c01]',
  },
  default: {
    key: 'default',
    name: 'Classic Off-White',
    bgHex: '#e3e5e9',
    bgClass: 'bg-[#e3e5e9]',
    textClass: 'text-[#1f2937]',
    subtextClass: 'text-[#4b5563]',
    borderClass: 'border-[#cbd0d7]',
    cardPreviewBg: '#e3e5e9',
    accentBtnClass: 'bg-[#0b2849] text-white hover:bg-[#06192e]',
  },
};
