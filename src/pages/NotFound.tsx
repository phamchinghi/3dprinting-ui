import { Link } from 'react-router-dom';
import { useLang } from '@/i18n/LanguageContext';

export const NotFound = () => {
  const { t } = useLang();
  return (
    <section className="section">
      <div className="container empty-state" style={{ padding: '6rem 1rem' }}>
        <div className="icon" style={{ fontSize: '6rem' }}>🤖</div>
        <h1>{t.notFound.title}</h1>
        <p>{t.notFound.desc}</p>
        <Link to="/" className="btn btn-primary">{t.notFound.back}</Link>
      </div>
    </section>
  );
};