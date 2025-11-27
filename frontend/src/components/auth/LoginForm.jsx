import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button, Input } from '../ui';

const LoginForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        icon={LogIn}
        className="w-full"
        size="lg"
      >
        Sign in
      </Button>
    </motion.form>
  );
};

export default LoginForm;
