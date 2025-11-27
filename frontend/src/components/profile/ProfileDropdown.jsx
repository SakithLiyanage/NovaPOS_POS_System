import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'My Profile', onClick: () => navigate('/profile') },
    { icon: Settings, label: 'Settings', onClick: () => navigate('/settings'), roles: ['OWNER'] },
    { icon: Shield, label: 'Audit Log', onClick: () => navigate('/audit'), roles: ['OWNER'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Avatar name={user?.name} size="sm" />
        <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-100">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  {user?.role}
                </span>
              </div>
              
              <div className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { item.onClick(); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
