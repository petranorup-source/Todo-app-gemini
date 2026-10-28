/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TodoList, COLOR_THEMES } from './types/todo';
import { loadLists, saveLists, resetToDemo, clearAllLists } from './utils/storage';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeView } from './components/HomeView';
import { ListView } from './components/ListView';

export default function App() {
  const [lists, setLists] = useState<TodoList[]>(() => loadLists());
  const [activeListId, setActiveListId] = useState<string | null>('demo-grocery-list');

  // Sync lists to localStorage
  useEffect(() => {
    saveLists(lists);
  }, [lists]);

  const activeList = lists.find((l) => l.id === activeListId) || null;

  // Create new list matching New_list_740c9024.png
  const handleCreateNewList = () => {
    const newList: TodoList = {
      id: 'list-' + Date.now(),
      title: 'List title',
      colorTheme: 'sage',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      contributors: [],
      sections: [
        {
          id: 'sec-' + Date.now(),
          title: 'Title',
          isCollapsed: false,
          items: [
            {
              id: 'item-' + Date.now(),
              text: 'List item',
              checked: false,
              createdAt: Date.now(),
            },
          ],
        },
      ],
    };

    setLists((prev) => [newList, ...prev]);
    setActiveListId(newList.id);
  };

  const handleUpdateList = (updated: TodoList) => {
    setLists((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  };

  const handleDeleteList = (listId: string) => {
    setLists((prev) => prev.filter((l) => l.id !== listId));
    if (activeListId === listId) {
      setActiveListId(null);
    }
  };

  const handleDuplicateList = (list: TodoList) => {
    const duplicated: TodoList = {
      ...list,
      id: 'list-' + Date.now(),
      title: `${list.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sections: list.sections.map((s) => ({
        ...s,
        id: 'sec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        items: s.items.map((i) => ({
          ...i,
          id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        })),
      })),
    };
    setLists((prev) => [duplicated, ...prev]);
    setActiveListId(duplicated.id);
  };

  const handleResetDemo = () => {
    const demo = resetToDemo();
    setLists(demo);
    setActiveListId('demo-grocery-list');
  };

  const handleClearEmpty = () => {
    const empty = clearAllLists();
    setLists(empty);
    setActiveListId(null);
  };

  // Determine current active background color for the phone mockup
  const currentBgHex = activeList
    ? COLOR_THEMES[activeList.colorTheme]?.bgHex || '#759c8f'
    : '#e4e5e9';

  return (
    <PhoneFrame
      bgHex={currentBgHex}
      onResetDemo={handleResetDemo}
      onClearEmpty={handleClearEmpty}
      isListEmpty={lists.length === 0}
    >
      {activeList ? (
        <ListView
          list={activeList}
          onBack={() => setActiveListId(null)}
          onUpdateList={handleUpdateList}
          onDeleteList={handleDeleteList}
          onDuplicateList={handleDuplicateList}
        />
      ) : (
        <HomeView
          lists={lists}
          onOpenList={(id) => setActiveListId(id)}
          onCreateNewList={handleCreateNewList}
          onDeleteList={handleDeleteList}
          onResetDemo={handleResetDemo}
          onClearEmpty={handleClearEmpty}
        />
      )}
    </PhoneFrame>
  );
}
