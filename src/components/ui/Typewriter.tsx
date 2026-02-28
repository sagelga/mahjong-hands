import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
}

export default function Typewriter({ text }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
      }
    }, 30);
    return () => clearInterval(intervalId);
  }, [text]);

  return <>{displayedText}<span className="cursor-blink validation-cursor">|</span></>;
}