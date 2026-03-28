import type { CookiePreferences } from '@/types/ui';
import { COOKIE_STORAGE_KEY } from '@/types/ui';

const DEFAULT_PREFERENCES: CookiePreferences = {
  functional: true,
  analytics: false,
  consentGiven: false,
  consentTimestamp: null,
};

export function getCookiePreferences(): CookiePreferences {
  try {
    const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as CookiePreferences;
  } catch {
    console.warn('Failed to parse cookie preferences');
  }
  return DEFAULT_PREFERENCES;
}

export function setCookiePreferences(preferences: CookiePreferences): void {
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    console.warn('Failed to save cookie preferences');
  }
}

export function hasConsent(): boolean {
  return getCookiePreferences().consentGiven;
}

export function hasAnalyticsConsent(): boolean {
  const prefs = getCookiePreferences();
  return prefs.consentGiven && prefs.analytics;
}
