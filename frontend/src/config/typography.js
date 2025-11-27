export const typography = {
  // Font families (Google Fonts)
  fontFamily: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace', // For prices, SKUs
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',      // 12px - Small labels
    sm: '0.875rem',     // 14px - Body small
    base: '1rem',       // 16px - Body
    lg: '1.125rem',     // 18px - Large body
    xl: '1.25rem',      // 20px - Small headings
    '2xl': '1.5rem',    // 24px - Section headings
    '3xl': '1.875rem',  // 30px - Page headings
    '4xl': '2.25rem',   // 36px - Large headings
    '5xl': '3rem',      // 48px - Hero/Display
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // Usage guidelines
  usage: {
    pageTitle: 'text-3xl font-bold text-gray-900',
    sectionTitle: 'text-xl font-semibold text-gray-800',
    cardTitle: 'text-lg font-semibold text-gray-800',
    body: 'text-base font-normal text-gray-600',
    caption: 'text-sm font-normal text-gray-500',
    price: 'font-mono text-lg font-semibold', // Monospace for numerical data
    sku: 'font-mono text-sm text-gray-500',
    button: 'text-sm font-medium',
  },
};
