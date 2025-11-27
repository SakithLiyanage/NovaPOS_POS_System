import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);

  const { data: lowStock } = useQuery({
    queryKey: ['notifications', 'low-stock'],
    queryFn: () => api.get('/inventory/low-stock').then(res => res.data),
    refetchInterval: 60000,
  });

  const notifications = [
    ...(lowStock?.data?.map(product => ({
      id: `low-stock-${product._id}`,
      type: 'warning',
      title: 'Low Stock Alert',
      message: `${product.name} has only ${product.currentStock} units left`,
      time: new Date(),
      icon: Package,
    })) || []),
  ];

  const unreadCount = notifications.length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((notification) => {
                      const Icon = notification.icon || getIcon(notification.type);
                      return (
                        <li key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-3">
                            <div className={`mt-0.5 ${getIconColor(notification.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDateTime(notification.time)}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
