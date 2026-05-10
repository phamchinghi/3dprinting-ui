import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductGrid } from '@/components/ProductGrid';
import { products } from '@/data/products';
import { useLang } from '@/i18n/LanguageContext';
import { categoryApi, type Category } from '@/api/category';

const fallbackIcons = ['🎎', '🪴', '🧵', '🛠️'];
const fallbackSlugs = ['model', 'accessory', 'filament', 'service'];

export const Home = () => {
  const { t, lang } = useLang();
  const featured = products.slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === 'new').slice(0, 4);

  // Categories từ BE — fallback i18n nếu API rỗng/lỗi
  const [categories, setCategories] = useState<Category[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    categoryApi.list()
      .then((list) => { if (!cancelled) setCategories(list); })
      .catch(() => { if (!cancelled) setCategories([]); });
    return () => { cancelled = true; };
  }, []);

  const useFallback = categories === null || categories.length === 0;

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div style={{
              color: 'var(--color-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '.12em',
              fontSize: '.8rem',
              fontWeight: 600,
              marginBottom: '.75rem',
            }}>
              {t.home.eyebrow}
            </div>
            <h1>
              {t.home.heroTitle[0]}
              <span>{t.home.heroTitle[1]}</span>
            </h1>
            <p className="lead">{t.home.heroDesc}</p>
            <div className="hero-ctas">
              <Link to="/shop" className="btn btn-primary btn-lg">{t.home.heroCtaPrimary}</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">{t.home.heroCtaSecondary}</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{t.home.stat1Value}</strong><span>{t.home.stat1Label}</span>
              </div>
              <div className="hero-stat">
                <strong>{t.home.stat2Value}</strong><span>{t.home.stat2Label}</span>
              </div>
              <div className="hero-stat">
                <strong>{t.home.stat3Value}</strong><span>{t.home.stat3Label}</span>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden>
            <div className="hero-visual-emoji">🖨️</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>{t.home.categoriesTitle}</h2>
            <p>{t.home.categoriesDesc}</p>
          </div>
          <div className="categories-grid">
            {useFallback
              ? t.home.categories.map((c, i) => (
                  <Link key={c.title} to={`/shop?category=${fallbackSlugs[i]}`} className="cat-card">
                    <div className="icon">{fallbackIcons[i]}</div>
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </Link>
                ))
              : categories!.map((c) => (
                  <Link key={c.id} to={`/shop?category=${c.slug}`} className="cat-card">
                    <div className="icon">{c.iconEmoji ?? '📦'}</div>
                    <h4>{lang === 'vi' ? c.nameVi : c.nameEn}</h4>
                    <p>{(lang === 'vi' ? c.descriptionVi : c.descriptionEn) ?? ''}</p>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container">
          <div className="section-title">
            <h2>{t.home.featuredTitle}</h2>
            <p>{t.home.featuredDesc}</p>
          </div>
          <ProductGrid products={featured} />
          <div className="text-center mt-4">
            <Link to="/shop" className="btn btn-outline">{t.common.viewAll}</Link>
          </div>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>{t.home.newTitle}</h2>
              <p>{t.home.newDesc}</p>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      <section className="section" style={{ background: 'var(--color-primary)', color: '#fff' }}>
        <div className="container text-center">
          <h2 style={{ color: '#fff' }}>{t.home.ctaBannerTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: 560, margin: '0 auto 1.5rem' }}>
            {t.home.ctaBannerDesc}
          </p>
          <Link to="/contact" className="btn" style={{ background: '#fff', color: 'var(--color-primary)' }}>
            {t.common.contactUs}
          </Link>
        </div>
      </section>
    </>
  );
};
