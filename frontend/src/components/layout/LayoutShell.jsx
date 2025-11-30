import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageTransition from '../ui/PageTransition';
import AIChatAssistant from '../ai/AIChatAssistant';
import { useUIStore } from '../../store/uiStore';

const LayoutShell = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main content area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <AIChatAssistant />
    </div>
  );
};

export default LayoutShell;
