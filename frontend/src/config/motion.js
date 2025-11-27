export const motion = {
  // Duration ranges
  duration: {
    instant: 0.1,      // 100ms - Micro-interactions
    fast: 0.15,        // 150ms - Button states
    normal: 0.2,       // 200ms - Standard transitions
    smooth: 0.3,       // 300ms - Page elements
    slow: 0.5,         // 500ms - Complex animations
  },
  
  // Easing curves
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1],          // Deceleration
    easeIn: [0.4, 0.0, 1, 1],             // Acceleration
    easeInOut: [0.4, 0.0, 0.2, 1],        // Standard
    spring: { type: 'spring', stiffness: 300, damping: 30 },
    bounce: { type: 'spring', stiffness: 400, damping: 10 },
  },
  
  // Animation presets
  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2, ease: [0.0, 0.0, 0.2, 1] },
    },
    drawer: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  },
  
  // Stagger children
  stagger: {
    container: {
      animate: { transition: { staggerChildren: 0.05 } },
    },
    item: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
    },
  },
};
