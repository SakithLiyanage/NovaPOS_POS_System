import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = ({ show, message = 'Loading...' }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
