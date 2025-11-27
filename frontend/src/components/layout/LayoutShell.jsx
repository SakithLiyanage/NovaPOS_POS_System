import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageTransition from '../ui/PageTransition';

const LayoutShell = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main content area */}
      <div 
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="p-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default LayoutShell;
