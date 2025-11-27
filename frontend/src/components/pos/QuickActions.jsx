import { motion } from 'framer-motion';
import { Pause, RotateCcw, Calculator, Receipt } from 'lucide-react';

const actions = [
  { id: 'hold', label: 'Hold Sale', icon: Pause, color: 'amber' },
  { id: 'recall', label: 'Recall', icon: RotateCcw, color: 'blue' },
  { id: 'calculator', label: 'Calculator', icon: Calculator, color: 'purple' },
  { id: 'lastReceipt', label: 'Last Receipt', icon: Receipt, color: 'emerald' },
];

const QuickActions = ({ onAction }) => {
  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction(action.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-${action.color}-50 text-${action.color}-700 hover:bg-${action.color}-100 transition-colors text-sm font-medium`}
        >
          <action.icon className="w-4 h-4" />
          <span className="hidden md:inline">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
