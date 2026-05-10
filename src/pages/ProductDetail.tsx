import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGrid } from '@/components/ProductGrid';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/format';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/i18n/LanguageContext';

type MediaTab = 'main' | 'video';

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t } = useLang();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.slug === slug);

  const [activeMedia, setActiveMedia] = useState<MediaTab>(
    product?.videoUrl ? 'video' : 'main'
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setActiveMedia(product?.videoUrl ? 'video' : 'main');
  }, [slug]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (activeMedia === 'video') {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [activeMedia]);

  if (!product) {
    return (
      <section className="section">
        <div className="container empty-state">
          <div className="icon">😕</div>
          <h2>{t.detail.notFound}</h2>
          <Link to="/shop" className="btn btn-primary">{t.detail.backShop}</Link>
        </div>
      </section>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  const handleAddToCart = () => addItem(product, qty);
  const handleBuyNow   = () => { addItem(product, qty); navigate('/cart'); };

  return (
    <>
      <Breadcrumb
        title={product.name}
        crumbs={[
          { label: t.nav.home, to: '/' },
          { label: t.nav.shop, to: '/shop' },
          { label: product.name },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="detail-layout">
            <div>
              <div className="detail-image">
                {activeMedia === 'video' && product.videoUrl ? (
                  <video
                    ref={videoRef}
                    className="detail-video"
                    src={product.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  <span aria-hidden>{product.emoji}</span>
                )}
              </div>
              <div className="detail-thumbs">
                <div
                  className={activeMedia === 'main' ? 'active' : ''}
                  onClick={() => setActiveMedia('main')}
                  title={product.name}
                >
                  {product.emoji}
                </div>
                {product.videoUrl && (
                  <div
                    className={`detail-thumb-video${activeMedia === 'video' ? ' active' : ''}`}
                    onClick={() => setActiveMedia('video')}
                    title={t.detail.watchVideo}
                  >
                    ▶
                  </div>
                )}
                <div>📷</div>
                <div>🎨</div>
                <div>📐</div>
              </div>
            </div>

            <div className="detail-info">
              <div style={{ color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '.1em', fontSize: '.8rem' }}>
                {product.categoryLabel}
              </div>
              <h1>{product.name}</h1>
              <div className="detail-rating">
                {stars}
                <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
                  ({product.reviewCount} {t.detail.reviews})
                </span>
              </div>
              <div className="detail-price">
                <span className="current">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="old">{formatPrice(product.oldPrice)}</span>}
              </div>
              <p>{product.description}</p>
              <div className="detail-meta">
                {product.material   && <div><strong>{t.detail.material}</strong> {product.material}</div>}
                {product.dimensions && <div><strong>{t.detail.dimensions}</strong> {product.dimensions}</div>}
                <div>
                  <strong>{t.detail.status}</strong>{' '}
                  {product.inStock ? t.common.inStock : t.common.outOfStock}
                </div>
              </div>

              <div className="detail-actions">
                <div className="qty-control">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                  🛒 {t.common.addToCart}
                </button>
                <button className="btn btn-outline btn-lg" onClick={handleBuyNow}>
                  {t.common.buyNow}
                </button>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3>{t.detail.detailTitle}</h3>
                <p>{product.longDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
          <div className="container">
            <div className="section-title"><h2>{t.detail.related}</h2></div>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
};
