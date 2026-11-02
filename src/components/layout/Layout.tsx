import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
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

const PAGE_TITLES: Record<string, string> = {
  '/': 'Mahjong Hand Builder - Validate Your Winning Hands',
  '/practice': 'Tenpai Practice - Mahjong Hand Builder',
  '/tracker': 'Tile Tracker - Mahjong Hand Builder',
  '/glossary': 'Mahjong Tile Glossary - Visual Guide to All Tiles',
  '/learn': 'Learn Mahjong - Step by Step Guide',
  '/learn/rules': 'Learn Rules - Mahjong Rules Guide',
  '/learn/setup': 'Learn Game Setup - Mahjong Guide',
  '/learn/strategy': 'Mahjong Strategy Guide',
  '/scoring': 'Scoring Guide - Mahjong Fan System',
  '/scoring/hk-old': 'Hong Kong Old Style Scoring - Mahjong Hand Builder',
  '/scoring/mcr': 'Mahjong Competition Rules Scoring - Mahjong Hand Builder',
  '/calculator': 'Score Calculator - Mahjong Hand Builder',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = PAGE_TITLES[pathname] || 'Mahjong Hands';
  }, [pathname]);

  return (
    <div className="app-container">
      <Navbar
        key={pathname}
        brandName="Mahjong Hands"
        brandHref="/"
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
