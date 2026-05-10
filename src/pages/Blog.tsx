import { Link } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { blogPosts } from '@/data/products';
import { formatDate } from '@/utils/format';
import { useLang } from '@/i18n/LanguageContext';

export const Blog = () => {
  const { t } = useLang();
  return (
    <>
      <Breadcrumb
        title={t.blog.title}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.blog.title }]}
      />
      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <Link to={`/blog/${post.slug}`} className="media" aria-hidden>
                  <span>{post.emoji}</span>
                </Link>
                <div className="body">
                  <div className="meta">{formatDate(post.date)} · {post.category}</div>
                  <h4><Link to={`/blog/${post.slug}`}>{post.title}</Link></h4>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '.9rem' }}>
                    {t.blog.readMore}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
