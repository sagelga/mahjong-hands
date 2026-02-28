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
      <h2 className="hand-title">Your Hand</h2>
      <div className="hand-info">
        <span className={`hand-main-info ${isValid ? 'valid' : ''}`}>
          Main: {mainHandCount}/14
        </span>
        <button
          onClick={onClearHand}
          className="clear-button"
          title="Clear hand"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
