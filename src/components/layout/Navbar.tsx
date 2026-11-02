import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, MessageSquare, X } from 'lucide-react';
import type { NavItem } from '@/types/ui';
import './Navbar.css';

const FEEDBACK_URL =
  'https://sagelga.notion.site/3147f2a665aa80dbb658cd6ce31fcd08?pvs=105';

interface NavbarProps {
  brandName: string;
  brandHref?: string;
  links: NavItem[];
  controls?: React.ReactNode;
}

export default function Navbar({
  brandName,
  brandHref = '/',
  links,
  controls,
}: NavbarProps) {
  const { pathname } = useLocation();
  const [dropdownState, setDropdownState] = useState<{ label: string | null; path: string }>({
    label: null,
    path: pathname,
  });
  const [mobileState, setMobileState] = useState<{ open: boolean; path: string }>({
    open: false,
    path: pathname,
  });
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Route changes reset the menus without a setState-in-effect cascade.
  const openDropdown = dropdownState.path === pathname ? dropdownState.label : null;
  const mobileOpen = mobileState.path === pathname && mobileState.open;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setDropdownState({ label: null, path: pathname });
      setMobileState({ open: false, path: pathname });
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [pathname]);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (event: MouseEvent) => {
      const ref = dropdownRefs.current[openDropdown];
      if (ref && !ref.contains(event.target as Node)) {
        setDropdownState({ label: null, path: pathname });
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown, pathname]);

  const isItemActive = (item: NavItem): boolean => {
    if (item.href === '/') return pathname === '/';
    const ownMatch = pathname === item.href || pathname.startsWith(item.href + '/');
    if (item.children) {
      return ownMatch || item.children.some((child: NavItem) =>
        pathname === child.href || pathname.startsWith(child.href + '/')
      );
    }
    return ownMatch;
  };

  const renderDesktopItem = (item: NavItem) => {
    if (item.disabled) {
      return (
        <li key={item.label}>
          <span className="nav-link nav-link--disabled" aria-disabled="true">
            {item.label}
          </span>
        </li>
      );
    }

    if (item.external) {
      return (
        <li key={item.label}>
          <a
            href={item.href}
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.label}
          </a>
        </li>
      );
    }

    if (item.children) {
      const active = isItemActive(item);
      const open = openDropdown === item.label;
      return (
        <li key={item.label}>
          <div
            className="nav-drop"
            ref={(el) => { dropdownRefs.current[item.label] = el; }}
          >
            <Link
              to={item.href}
              className={`nav-link nav-link--parent${active ? ' active' : ''}`}
            >
              {item.label}
            </Link>
            <button
              type="button"
              className={`nav-drop-caret${open ? ' open' : ''}`}
              onClick={() => setDropdownState({ label: open ? null : item.label, path: pathname })}
              aria-expanded={open}
              aria-controls={`nav-panel-${item.label.toLowerCase()}`}
              aria-label={`${item.label} menu`}
            >
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div
              id={`nav-panel-${item.label.toLowerCase()}`}
              className={`nav-drop-panel${open ? ' open' : ''}`}
              onClick={() => setDropdownState({ label: null, path: pathname })}
            >
              {item.children.map((child: NavItem) =>
                child.external ? (
                  <a
                    key={child.href}
                    href={child.href}
                    className="nav-drop-item"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {child.label}
                  </a>
                ) : (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={`nav-drop-item${pathname === child.href ? ' active' : ''}`}
                  >
                    {child.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </li>
      );
    }

    return (
      <li key={item.label}>
        <Link
          to={item.href}
          className={`nav-link${isItemActive(item) ? ' active' : ''}`}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to={brandHref} className="nav-brand">
          <span className="nav-brand-mark" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <span className="nav-brand-text">{brandName}</span>
          <span className="nav-beta" aria-hidden="true">Beta</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <ul className="nav-list">
            {links.map(renderDesktopItem)}
          </ul>
        </nav>

        <div className="nav-actions">
          {controls}
          <a
            className="nav-feedback"
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Feedback"
          >
            <MessageSquare size={15} aria-hidden="true" />
            <span>Feedback</span>
          </a>
          <button
            type="button"
            className="nav-menu-button"
            onClick={() => setMobileState({ open: !mobileOpen, path: pathname })}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        className={`nav-mobile${mobileOpen ? ' open' : ''}`}
        id="mobile-navigation"
        onClick={() => setMobileState({ open: false, path: pathname })}
      >
        <nav aria-label="Mobile">
          {links.map((item) => (
            <React.Fragment key={item.label}>
              {item.disabled ? (
                <span className="nav-mobile-link nav-mobile-link--disabled">{item.label}</span>
              ) : item.external ? (
                <a
                  href={item.href}
                  className="nav-mobile-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className={`nav-mobile-link${isItemActive(item) ? ' active' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.children && <span className="nav-mobile-hint">Guides</span>}
                </Link>
              )}
              {item.children?.map((child: NavItem) =>
                child.external ? (
                  <a
                    key={child.href}
                    href={child.href}
                    className="nav-mobile-link nav-mobile-link--child"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {child.label}
                  </a>
                ) : (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={`nav-mobile-link nav-mobile-link--child${pathname === child.href ? ' active' : ''}`}
                  >
                    {child.label}
                  </Link>
                )
              )}
            </React.Fragment>
          ))}
          <div className="nav-mobile-divider" />
          <a
            className="nav-mobile-link"
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Feedback</span>
            <span className="nav-mobile-hint">Beta</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
