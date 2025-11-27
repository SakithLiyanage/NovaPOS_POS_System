import { useState, useEffect } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import Breadcrumbs from './Breadcrumbs';
import NotificationCenter from '../notifications/NotificationCenter';
import ProfileDropdown from '../profile/ProfileDropdown';
import GlobalSearch from '../global/GlobalSearch';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/pos': 'POS Terminal',
  '/products': 'Products',
  '/categories': 'Categories',
  '/sales': 'Sales History',
  '/customers': 'Customers',
  '/reports': 'Reports',
  '/users': 'User Management',
  '/settings': 'Settings',
  '/profile': 'My Profile',
  '/audit': 'Audit Log',
};

const Topbar = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const pageTitle = pageTitles[location.pathname] || 'NovaPOS';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Search...</span>
            <kbd className="px-1.5 py-0.5 bg-white text-gray-400 text-xs rounded border">⌘K</kbd>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <NotificationCenter />
          <ProfileDropdown />
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Topbar;
