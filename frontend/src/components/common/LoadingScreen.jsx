import { motion } from 'framer-motion';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
          <motion.div
            className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        {/* Logo */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          NovaPOS
        </h1>
        
        {/* Message */}
        <p className="text-gray-500 mt-2">
          {message}
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
