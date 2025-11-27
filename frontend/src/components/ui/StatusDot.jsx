import { cn } from '../../utils/cn';

const colors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  busy: 'bg-amber-500',
  error: 'bg-red-500',
};

const StatusDot = ({ status = 'offline', pulse = false, className }) => {
  return (
    <span className={cn('relative flex h-3 w-3', className)}>
      {pulse && (
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            colors[status]
          )}
        />
      )}
      <span
        className={cn('relative inline-flex rounded-full h-3 w-3', colors[status])}
      />
    </span>
  );
};

export default StatusDot;
