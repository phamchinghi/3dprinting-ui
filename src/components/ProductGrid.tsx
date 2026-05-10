import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { useLang } from '@/i18n/LanguageContext';

export const ProductGrid = ({ products }: { products: Product[] }) => {
  const { t } = useLang();
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">🔍</div>
        <h3>{t.shop.noProducts}</h3>
        <p>{t.shop.noProductsDesc}</p>
      </div>
    );
  }
  return (
    <div className="products-grid">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};
