import { Link } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useLang } from '@/i18n/LanguageContext';

const valueIcons = ['🎯', '⚡', '💡'];

export const About = () => {
  const { t } = useLang();
  return (
    <>
      <Breadcrumb
        title={t.about.title}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.about.breadcrumb }]}
      />
      <section className="section">
        <div className="container about-hero">
          <div>
            <h2>
              {t.about.heroTitle[0]}
              <span className="text-primary">{t.about.heroTitle[1]}</span>
            </h2>
            <p>{t.about.desc1}</p>
            <p>{t.about.desc2}</p>
            <Link to="/shop" className="btn btn-primary mt-2">{t.common.explore}</Link>
          </div>
          <div style={{
            aspectRatio: '1/1',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-primary-light), #e3effb)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '10rem',
          }}>
            🖨️
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container">
          <div className="section-title">
            <h2>{t.about.valuesTitle}</h2>
            <p>{t.about.valuesDesc}</p>
          </div>
          <div className="values-grid">
            {t.about.values.map((v, i) => (
              <div key={v.title} className="value-card">
                <div className="icon">{valueIcons[i]}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
