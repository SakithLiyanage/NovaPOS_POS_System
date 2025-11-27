import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({ 
  children, 
  className, 
  hover = false,
  padding = 'md',
  animate = true,
  delay = 0,
  ...props 
}) => {
  const paddingSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardContent = (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        hover && 'hover:shadow-md hover:border-gray-300 transition-all duration-200',
        paddingSizes[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (!animate) return cardContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: [0.0, 0.0, 0.2, 1] 
      }}
    >
      {cardContent}
    </motion.div>
  );
};

export default Card;
