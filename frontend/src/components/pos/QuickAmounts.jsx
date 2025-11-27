import { motion } from 'framer-motion';

const QuickAmounts = ({ total, onSelect }) => {
  const generateQuickAmounts = (total) => {
    const amounts = [];
    const rounded = Math.ceil(total);
    
    // Exact amount
    amounts.push(total);
    
    // Round up to nearest 5, 10, 20, 50, 100
    [5, 10, 20, 50, 100].forEach(increment => {
      const roundedUp = Math.ceil(total / increment) * increment;
      if (roundedUp > total && !amounts.includes(roundedUp)) {
        amounts.push(roundedUp);
      }
    });
    
    return amounts.slice(0, 6).sort((a, b) => a - b);
  };

  const amounts = generateQuickAmounts(total);

  return (
    <div className="grid grid-cols-3 gap-2">
      {amounts.map((amount) => (
        <motion.button
          key={amount}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(amount)}
          className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
            amount === total
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ${amount.toFixed(2)}
        </motion.button>
      ))}
    </div>
  );
};

export default QuickAmounts;
