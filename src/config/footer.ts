import type { FooterColumn } from '@/types/ui';

// ── Col 3: sagelga brand ─────────────────────────────────────────────────────
export const SAGELGA_COLUMN: FooterColumn = {
  title: 'sagelga',
  links: [
    { label: 'sagelga.com', href: 'https://sagelga.com', external: true },
    { label: 'Learn', href: 'https://learn.sagelga.com', external: true },
    { label: 'Documentation', href: 'https://docs.sagelga.com', external: true },
  ],
};

// ── Col 4: Connect ───────────────────────────────────────────────────────────
export const SAGELGA_SOCIALS_COLUMN: FooterColumn = {
  title: 'Connect',
  links: [
    { label: 'GitHub', href: 'https://github.com/sagelga', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/kunanon', external: true },
  ],
};

// ── Col 2 helper: project meta ───────────────────────────────────────────────
export function makeProjectMetaColumn(githubRepo: string): FooterColumn {
  return {
    title: 'Project',
    links: [
      { label: 'GitHub', href: `https://github.com/${githubRepo}`, external: true },
      { label: 'Feedback', href: `https://github.com/${githubRepo}/issues`, external: true },
      { label: 'Changelog', href: `https://github.com/${githubRepo}/releases`, external: true },
      { label: 'System Status', href: 'https://status.sagelga.com', external: true },
      { label: 'Privacy Policy', href: 'https://sagelga.com/privacy-policy', external: true },
    ],
  };
}
