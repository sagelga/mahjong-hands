import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BetaBanner from '../ui/AnnouncementBanner';
import CookieConsentBanner from '../cookies/CookieConsentBanner';
import type { NavItem, FooterColumn } from '@/types/ui';
import { SAGELGA_COLUMN, SAGELGA_SOCIALS_COLUMN, makeProjectMetaColumn } from '@/config/footer';
import './Layout.css';

const NAV_LINKS: NavItem[] = [
  { label: 'Builder', href: '/' },
  { label: 'Practice', href: '/practice' },
  { label: 'Tracker', href: '/tracker' },
  { label: 'Calculator', href: '/calculator' },
  {
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Rules', href: '/learn/rules' },
      { label: 'Setup', href: '/learn/setup' },
      { label: 'Strategy', href: '/learn/strategy' },
    ],
  },
  { label: 'Rulesets', href: '/scoring' },
  { label: 'Glossary', href: '/glossary' },
];

const MAHJONG_COLUMN: FooterColumn = {
  title: 'Mahjong Hands',
  links: [
    { label: 'Hand Builder', href: '/' },
    { label: 'Tenpai Practice', href: '/practice' },
    { label: 'Tile Tracker', href: '/tracker' },
    { label: 'Glossary', href: '/glossary' },
    { label: 'Learn', href: '/learn' },
  ],
};

const FOOTER_COLUMNS: FooterColumn[] = [
  MAHJONG_COLUMN,
  makeProjectMetaColumn('sagelga/mahjong-hands'),
  SAGELGA_COLUMN,
  SAGELGA_SOCIALS_COLUMN,
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <BetaBanner />
      <Navbar
        brandName="Mahjong Hands"
        brandHref="/"
        navbarBg="#065f46"
        links={NAV_LINKS}
      />
      <main className="main-content">
        {children}
      </main>
      <Footer
        brandName="sagelga"
        brandHref="https://sagelga.com"
        tagline="Mahjong Hands by sagelga"
columns={FOOTER_COLUMNS}
        author="sagelga"
        authorHref="https://sagelga.com"
        copyrightStart={2021}
      />
      <CookieConsentBanner />
    </div>
  );
}
