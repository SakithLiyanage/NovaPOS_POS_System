import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4 flex items-center justify-center gap-2"
        >
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You're offline. Some features may be unavailable.</span>
        </motion.div>
      )}
      {showReconnected && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white py-2 px-4 flex items-center justify-center gap-2"
        >
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Back online!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
