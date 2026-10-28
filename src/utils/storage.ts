import { TodoList } from '../types/todo';

const STORAGE_KEY = 'listify_todo_lists_v1';

export const INITIAL_DEMO_LISTS: TodoList[] = [
  {
    id: 'demo-grocery-list',
    title: 'Grocery list',
    colorTheme: 'sage',
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 1000 * 60 * 15,
    contributors: [
      {
        id: 'user-petra',
        name: 'Petra Norup',
        email: 'petra.norup@gmail.com',
        avatarColor: '#f7c4a5',
      },
    ],
    checkedItemsCollapsed: false,
    sections: [
      {
        id: 'sec-weekly-shopping',
        title: 'Weekly Shopping',
        isCollapsed: false,
        items: [
          {
            id: 'item-1',
            text: 'Chili powder',
            checked: false,
            createdAt: Date.now() - 3600000 * 5,
          },
          {
            id: 'item-2',
            text: 'Garlic',
            checked: false,
            comment: 'Has to bee Solo garlic',
            commentAuthor: 'Petra Norup',
            createdAt: Date.now() - 3600000 * 4,
          },
          {
            id: 'item-3',
            text: 'Needs attention',
            checked: false,
            isImportant: true,
            tags: ['Important'],
            createdAt: Date.now() - 3600000 * 3,
          },
          {
            id: 'item-4',
            text: 'Quinoa',
            checked: false,
            createdAt: Date.now() - 3600000 * 2,
          },
          {
            id: 'item-5',
            text: 'Rice',
            checked: true,
            createdAt: Date.now() - 3600000 * 8,
          },
          {
            id: 'item-6',
            text: 'Cinnamon',
            checked: true,
            createdAt: Date.now() - 3600000 * 7,
          },
          {
            id: 'item-7',
            text: 'Milk',
            checked: true,
            createdAt: Date.now() - 3600000 * 6,
          },
        ],
      },
    ],
  },
];

export function loadLists(): TodoList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveLists(INITIAL_DEMO_LISTS);
      return INITIAL_DEMO_LISTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEMO_LISTS;
  } catch (e) {
    console.error('Failed to load lists from localStorage', e);
    return INITIAL_DEMO_LISTS;
  }
}

export function saveLists(lists: TodoList[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (e) {
    console.error('Failed to save lists to localStorage', e);
  }
}

export function resetToDemo(): TodoList[] {
  saveLists(INITIAL_DEMO_LISTS);
  return INITIAL_DEMO_LISTS;
}

export function clearAllLists(): TodoList[] {
  saveLists([]);
  return [];
}
