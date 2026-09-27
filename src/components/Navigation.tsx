import React from 'react';
import { useGame } from '../context/GameContext';
import { TabType } from '../types';
import { sounds } from '../utils/sound';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, inventory, timedCrateReady } = useGame();

  const handleTabChange = (tab: TabType) => {
    sounds.playClick();
    setActiveTab(tab);
  };

  const navItems: {
    id: TabType;
    dataTab: string;
    label: string;
    emoji: string;
    badge?: number | string | null;
  }[] = [
    {
      id: 'base',
      dataTab: 'tab-base',
      label: 'BASE',
      emoji: '🏗️'
    },
    {
      id: 'market',
      dataTab: 'tab-market',
      label: 'MARKET',
      emoji: '🛒'
    },
    {
      id: 'inventory',
      dataTab: 'tab-inventory',
      label: 'INVENTORY',
      emoji: '🎒',
      badge: timedCrateReady ? '!' : (inventory.length > 0 ? inventory.length : null)
    },
    {
      id: 'careers',
      dataTab: 'tab-careers',
      label: 'CAREERS',
      emoji: '💼'
    },
    {
      id: 'casino',
      dataTab: 'tab-casino',
      label: 'CASINO',
      emoji: '🎰'
    },
    {
      id: 'profile',
      dataTab: 'tab-profile',
      label: 'PROFILE',
      emoji: '👤'
    }
  ];

  return (
    <nav className="w-full glass-panel z-20 px-1 sm:px-2 py-2.5 sm:py-3 border-t border-cyan-500/30 flex justify-around items-center">
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            data-tab={item.dataTab}
            onClick={() => handleTabChange(item.id)}
            className={`nav-btn relative flex flex-col items-center transition-all px-1.5 py-0.5 ${
              isActive
                ? 'text-cyan-400 scale-105 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            <span className="text-base sm:text-lg">{item.emoji}</span>
            {item.badge && (
              <span className={`absolute -top-1 right-0 sm:right-1 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                item.badge === '!'
                  ? 'bg-fuchsia-600 text-white animate-bounce'
                  : 'bg-cyan-900 border border-cyan-400 text-cyan-200'
              }`}>
                {item.badge}
              </span>
            )}
            <span className="text-[9px] sm:text-[10px] font-orbitron font-bold uppercase mt-0.5 sm:mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
