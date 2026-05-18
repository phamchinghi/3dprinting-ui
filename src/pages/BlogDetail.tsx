import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { blogApi, type ApiBlogPost } from '@/api/blog';
import { ApiError } from '@/api/client';
import { useLang } from '@/i18n/LanguageContext';

const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '';

export const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t }    = useLang();

  const [post, setPost]       = useState<ApiBlogPost | null>(null);
  const [related, setRelated] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true); setNotFound(false); setPost(null); setRelated([]);

    blogApi.getBySlug(slug)
      .then((p) => {
        if (cancelled) return;
        setPost(p);
        // Related: lấy thêm bài cùng list public, loại bỏ chính mình, lấy max 3.
        // BE chưa có /blog?category=... nên dùng list paginated rồi filter client-side.
        return blogApi.list(1, 12).then((res) => {
          if (cancelled) return;
          setRelated(res.items.filter((r) => r.id !== p.id).slice(0, 3));
        });
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setNotFound(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <section className="section">
        <div className="container empty-state">
          <div className="icon">⏳</div>
          <h2>...</h2>
        </div>
      </section>
    );
  }

  if (notFound || !post) {
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

  const dateStr = fmtDate(post.publishedAt ?? post.createdAt);

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
            {dateStr}
            {post.categoryName && ` · ${post.categoryName}`}
            {post.authorName   && ` · ${post.authorName}`}
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
            {post.emoji ?? '📰'}
          </div>
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            {post.excerpt && <p style={{ fontSize: '1.2rem', color: 'var(--color-text)' }}>{post.excerpt}</p>}
            {post.content && <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>}
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

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
          <div className="container">
            <div className="section-title"><h2>{t.blog.related}</h2></div>
            <div className="blog-grid">
              {related.map((p) => (
                <article key={p.id} className="blog-card">
                  <Link to={`/blog/${p.slug}`} className="media" aria-hidden>
                    <span>{p.emoji ?? '📰'}</span>
                  </Link>
                  <div className="body">
                    <div className="meta">
                      {fmtDate(p.publishedAt ?? p.createdAt)}
                      {p.categoryName && ` · ${p.categoryName}`}
                    </div>
                    <h4><Link to={`/blog/${p.slug}`}>{p.title}</Link></h4>
                    {p.excerpt && <p>{p.excerpt}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
