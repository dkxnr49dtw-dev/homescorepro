import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AccessibleTooltip.css';

/**
 * Accessible Tooltip Component
 * Provides an accessible tooltip that works with keyboard, mouse, and screen readers
 * 
 * @param {Object} props
 * @param {string} props.id - Unique ID for the tooltip
 * @param {string} props.label - Accessible label for the trigger button
 * @param {string|React.ReactNode} props.content - Content to display in the tooltip
 * @param {string} props.position - Position of tooltip: 'top' | 'bottom' | 'left' | 'right'
 */
export function AccessibleTooltip({ 
  id, 
  label, 
  content,
  position = 'top'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  
  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  // Animation variants based on position
  const getAnimation = () => {
    switch (position) {
      case 'bottom':
        return { initial: { y: -8 }, animate: { y: 0 }, exit: { y: -8 } };
      case 'left':
        return { initial: { x: 8 }, animate: { x: 0 }, exit: { x: 8 } };
      case 'right':
        return { initial: { x: -8 }, animate: { x: 0 }, exit: { x: -8 } };
      default: // top
        return { initial: { y: 8 }, animate: { y: 0 }, exit: { y: 8 } };
    }
  };
  
  const animation = getAnimation();
  
  return (
    <span className="tooltip-wrapper">
      <button
        ref={triggerRef}
        type="button"
        className="tooltip-trigger"
        aria-label={label}
        aria-describedby={isOpen ? id : undefined}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        <span aria-hidden="true">?</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            id={id}
            role="tooltip"
            className={`tooltip-content tooltip-content--${position}`}
            initial={{ opacity: 0, ...animation.initial }}
            animate={{ opacity: 1, ...animation.animate }}
            exit={{ opacity: 0, ...animation.exit }}
            transition={{ duration: 0.15 }}
          >
            {content}
            <span className="tooltip-arrow" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export default AccessibleTooltip;
