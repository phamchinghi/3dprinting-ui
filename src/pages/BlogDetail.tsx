import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { blogPosts } from '@/data/products';
import { formatDate } from '@/utils/format';
import { useLang } from '@/i18n/LanguageContext';

export const BlogDetail = () => {
  const { slug }  = useParams<{ slug: string }>();
  const { t }     = useLang();
  const post      = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="section">
        <div className="container empty-state">
          <div className="icon">📰</div>
          <h2>{t.blog.notFound}</h2>
          <Link to="/blog" className="btn btn-primary">{t.blog.back}</Link>
        </div>
      </section>
    );
  }

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <Breadcrumb
        title={post.title}
        crumbs={[
          { label: t.nav.home, to: '/' },
          { label: t.blog.title, to: '/blog' },
          { label: post.title },
        ]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ fontSize: '.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            {formatDate(post.date)} · {post.category} · {post.author}
          </div>
          <div style={{
            aspectRatio: '16/8',
            background: 'linear-gradient(135deg, var(--color-primary-light), #e3effb)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '8rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
          }}>
            {post.emoji}
          </div>
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text)' }}>{post.excerpt}</p>
            <p>{post.content}</p>
            <p>
              {t.blog.contactCtaText}{' '}
              <Link to="/contact" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                {t.blog.contactCta}
              </Link>
              {t.blog.contactCtaSuffix}
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container">
          <div className="section-title"><h2>{t.blog.related}</h2></div>
          <div className="blog-grid">
            {related.map((p) => (
              <article key={p.id} className="blog-card">
                <Link to={`/blog/${p.slug}`} className="media" aria-hidden><span>{p.emoji}</span></Link>
                <div className="body">
                  <div className="meta">{formatDate(p.date)} · {p.category}</div>
                  <h4><Link to={`/blog/${p.slug}`}>{p.title}</Link></h4>
                  <p>{p.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
