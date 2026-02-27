import './ValidationMessage.css';
import Typewriter from './Typewriter';


interface ValidationMessageProps {
  isValid: boolean;
  reason: string;
}

export default function ValidationMessage({ isValid, reason }: ValidationMessageProps) {
  return (
    <div className={`validation-message ${isValid ? 'valid' : 'invalid'}`}>
      <span className={`validation-message-icon ${isValid ? 'valid' : 'invalid'}`}>{isValid ? '✅' : 'ℹ️'}</span>
      <span className={`validation-message-text ${isValid ? 'valid' : 'invalid'}`}>
        <Typewriter text={reason} />
      </span>
    </div>
  );
}
