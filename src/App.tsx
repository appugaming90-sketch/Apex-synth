/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { BaseView } from './components/BaseView';
import { MarketplaceTab } from './components/MarketplaceTab';
import { CareersTab } from './components/CareersTab';
import { CasinoTab } from './components/CasinoTab';
import { InventoryTab } from './components/InventoryTab';
import { ProfileTab } from './components/ProfileTab';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const GameMain: React.FC = () => {
  const { activeTab } = useGame();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col justify-between overflow-hidden bg-gray-950 text-gray-100 select-none">
      
      {/* TOP HUD HEADER */}
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-950 w-full">
        {/* 01. BASE SECTOR (CANVAS GRID) */}
        <div className={`w-full h-full ${activeTab === 'base' ? 'block' : 'hidden'}`}>
          <BaseView />
        </div>

        {/* 02. MARKETPLACE TAB */}
        <div className={`w-full h-full ${activeTab === 'market' ? 'block' : 'hidden'}`}>
          <MarketplaceTab />
        </div>

        {/* 03. INVENTORY TAB */}
        <div className={`w-full h-full ${activeTab === 'inventory' ? 'block' : 'hidden'}`}>
          <InventoryTab />
        </div>

        {/* 04. CAREERS TAB */}
        <div className={`w-full h-full ${activeTab === 'careers' || activeTab === 'jobs' ? 'block' : 'hidden'}`}>
          <CareersTab />
        </div>

        {/* 04. CASINO TAB */}
        <div className={`w-full h-full ${activeTab === 'casino' ? 'block' : 'hidden'}`}>
          <CasinoTab />
        </div>

        {/* 05. PROFILE TAB */}
        <div className={`w-full h-full ${activeTab === 'profile' ? 'block' : 'hidden'}`}>
          <ProfileTab onOpenAuthModal={() => setIsAuthOpen(true)} />
        </div>
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <Navigation />

      {/* Floating System Notifications */}
      <ToastContainer />

      {/* Auth & Cloud Infrastructure Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Apex Syndicate Simulation Engine">
      <GameProvider>
        <GameMain />
      </GameProvider>
    </ErrorBoundary>
  );
}
