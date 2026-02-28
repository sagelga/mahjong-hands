interface StatPill {
  value: string | number;
  label: string;
  color: string;
  borderColor: string;
}

interface Props {
  stats: StatPill[];
}

export function ScoringStatsBar({ stats }: Props) {
  return (
    <div className="scoring-stats">
      {stats.map(stat => (
        <div key={stat.label} className="stat-pill" style={{ borderColor: stat.borderColor }}>
          <div className="stat-pill-value" style={{ color: stat.color }}>{stat.value}</div>
          <div className="stat-pill-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
