import React, { useEffect, useId, useRef } from 'react';
import './BottomSheet.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const first = sheet.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? sheet).focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusable = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => el.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        sheet.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={handleOverlayClick}>
      <div
        ref={sheetRef}
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="bottom-sheet-drag-handle" />
        <div className="bottom-sheet-header">
          <h2 id={titleId}>{title}</h2>
          <button className="bottom-sheet-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="bottom-sheet-body">{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
