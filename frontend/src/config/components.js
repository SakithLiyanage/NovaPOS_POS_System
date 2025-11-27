export const componentStyles = {
  // Buttons
  button: {
    base: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    },
    variants: {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow-md',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    },
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-xl border border-gray-200 shadow-sm',
    hover: 'hover:shadow-md hover:border-gray-300 transition-shadow duration-200',
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  
  // Inputs
  input: {
    base: 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors duration-200',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    disabled: 'bg-gray-100 cursor-not-allowed opacity-60',
  },
  
  // Badges/Pills
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    variants: {
      paid: 'bg-emerald-100 text-emerald-800',
      due: 'bg-amber-100 text-amber-800',
      refunded: 'bg-gray-100 text-gray-800',
      lowStock: 'bg-red-100 text-red-800',
      active: 'bg-indigo-100 text-indigo-800',
      inactive: 'bg-gray-100 text-gray-600',
    },
  },
  
  // Tables
  table: {
    container: 'overflow-hidden rounded-xl border border-gray-200 bg-white',
    header: 'bg-gray-50 border-b border-gray-200',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    row: 'border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150',
    cell: 'px-6 py-4 text-sm text-gray-900',
  },
  
  // Modals
  modal: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm',
    container: 'fixed inset-0 flex items-center justify-center p-4',
    content: 'bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden',
  },
};
