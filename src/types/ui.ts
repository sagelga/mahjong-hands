export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
  disabled?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface CookiePreferences {
  functional: boolean;
  analytics: boolean;
  consentGiven: boolean;
  consentTimestamp: number | null;
}

export type Theme = 'light' | 'dark' | 'system';

// Use 'theme' to stay compatible with preferences already saved by existing users
export const THEME_STORAGE_KEY = 'theme';
export const COOKIE_STORAGE_KEY = 'cookie-preferences';
