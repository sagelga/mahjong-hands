import { Trash2 } from 'lucide-react';
import './MahjongHand.css';

interface Props {
  mainHandCount: number;
  isValid: boolean;
  onClearHand: () => void;
}

export default function HandHeader({ mainHandCount, isValid, onClearHand }: Props) {
  return (
    <div className="hand-header">
      <div className="hand-heading">
        <h2 className="hand-title">Your Hand</h2>
        <span className={`hand-count-pill ${isValid ? 'valid' : ''}`}>
          {mainHandCount} / 14
        </span>
      </div>
      <button
        type="button"
        onClick={onClearHand}
        className="clear-button"
        title="Clear hand"
        aria-label="Clear hand"
      >
        <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
