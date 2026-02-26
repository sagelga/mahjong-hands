import { useState, useRef, useEffect } from 'react';

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export const useTooltip = () => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0, placement: 'top' });
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = (e: React.MouseEvent, tooltipContent: React.ReactElement) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setContent(tooltipContent);
    calculatePosition(e);
    setShow(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShow(false);
      setContent(null);
    }, 200); // Delay to allow smooth fade-out
  };

  const calculatePosition = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const tooltipWidth = 300; // Approximate width of tooltip
    const tooltipHeight = 150; // Approximate height of tooltip
    const margin = 10;
    
    let top, left, placement: 'top' | 'bottom' | 'left' | 'right';
    
    // Try to position above the element first
    if (rect.top > tooltipHeight + margin) {
      top = rect.top - tooltipHeight - margin;
      left = rect.left + (rect.width / 2);
      placement = 'top';
    } else if (window.innerHeight - rect.bottom > tooltipHeight + margin) {
      top = rect.bottom + margin;
      left = rect.left + (rect.width / 2);
      placement = 'bottom';
    } else if (rect.left > tooltipWidth + margin) {
      top = rect.top + (rect.height / 2);
      left = rect.left - tooltipWidth - margin;
      placement = 'left';
    } else {
      top = rect.top + (rect.height / 2);
      left = rect.right + margin;
      placement = 'right';
    }
    
    setPosition({
      top: top,
      left: left,
      placement: placement
    });
  };

  const clearHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    show,
    content,
    position,
    showTooltip,
    hideTooltip,
    clearHideTimeout
  };
};
