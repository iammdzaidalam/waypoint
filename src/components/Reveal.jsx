'use client';
import { motion } from 'motion/react';

/**
 * Entrance wrapper. Fades + lifts its children in once, on mount, so the
 * content is always guaranteed to end up visible (no reliance on scroll /
 * IntersectionObserver, which can leave below-the-fold content hidden).
 * Forwards `className` to its single root element so it can serve as a
 * grid cell (e.g. a direct child of `.cell-grid`).
 */
export default function Reveal({ children, className, y = 16, delay = 0, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
