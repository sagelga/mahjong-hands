import './ValidationMessage.css';
import { CheckCircle, Info } from 'lucide-react';

interface ValidationMessageProps {
  isValid: boolean;
  reason: string;
}

export default function ValidationMessage({ isValid, reason }: ValidationMessageProps) {
  return (
    <div className={`validation-message ${isValid ? 'valid' : 'invalid'}`}>
      <span className={`validation-message-icon ${isValid ? 'valid' : 'invalid'}`}>
        {isValid ? <CheckCircle size={16} /> : <Info size={16} />}
      </span>
      <span className={`validation-message-text ${isValid ? 'valid' : 'invalid'}`}>
        {reason}
      </span>
    </div>
  );
}
