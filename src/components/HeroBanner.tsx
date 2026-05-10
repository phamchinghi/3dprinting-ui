import type { ReactNode } from 'react';

export interface HeroStat {
  value: string;
  label: string;
}

interface HeroBannerProps {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  ctas?: ReactNode;
  stats?: HeroStat[];
  visual?: ReactNode;
}

export const HeroBanner = ({ eyebrow, title, description, ctas, stats, visual }: HeroBannerProps) => (
  <section className="hero">
    <div className="container hero-grid">
      <div>
        {eyebrow && (
          <div style={{
            color: 'var(--color-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '.12em',
            fontSize: '.8rem',
            fontWeight: 600,
            marginBottom: '.75rem',
          }}>
            {eyebrow}
          </div>
        )}
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        {ctas && <div className="hero-ctas">{ctas}</div>}
        {stats && stats.length > 0 && (
          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label} className="hero-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="hero-visual" aria-hidden>
        {visual ?? <div className="hero-visual-emoji">🖨️</div>}
      </div>
    </div>
  </section>
);
