import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderOpen,
  Receipt,
  Users,
  BarChart3,
  Settings,
  UserCog,
  Tag,
  Truck,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
  { name: 'POS Terminal', href: '/pos', icon: ShoppingCart, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
  { name: 'Products', href: '/products', icon: Package, roles: ['OWNER', 'MANAGER'] },
  { name: 'Categories', href: '/categories', icon: FolderOpen, roles: ['OWNER', 'MANAGER'] },
  { name: 'Sales History', href: '/sales', icon: Receipt, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
  { name: 'Customers', href: '/customers', icon: Users, roles: ['OWNER', 'MANAGER'] },
  { name: 'Discounts', href: '/discounts', icon: Tag, roles: ['OWNER', 'MANAGER'] },
  { name: 'Suppliers', href: '/suppliers', icon: Truck, roles: ['OWNER', 'MANAGER'] },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ClipboardList, roles: ['OWNER', 'MANAGER'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
  { name: 'Users', href: '/users', icon: UserCog, roles: ['OWNER'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['OWNER'] },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const filteredNav = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen bg-slate-900 text-white z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
          className="overflow-hidden"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            NovaPOS
          </span>
        </motion.div>
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <motion.span
                    initial={false}
                    animate={{ 
                      opacity: collapsed ? 0 : 1, 
                      width: collapsed ? 0 : 'auto' 
                    }}
                    className="overflow-hidden whitespace-nowrap text-sm font-medium"
                  >
                    {item.name}
                  </motion.span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <motion.div
            initial={false}
            animate={{ 
              opacity: collapsed ? 0 : 1, 
              width: collapsed ? 0 : 'auto' 
            }}
            className="overflow-hidden flex-1"
          >
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role?.toLowerCase()}</p>
          </motion.div>
          <motion.button
            initial={false}
            animate={{ 
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto'
            }}
            onClick={logout}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
