import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Tabs = ({ tabs, defaultTab, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'relative py-3 px-1 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
