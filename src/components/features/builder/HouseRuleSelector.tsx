import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import './HouseRuleSelector.css';

interface HouseRuleOption {
  id: 'house' | 'hk-old' | 'riichi' | 'mcr';
  label: string;
  description: string;
  path: string;
  badge?: string;
}

const HOUSE_RULES: HouseRuleOption[] = [
  {
    id: 'house',
    label: 'Simplified House Rule',
    description: 'Casual play — win before others do.',
    path: '/learn/scoring',
  },
  {
    id: 'hk-old',
    label: 'Hong Kong Old Style',
    description: 'Fan-based — focus on bigger hands.',
    path: '/learn/scoring/hk-old',
  },
  {
    id: 'riichi',
    label: 'Japanese Riichi',
    description: 'Yaku + Han/Fu competitive scoring.',
    path: '/learn/scoring/riichi',
  },
  {
    id: 'mcr',
    label: 'Mahjong Competition Rules',
    description: 'WMO official competitive standard.',
    path: '/learn/scoring/mcr',
    badge: 'WMO',
  },
];

export function HouseRuleSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCurrentRule = (): HouseRuleOption => {
    if (location.pathname.includes('hk-old')) return HOUSE_RULES[1];
    if (location.pathname.includes('riichi')) return HOUSE_RULES[2];
    if (location.pathname.includes('mcr')) return HOUSE_RULES[3];
    return HOUSE_RULES[0];
  };

  const current = getCurrentRule();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSelect = (rule: HouseRuleOption) => {
    setOpen(false);
    navigate(rule.path);
  };

  return (
    <div className="rule-dropdown-wrap" ref={containerRef}>
      <div className="rule-dropdown-label">Scoring ruleset</div>

      <button
        className={`rule-dropdown-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="rule-dropdown-trigger-text">
          <span className="rule-dropdown-trigger-name">{current.label}</span>
          <span className="rule-dropdown-trigger-desc">{current.description}</span>
        </div>
        <ChevronDown size={16} className={`rule-dropdown-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="rule-dropdown-panel" role="listbox">
          {HOUSE_RULES.map((rule) => {
            const isActive = rule.id === current.id;
            return (
              <button
                key={rule.id}
                className={`rule-dropdown-option ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(rule)}
                role="option"
                aria-selected={isActive}
                type="button"
              >
                <div className="rule-dropdown-option-text">
                  <span className="rule-dropdown-option-name">
                    {rule.label}
                    {rule.badge && <span className="rule-dropdown-badge">{rule.badge}</span>}
                  </span>
                  <span className="rule-dropdown-option-desc">{rule.description}</span>
                </div>
                {isActive && <Check size={14} className="rule-dropdown-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HouseRuleSelector;
