import { useState, useMemo } from 'react';
import '../guides/ScoringGuide.css';
import './ScoringCalculator.css';
import { Flower2, LayoutGrid, PlusCircle, Target, Trophy } from 'lucide-react';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';

// ── Types ─────────────────────────────────────────────────────────────────────

type Wind = 'East' | 'South' | 'West' | 'North';
type WinMethod = 'self-draw' | 'discard';
type BonusLevel = 'none' | 'own' | 'all-four';

type HandPatternId =
  | 'chicken' | 'all-chows' | 'all-pungs' | 'mixed-suit' | 'seven-pairs'
  | 'little-three-dragons' | 'little-four-winds' | 'pure-suit' | 'all-honors'
  | 'all-terminals' | 'big-three-dragons' | 'big-four-winds'
  | 'thirteen-orphans' | 'nine-gates' | 'all-kongs';

type SetBonusId = 'green-dragon' | 'red-dragon' | 'white-dragon' | 'seat-wind' | 'round-wind';
type WinBonusId = 'last-wall-tile' | 'last-discard' | 'robbing-kong' | 'replacement-tile' | 'fully-concealed';

// ── Constants ─────────────────────────────────────────────────────────────────

const LIMIT_FAN = 13;
const WINDS: Wind[] = ['East', 'South', 'West', 'North'];
const WIND_CHINESE: Record<Wind, string> = { East: '東', South: '南', West: '西', North: '北' };

// localStorage keys for session-level settings (persist across hands)
const LS_ROUND_WIND = 'mj-calc-round-wind';
const LS_MIN_FAN    = 'mj-calc-min-fan';

interface HandPattern {
  id: HandPatternId;
  name: string;
  chineseName: string;
  fan: number;
  description: string;
  limitThreeNote?: boolean; // flags patterns with pre-included bonuses
}

// Common patterns — most players will encounter these
const COMMON_PATTERNS: HandPattern[] = [
  { id: 'chicken',              name: 'Chicken Hand',         chineseName: '雞糊',     fan: 0,  description: 'Valid win with no special scoring pattern' },
  { id: 'all-chows',            name: 'All Chows (Ping Woo)', chineseName: '平和',     fan: 1,  description: 'Four sequences + any pair (not wind or dragon)' },
  { id: 'all-pungs',            name: 'All Pungs',            chineseName: '碰碰糊',   fan: 3,  description: 'Four pungs/kongs + any pair' },
  { id: 'mixed-suit',           name: 'Mixed One Suit',       chineseName: '混一色',   fan: 3,  description: 'One numbered suit + winds or dragons' },
  { id: 'seven-pairs',          name: 'Seven Pairs',          chineseName: '七對子',   fan: 4,  description: 'Exactly seven distinct pairs' },
  {
    id: 'little-three-dragons',
    name: 'Little Three Dragons',
    chineseName: '小三元',
    fan: 6, // 4 base + 2 dragon pung bonuses (always present) = 6 total
    description: 'Two dragon pungs + pair of third dragon — includes 2 dragon pung bonuses',
    limitThreeNote: true,
  },
  { id: 'little-four-winds',    name: 'Little Four Winds',    chineseName: '小四喜',   fan: 6,  description: 'Three wind pungs + pair of the fourth wind' },
  { id: 'pure-suit',            name: 'Pure One Suit',        chineseName: '清一色',   fan: 6,  description: 'All tiles from one numbered suit, no honors' },
  { id: 'all-honors',           name: 'All Honors',           chineseName: '字一色',   fan: 7,  description: 'All tiles are winds and/or dragons, no numbered tiles' },
];

// Limit hands — rare, maximum payout
const LIMIT_PATTERNS: HandPattern[] = [
  { id: 'all-terminals',     name: 'All Terminals',     chineseName: '清么九',    fan: LIMIT_FAN, description: 'All 1s and 9s in pungs — Limit Hand' },
  { id: 'big-three-dragons', name: 'Big Three Dragons', chineseName: '大三元',    fan: LIMIT_FAN, description: 'Pungs of all three dragons — Limit Hand' },
  { id: 'big-four-winds',    name: 'Big Four Winds',    chineseName: '大四喜',    fan: LIMIT_FAN, description: 'Pungs of all four winds — Limit Hand' },
  { id: 'thirteen-orphans',  name: 'Thirteen Orphans',  chineseName: '十三么',    fan: LIMIT_FAN, description: 'One of each terminal and honor + any duplicate — Limit Hand' },
  { id: 'nine-gates',        name: 'Nine Gates',        chineseName: '九蓮寶燈',  fan: LIMIT_FAN, description: '1-1-1-2-3-4-5-6-7-8-9-9-9 of one suit — Limit Hand' },
  { id: 'all-kongs',         name: 'All Kongs',         chineseName: '十八羅漢',  fan: LIMIT_FAN, description: 'Four kongs + any pair — Limit Hand' },
];

const ALL_PATTERNS = [...COMMON_PATTERNS, ...LIMIT_PATTERNS];

interface WinBonus {
  id: WinBonusId;
  name: string;
  note: string;
  availableFor: WinMethod | 'both';
}

const WIN_BONUSES: WinBonus[] = [
  { id: 'last-wall-tile',   name: 'Last Tile from Wall',  note: 'Drew the very last tile from the wall (海底撈月)',    availableFor: 'self-draw' },
  { id: 'replacement-tile', name: 'Replacement Tile',     note: 'Winning tile drawn after declaring a kong (嶺上開花)',  availableFor: 'self-draw' },
  { id: 'last-discard',     name: 'Last Discard',         note: 'Won on the last discarded tile of the game (河底撈魚)', availableFor: 'discard' },
  { id: 'robbing-kong',     name: 'Robbing the Kong',     note: 'Claimed a tile someone just added to a pung (搶槓)',    availableFor: 'discard' },
  { id: 'fully-concealed',  name: 'Fully Concealed Hand', note: 'All sets were hidden (no open pungs) — house rule',    availableFor: 'both' },
];

// Payment table: [discarderPays, selfDrawBasePerPlayer]
// Self-draw: dealer loser always pays 2×base; non-dealer losers pay 1×base (or 2× if winner is dealer)
const PAYMENT_TABLE: Record<number, [number, number]> = {
  0: [4, 2], 1: [4, 2], 2: [4, 2],
  3: [8, 4], 4: [16, 8], 5: [24, 12], 6: [32, 16],
  7: [48, 24], 8: [64, 32], 9: [96, 48], 10: [128, 64],
  11: [192, 96], 12: [256, 128],
};
const LIMIT_PAYMENT: [number, number] = [512, 256];

function getPayment(fan: number, isLimit: boolean): [number, number] {
  if (isLimit || fan >= LIMIT_FAN) return LIMIT_PAYMENT;
  return PAYMENT_TABLE[Math.max(0, Math.min(fan, 12))] ?? LIMIT_PAYMENT;
}

function readLocalWind(key: string, fallback: Wind): Wind {
  try { const v = localStorage.getItem(key); return (v as Wind) ?? fallback; } catch { return fallback; }
}
function readLocalInt(key: string, fallback: number): number {
  try { const v = localStorage.getItem(key); return v ? parseInt(v, 10) : fallback; } catch { return fallback; }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScoringCalculator() {
  // Session-level settings — persist in localStorage across hands
  const [roundWind, _setRoundWind] = useState<Wind>(() => readLocalWind(LS_ROUND_WIND, 'East'));
  const [minFan, _setMinFan]       = useState<number>(() => readLocalInt(LS_MIN_FAN, 3));

  const setRoundWind = (w: Wind) => { _setRoundWind(w); try { localStorage.setItem(LS_ROUND_WIND, w); } catch {} };
  const setMinFan    = (n: number) => { _setMinFan(n); try { localStorage.setItem(LS_MIN_FAN, String(n)); } catch {} };

  // Hand-level settings — reset on "New Hand"
  const [handPatternId, setHandPatternId] = useState<HandPatternId | null>(null);
  const [seatWind, setSeatWind]           = useState<Wind>('East');
  const [winMethod, setWinMethod]         = useState<WinMethod>('discard');
  const [isDealer, setIsDealer]           = useState(false);
  const [setBonus, setSetBonus]           = useState<ReadonlySet<SetBonusId>>(new Set());
  const [winBonus, setWinBonus]           = useState<ReadonlySet<WinBonusId>>(new Set());
  const [flowerLevel, setFlowerLevel]     = useState<BonusLevel>('none');
  const [seasonLevel, setSeasonLevel]     = useState<BonusLevel>('none');
  const [noBonus, setNoBonus]             = useState(false);

  const resetHand = () => {
    setHandPatternId(null);
    setSeatWind('East');
    setWinMethod('discard');
    setIsDealer(false);
    setSetBonus(new Set());
    setWinBonus(new Set());
    setFlowerLevel('none');
    setSeasonLevel('none');
    setNoBonus(false);
  };

  // ── Derived values ────────────────────────────────────────────────────────

  const selectedPattern = handPatternId ? ALL_PATTERNS.find(p => p.id === handPatternId) ?? null : null;
  const hasSelection = selectedPattern !== null;
  const isLimit = selectedPattern ? selectedPattern.fan >= LIMIT_FAN : false;

  // Set bonus items — dragon names are dynamic; labeled items for little-three-dragons warning
  const setBonusItems = useMemo(() => [
    { id: 'green-dragon' as const, name: '發 Green Dragon Pung/Kong' },
    { id: 'red-dragon'   as const, name: '中 Red Dragon Pung/Kong' },
    { id: 'white-dragon' as const, name: '白 White Dragon Pung/Kong' },
    { id: 'seat-wind'    as const, name: `${WIND_CHINESE[seatWind]} ${seatWind} Wind Pung/Kong (Your Seat)` },
    { id: 'round-wind'   as const, name: `${WIND_CHINESE[roundWind]} ${roundWind} Wind Pung/Kong (Round Wind)` },
  ], [seatWind, roundWind]);

  const availableWinBonuses = WIN_BONUSES.filter(b => b.availableFor === 'both' || b.availableFor === winMethod);

  // Fan calculation — little-three-dragons fan (6) already includes 2 dragon pung bonuses
  const handFan     = selectedPattern && !isLimit ? selectedPattern.fan : 0;
  const setBonusFan  = setBonus.size;
  const selfDrawFan  = winMethod === 'self-draw' ? 1 : 0;
  const winBonusFan  = winBonus.size;
  const mainFan      = handFan + setBonusFan + selfDrawFan + winBonusFan;

  const flowerFan = noBonus
    ? 1
    : (flowerLevel === 'none' ? 0 : flowerLevel === 'own' ? 1 : 2)
    + (seasonLevel === 'none' ? 0 : seasonLevel === 'own' ? 1 : 2);

  const totalFan = isLimit ? LIMIT_FAN : mainFan + flowerFan;
  const meetsMin = hasSelection && (isLimit || mainFan >= minFan);

  // ── Payment (HKOS dealer asymmetry) ──────────────────────────────────────
  // Discard: discarder pays listed amount (×2 if winner is dealer)
  // Self-draw: dealer loser always pays 2× base; non-dealer losers pay 1× (or 2× if winner is dealer)

  const [baseDis, baseSelf] = getPayment(totalFan, isLimit);
  const discardPay        = baseDis * (isDealer ? 2 : 1);
  const selfNonDealerPay  = baseSelf * (isDealer ? 2 : 1); // what non-dealer losers pay
  const selfDealerPay     = baseSelf * 2;                   // dealer (East) loser always pays double
  const selfTotal         = isDealer
    ? selfNonDealerPay * 3
    : selfDealerPay + selfNonDealerPay * 2;

  // ── Fan breakdown ─────────────────────────────────────────────────────────

  const fanBreakdown = useMemo(() => {
    if (!selectedPattern) return [];
    const items: Array<{ label: string; fan: number }> = [];
    if (isLimit) {
      items.push({ label: `${selectedPattern.chineseName} ${selectedPattern.name}`, fan: LIMIT_FAN });
      return items;
    }
    // For little-three-dragons, show the breakdown (4 base + 2 dragon bonuses) as one annotated entry
    if (selectedPattern.id === 'little-three-dragons') {
      items.push({ label: `${selectedPattern.chineseName} ${selectedPattern.name} (4 base + 2 dragon pungs)`, fan: 6 });
    } else if (selectedPattern.fan > 0) {
      items.push({ label: `${selectedPattern.chineseName} ${selectedPattern.name}`, fan: selectedPattern.fan });
    }
    setBonusItems.forEach(b => { if (setBonus.has(b.id)) items.push({ label: b.name, fan: 1 }); });
    if (winMethod === 'self-draw') items.push({ label: '自摸 Self-Draw', fan: 1 });
    WIN_BONUSES.forEach(b => { if (winBonus.has(b.id)) items.push({ label: b.name, fan: 1 }); });
    if (flowerFan > 0) {
      if (noBonus) { items.push({ label: 'No Bonus Tiles', fan: 1 }); }
      else {
        if (flowerLevel !== 'none') items.push({ label: flowerLevel === 'own' ? 'Own Flower 花' : 'All Four Flowers 花', fan: flowerLevel === 'own' ? 1 : 2 });
        if (seasonLevel !== 'none') items.push({ label: seasonLevel === 'own' ? 'Own Season 季' : 'All Four Seasons 季', fan: seasonLevel === 'own' ? 1 : 2 });
      }
    }
    return items;
  }, [selectedPattern, isLimit, setBonusItems, setBonus, winMethod, winBonus, flowerFan, noBonus, flowerLevel, seasonLevel]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const toggleSetBonus = (id: SetBonusId) => {
    setSetBonus(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleWinBonus = (id: WinBonusId) => {
    setWinBonus(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const handleFlower = (level: BonusLevel) => {
    setFlowerLevel(level); if (level !== 'none') setNoBonus(false);
  };
  const handleSeason = (level: BonusLevel) => {
    setSeasonLevel(level); if (level !== 'none') setNoBonus(false);
  };
  const handleNoBonus = (checked: boolean) => {
    setNoBonus(checked); if (checked) { setFlowerLevel('none'); setSeasonLevel('none'); }
  };
  const handleWinMethod = (method: WinMethod) => {
    setWinMethod(method);
    setWinBonus(prev => {
      const n = new Set(prev);
      WIN_BONUSES.forEach(b => { if (b.availableFor !== 'both' && b.availableFor !== method) n.delete(b.id); });
      return n;
    });
  };

  const fanDisplay = isLimit ? '13+' : totalFan;

  return (
    <PageContent className="scoring-container calc-page-content">
      <PageHeader
        title="Score Calculator"
        subtitle="Calculate your fan and payment for each winning hand."
      />


      {/* ── Session Settings (persist across hands) ─────────────────────── */}
      <div className="calc-session-bar">
        <span className="calc-session-label">Session Settings</span>

        <div className="calc-session-group">
          <span className="calc-setting-label">Round Wind</span>
          <div className="calc-segmented calc-segmented--compact">
            {WINDS.map(w => (
              <button key={w} type="button"
                className={`calc-seg-btn${roundWind === w ? ' active' : ''}`}
                onClick={() => setRoundWind(w)}
              >
                <span className="calc-wind-cn-sm">{WIND_CHINESE[w]}</span>
                <span>{w}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="calc-session-group">
          <span className="calc-setting-label">Min Fan to Win</span>
          <div className="calc-segmented calc-segmented--compact">
            {[0, 1, 2, 3].map(n => (
              <button key={n} type="button"
                className={`calc-seg-btn${minFan === n ? ' active' : ''}`}
                onClick={() => setMinFan(n)}
              >{n}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="calc-layout">

        {/* ── LEFT: Hand inputs ────────────────────────────────────────────── */}
        <div className="calc-left">

          {/* This Hand settings */}
          <div className="calc-section">
            <SectionHeader icon={<Target size={20} />} title="This Hand" />

            <div className="calc-settings-grid">
              <div className="calc-setting-group">
                <span className="calc-setting-label">Winner's Seat Wind</span>
                <div className="calc-wind-row">
                  {WINDS.map(w => (
                    <button key={w} type="button"
                      className={`calc-wind-btn${seatWind === w ? ' active' : ''}`}
                      onClick={() => setSeatWind(w)}
                    >
                      <span className="calc-wind-cn">{WIND_CHINESE[w]}</span>
                      <span className="calc-wind-en">{w}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="calc-setting-group">
                <span className="calc-setting-label">Win Method</span>
                <div className="calc-segmented">
                  <button type="button"
                    className={`calc-seg-btn${winMethod === 'discard' ? ' active' : ''}`}
                    onClick={() => handleWinMethod('discard')}
                  >Discard 放炮</button>
                  <button type="button"
                    className={`calc-seg-btn${winMethod === 'self-draw' ? ' active' : ''}`}
                    onClick={() => handleWinMethod('self-draw')}
                  >Self-Draw 自摸 <span className="calc-fan-tag">+1</span></button>
                </div>
                <p className="calc-hint">Someone discarded the winning tile? → Discard. Winner drew it from the wall? → Self-Draw.</p>
              </div>

              <div className="calc-setting-group">
                <label className="calc-check-label">
                  <input type="checkbox" checked={isDealer} onChange={e => setIsDealer(e.target.checked)} />
                  <span className="calc-check-box" />
                  <div className="calc-check-text">
                    <span className="calc-check-name">Winner is the Dealer 莊家 (East)</span>
                    <span className="calc-check-note">East dealer wins — all payments to the winner are doubled</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Hand Patterns */}
          <div className="calc-section">
            <SectionHeader icon={<LayoutGrid size={20} />} title="Hand Pattern" />
            <p className="calc-hint">Select the pattern that best describes the winning hand. Choose one.</p>

            <div className="pattern-group-label">Common Patterns</div>
            <div className="pattern-grid">
              {COMMON_PATTERNS.map(p => (
                <PatternCard key={p.id} pattern={p} selected={handPatternId === p.id} onSelect={() => setHandPatternId(p.id)} />
              ))}
            </div>

            <div className="pattern-group-label pattern-group-label--limit">Limit Hands 最大 — Maximum Payout</div>
            <div className="pattern-grid">
              {LIMIT_PATTERNS.map(p => (
                <PatternCard key={p.id} pattern={p} selected={handPatternId === p.id} onSelect={() => setHandPatternId(p.id)} />
              ))}
            </div>

            {selectedPattern?.limitThreeNote && (
              <InfoBox accent="amber">
                <strong>小三元 Note:</strong> The 6 fan already includes 4 (base) + 2 (dragon pung bonuses). Do <strong>not</strong> also check those two dragon pungs in Set Bonuses — that would double-count them.
              </InfoBox>
            )}
          </div>

          {/* Set Bonuses */}
          <div className="calc-section">
            <SectionHeader icon={<PlusCircle size={20} />} title="Set Bonuses" />
            <p className="calc-hint">Have a pung or kong of any of these tiles? Each one adds +1 fan on top of your hand pattern.</p>
            {seatWind === roundWind && (
              <InfoBox accent="amber">
                Seat and round wind are both <strong>{WIND_CHINESE[seatWind]} {seatWind}</strong> — a pung of this wind gives <strong>2 fan</strong>. Check both boxes below.
              </InfoBox>
            )}
            <div className="calc-check-list">
              {setBonusItems.map(item => (
                <label key={item.id} className="calc-check-label">
                  <input type="checkbox" checked={setBonus.has(item.id)} onChange={() => toggleSetBonus(item.id)} />
                  <span className="calc-check-box" />
                  <div className="calc-check-text">
                    <span className="calc-check-name">{item.name}</span>
                    <span className="calc-fan-tag-inline">+1 fan</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Winning Condition Bonuses */}
          <div className="calc-section">
            <SectionHeader icon={<Trophy size={20} />} title="Winning Condition Bonuses" />
            {winMethod === 'self-draw'
              ? <p className="calc-hint">Self-Draw +1 is already counted above. Check any additional special conditions.</p>
              : <p className="calc-hint">Check any special conditions that apply to this winning discard.</p>
            }
            <div className="calc-check-list">
              {availableWinBonuses.map(b => (
                <label key={b.id} className="calc-check-label">
                  <input type="checkbox" checked={winBonus.has(b.id)} onChange={() => toggleWinBonus(b.id)} />
                  <span className="calc-check-box" />
                  <div className="calc-check-text">
                    <span className="calc-check-name">{b.name}</span>
                    <span className="calc-check-note">{b.note}</span>
                    <span className="calc-fan-tag-inline">+1 fan</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Flower & Season Bonuses */}
          <div className="calc-section">
            <SectionHeader icon={<Flower2 size={20} />} title="Flower & Season Bonuses" />
            <InfoBox accent="green">
              Flower and season fan stack on top of the score but do <strong>not</strong> count toward the minimum fan requirement.
            </InfoBox>
            <div className="calc-flower-grid">
              <div className="calc-setting-group">
                <span className="calc-setting-label">Flower Tiles 花</span>
                <div className="calc-segmented">
                  {(['none', 'own', 'all-four'] as BonusLevel[]).map(lv => (
                    <button key={lv} type="button"
                      className={`calc-seg-btn${flowerLevel === lv ? ' active' : ''}${noBonus ? ' disabled' : ''}`}
                      onClick={() => handleFlower(lv)} disabled={noBonus}
                    >{lv === 'none' ? 'None' : lv === 'own' ? 'Own Flower +1' : 'All Four +2'}</button>
                  ))}
                </div>
              </div>
              <div className="calc-setting-group">
                <span className="calc-setting-label">Season Tiles 季</span>
                <div className="calc-segmented">
                  {(['none', 'own', 'all-four'] as BonusLevel[]).map(lv => (
                    <button key={lv} type="button"
                      className={`calc-seg-btn${seasonLevel === lv ? ' active' : ''}${noBonus ? ' disabled' : ''}`}
                      onClick={() => handleSeason(lv)} disabled={noBonus}
                    >{lv === 'none' ? 'None' : lv === 'own' ? 'Own Season +1' : 'All Four +2'}</button>
                  ))}
                </div>
              </div>
              <div className="calc-or-divider">— OR —</div>
              <div className="calc-setting-group">
                <label className="calc-check-label">
                  <input type="checkbox" checked={noBonus} onChange={e => handleNoBonus(e.target.checked)} />
                  <span className="calc-check-box" />
                  <div className="calc-check-text">
                    <span className="calc-check-name">No Flowers or Seasons</span>
                    <span className="calc-check-note">+1 bonus fan for holding no bonus tiles at all</span>
                    <span className="calc-fan-tag-inline">+1 fan</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Live Result ────────────────────────────────────────────── */}
        <div className="calc-right">
          <div className={`result-card${isLimit ? ' result-card--limit' : ''}${hasSelection && !meetsMin ? ' result-card--invalid' : ''}`}>

            {/* Fan hero */}
            <div className="result-fan-hero">
              {hasSelection ? (
                <>
                  <div className="result-fan-number" key={fanDisplay}>{fanDisplay}</div>
                  <div className="result-fan-unit">Fan 番</div>
                  {isLimit && <div className="result-limit-badge">最大 LIMIT HAND</div>}
                </>
              ) : (
                <>
                  <div className="result-fan-placeholder">—</div>
                  <div className="result-fan-unit">Fan 番</div>
                </>
              )}
            </div>

            {/* Status */}
            <div className={`result-min-status${!hasSelection ? ' neutral' : meetsMin ? ' valid' : ' invalid'}`}>
              {!hasSelection
                ? 'Select a hand pattern to start'
                : meetsMin
                  ? `✓ Meets ${minFan} fan minimum`
                  : `✗ Below ${minFan} fan minimum`}
            </div>

            {/* Payment — selected win method only */}
            {hasSelection && meetsMin && (
              <div className="result-payments">
                {winMethod === 'discard' ? (
                  <div className="result-payment-section">
                    <div className="result-payment-label">Discard Win 放炮</div>
                    <div className="result-payment-row">
                      <span className="result-payment-desc">Discarder pays</span>
                      <span className="result-payment-pts">
                        {isDealer && baseDis !== discardPay
                          ? <>{baseDis} × 2 = <strong>{discardPay}</strong></>
                          : <strong>{discardPay}</strong>} pts
                      </span>
                    </div>
                    <div className="result-payment-row secondary">
                      <span className="result-payment-desc">Others pay</span>
                      <span className="result-payment-pts">0 pts <span className="result-payment-note">(HKOS: discarder covers all)</span></span>
                    </div>
                    <div className="result-payment-total">
                      <span>Winner collects</span>
                      <span className="result-total-pts">{discardPay} pts</span>
                    </div>
                  </div>
                ) : (
                  <div className="result-payment-section">
                    <div className="result-payment-label">Self-Draw Win 自摸</div>
                    {isDealer ? (
                      <>
                        <div className="result-payment-row">
                          <span className="result-payment-desc">Each player pays (dealer wins ×2)</span>
                          <span className="result-payment-pts"><strong>{selfNonDealerPay}</strong> pts</span>
                        </div>
                        <div className="result-payment-total">
                          <span>Winner collects (×3 players)</span>
                          <span className="result-total-pts">{selfTotal} pts</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="result-payment-row">
                          <span className="result-payment-desc">Dealer (East) pays</span>
                          <span className="result-payment-pts">
                            {baseSelf} × 2 = <strong>{selfDealerPay}</strong> pts
                          </span>
                        </div>
                        <div className="result-payment-row">
                          <span className="result-payment-desc">Each other player pays</span>
                          <span className="result-payment-pts"><strong>{selfNonDealerPay}</strong> pts</span>
                        </div>
                        <div className="result-payment-total">
                          <span>Winner collects</span>
                          <span className="result-total-pts">{selfTotal} pts</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {isDealer && (
                  <div className="result-dealer-note">東 Dealer bonus ×2 applied — winner is East</div>
                )}
              </div>
            )}

            {/* Fan breakdown */}
            {fanBreakdown.length > 0 && (
              <div className="result-breakdown">
                <div className="result-breakdown-title">Fan Breakdown 計番</div>
                {fanBreakdown.map((item, i) => (
                  <div key={i} className="result-breakdown-row">
                    <span className="result-breakdown-label">{item.label}</span>
                    <span className="result-breakdown-fan">
                      {item.fan >= LIMIT_FAN ? 'Limit' : `+${item.fan}`}
                    </span>
                  </div>
                ))}
                {!isLimit && flowerFan > 0 && (
                  <div className="result-breakdown-sub">
                    Main: {mainFan} fan + Bonus tiles: {flowerFan} fan
                  </div>
                )}
                <div className="result-breakdown-total">
                  <span>Total</span>
                  <span>{isLimit ? '13+ (Limit)' : `${totalFan} fan`}</span>
                </div>
              </div>
            )}

            {/* New Hand button */}
            {hasSelection && (
              <div className="result-new-hand">
                <button type="button" className="new-hand-btn" onClick={resetHand}>
                  New Hand 下一局
                </button>
              </div>
            )}

            {!hasSelection && (
              <p className="result-empty">Pick a hand pattern on the left to calculate the score.</p>
            )}

          </div>
        </div>

      </div>

      {/* ── Mobile sticky score bar ───────────────────────────────────────── */}
      {hasSelection && (
        <div className={`calc-mobile-bar${isLimit ? ' limit' : ''}${!meetsMin ? ' invalid' : ''}`}>
          <div className="calc-mobile-fan">
            <span className="calc-mobile-fan-num">{fanDisplay}</span>
            <span className="calc-mobile-fan-unit">Fan</span>
          </div>
          {meetsMin ? (
            <div className="calc-mobile-pay">
              {winMethod === 'discard'
                ? `Discard: ${discardPay} pts`
                : `Self-Draw: ${selfTotal} pts total`}
            </div>
          ) : (
            <div className="calc-mobile-warn">Below {minFan} fan min</div>
          )}
          <button type="button" className="calc-mobile-new-hand" onClick={resetHand}>
            New Hand
          </button>
        </div>
      )}

    </PageContent>
  );
}

// ── PatternCard sub-component ─────────────────────────────────────────────────

interface PatternCardProps {
  pattern: HandPattern;
  selected: boolean;
  onSelect: () => void;
}

function PatternCard({ pattern, selected, onSelect }: PatternCardProps) {
  const isLmt = pattern.fan >= LIMIT_FAN;
  return (
    <button type="button"
      className={`pattern-card${selected ? ' selected' : ''}${isLmt ? ' limit' : ''}`}
      onClick={onSelect}
    >
      {selected && <span className="pattern-check">✓</span>}
      <div className="pattern-chinese">{pattern.chineseName}</div>
      <div className="pattern-name">{pattern.name}</div>
      <div className="pattern-fan">{isLmt ? 'Limit 最大' : pattern.fan === 0 ? '0 fan' : `+${pattern.fan} fan`}</div>
      <div className="pattern-desc">{pattern.description}</div>
    </button>
  );
}
