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
    const viewportWidth = window.innerWidth;
    const tooltipWidth = Math.min(300, viewportWidth * 0.8);
    const tooltipHeight = 160; // Approximate
    const margin = 12;

    let top, left, placement: 'top' | 'bottom' | 'left' | 'right';

    // Order of preference for vertical list like the modal: right, left, top, bottom
    if (viewportWidth - rect.right > tooltipWidth + margin * 2) {
      top = rect.top + (rect.height / 2);
      left = rect.right + margin;
      placement = 'right';
    } else if (rect.left > tooltipWidth + margin * 2) {
      top = rect.top + (rect.height / 2);
      left = rect.left - margin;
      placement = 'left';
    } else if (rect.top > tooltipHeight + margin) {
      top = rect.top - margin;
      left = rect.left + (rect.width / 2);
      placement = 'top';
    } else {
      top = rect.bottom + margin;
      left = rect.left + (rect.width / 2);
      placement = 'bottom';
    }

    // Adjust left/top for specific placements
    if (placement === 'top' || placement === 'bottom') {
      // Centered horizontal position
      const halfWidth = tooltipWidth / 2;
      if (left < halfWidth + margin) {
        left = halfWidth + margin;
      } else if (left > viewportWidth - halfWidth - margin) {
        left = viewportWidth - halfWidth - margin;
      }
    } else if (placement === 'right' || placement === 'left') {
      // Centered vertical position is already handled by transform: translateY(-50%) in CSS
      // So 'top' should be the center point
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
