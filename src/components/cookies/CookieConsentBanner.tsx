import React, { useEffect, useState } from 'react';
import CookieSettingsModal from './CookieSettingsModal';
import { getCookiePreferences, setCookiePreferences } from '@/utils/cookies';
import './CookieConsentBanner.css';

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const prefs = getCookiePreferences();
    if (!prefs.consentGiven) {
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookiePreferences({ functional: true, analytics: true, consentGiven: true, consentTimestamp: Date.now() });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    setCookiePreferences({ functional: true, analytics: false, consentGiven: true, consentTimestamp: Date.now() });
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <aside className="cookie-bar" role="region" aria-label="Cookie preferences">
          <div className="cookie-bar-copy">
            <p>
              <strong>Cookies.</strong> Functional cookies keep your hand. Analytics stay off
              unless you allow them.{' '}
              <a
                href="https://sagelga.com/privacy-policy"
                className="cookie-bar-privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </p>
          </div>
          <div className="cookie-bar-actions">
            <button
              type="button"
              className="cookie-bar-link"
              onClick={() => setShowSettings(true)}
            >
              Manage
            </button>
            <button type="button" className="cookie-bar-btn" onClick={handleRejectAll}>
              Reject all
            </button>
            <button
              type="button"
              className="cookie-bar-btn cookie-bar-btn--accept"
              onClick={handleAcceptAll}
            >
              Accept all
            </button>
          </div>
        </aside>
      )}

      <CookieSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={() => {
          setShowSettings(false);
          setIsVisible(false);
        }}
      />
    </>
  );
};

export default CookieConsentBanner;
