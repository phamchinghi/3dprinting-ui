import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { blogApi, type ApiBlogPost } from '@/api/blog';
import { ApiError } from '@/api/client';
import { useLang } from '@/i18n/LanguageContext';

export const Blog = () => {
  const { t } = useLang();
  const [posts, setPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    blogApi.list(1, 50)
      .then((res) => { if (!cancelled) setPosts(res.items); })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Không tải được danh sách bài viết');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Ưu tiên publishedAt (BE stamp khi publish), fallback createdAt — locale vi-VN
  const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '';

  return (
    <>
      <Breadcrumb
        title={t.blog.title}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.blog.title }]}
      />
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="empty-state"><div className="icon">⏳</div><h2>...</h2></div>
          ) : error ? (
            <div className="empty-state"><div className="icon">⚠️</div><h2>{error}</h2></div>
          ) : posts.length === 0 ? (
            <div className="empty-state"><div className="icon">📰</div><h2>{t.blog.notFound}</h2></div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  <Link to={`/blog/${post.slug}`} className="media" aria-hidden>
                    <span>{post.emoji ?? '📰'}</span>
                  </Link>
                  <div className="body">
                    <div className="meta">
                      {fmtDate(post.publishedAt ?? post.createdAt)}
                      {post.categoryName && ` · ${post.categoryName}`}
                    </div>
                    <h4><Link to={`/blog/${post.slug}`}>{post.title}</Link></h4>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <Link to={`/blog/${post.slug}`} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '.9rem' }}>
                      {t.blog.readMore}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
