import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gray-200',
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
