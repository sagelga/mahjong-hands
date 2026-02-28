export interface FanItem { name: string; fan: number; note: string; }
export type Accent = 'green' | 'pink' | 'amber' | 'blue' | 'violet';

interface FanGalleryProps {
  items: FanItem[];
  accent: Accent;
  fanLabel?: string;
}

export function FanGallery({ items, accent, fanLabel = 'Fan' }: FanGalleryProps) {
  return (
    <div className="fan-gallery">
      {items.map(item => (
        <div key={item.name} className="fan-card" data-accent={accent}>
          <div className="fan-badge" data-accent={accent}>
            {item.fan} {fanLabel}
          </div>
          <div className="fan-card-name">{item.name}</div>
          {item.note && <div className="fan-card-note">{item.note}</div>}
        </div>
      ))}
    </div>
  );
}
