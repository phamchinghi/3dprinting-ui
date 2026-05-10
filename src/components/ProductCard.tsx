import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/i18n/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const badgeLabel = { new: 'New', sale: 'Sale', hot: 'Hot' } as const;

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (product.videoUrl && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (product.videoUrl && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article className="product-card">
      <Link
        to={`/shop/${product.slug}`}
        className="media"
        aria-label={product.name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {product.badge && (
          <span className={`badge ${product.badge === 'sale' ? 'sale' : ''}`}>
            {badgeLabel[product.badge]}
          </span>
        )}
        {product.videoUrl && (
          <span className="badge-video">▶ Video</span>
        )}
        <span className="media-emoji" aria-hidden>{product.emoji}</span>
        {product.videoUrl && (
          <video
            ref={videoRef}
            className="media-video"
            src={product.videoUrl}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </Link>
      <div className="body">
        <div className="cat">{product.categoryLabel}</div>
        <h4><Link to={`/shop/${product.slug}`}>{product.name}</Link></h4>
        <div className="card-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>
        <div className="price">
          {product.oldPrice && <span className="old">{formatPrice(product.oldPrice)}</span>}
          {formatPrice(product.price)}
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={() => addItem(product)}>
            {t.common.addToCart}
          </button>
          <Link to={`/shop/${product.slug}`} className="btn btn-ghost">
            {t.common.details}
          </Link>
        </div>
      </div>
    </article>
  );
};
