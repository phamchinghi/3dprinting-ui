import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGrid } from '@/components/ProductGrid';
import { products } from '@/data/products';
import { useLang } from '@/i18n/LanguageContext';
import type { ProductCategory } from '@/types';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating';

const PAGE_SIZE = 6;

const priceRangesData = [
  { id: 'all', min: 0, max: Infinity },
  { id: 'r1',  min: 0, max: 100000 },
  { id: 'r2',  min: 100000, max: 300000 },
  { id: 'r3',  min: 300000, max: 600000 },
  { id: 'r4',  min: 600000, max: Infinity },
];

const allCategories: Array<{ value: ProductCategory | 'all'; key: string }> = [
  { value: 'all',       key: 'allCategories' },
  { value: 'model',     key: 'model' },
  { value: 'accessory', key: 'accessory' },
  { value: 'filament',  key: 'filament' },
  { value: 'service',   key: 'service' },
];

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLang();

  const initialCat = (searchParams.get('category') as ProductCategory | null) ?? 'all';
  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCat);
  const [priceRangeId, setPriceRangeId] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const c = searchParams.get('category');
    setCategory((c as ProductCategory | null) ?? 'all');
    setPage(1);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const range = priceRangesData.find((r) => r.id === priceRangeId)!;
    let list = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    switch (sort) {
      case 'price-asc':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating':     list = [...list].sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [category, priceRangeId, sort, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategory = (val: ProductCategory | 'all') => {
    setCategory(val);
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (val === 'all') next.delete('category');
    else next.set('category', val);
    setSearchParams(next, { replace: true });
  };

  const catLabel = (key: string) => {
    if (key === 'allCategories') return t.shop.allCategories;
    return t.shop.catLabels[key as ProductCategory] ?? key;
  };

  return (
    <>
      <Breadcrumb
        title={t.shop.title}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.shop.breadcrumb }]}
      />
      <section className="section">
        <div className="container">
          <div className="shop-layout">
            <aside className="filter-panel">
              <div className="filter-group">
                <h5>{t.shop.categories}</h5>
                {allCategories.map((opt) => (
                  <label key={opt.value}>
                    <input
                      type="radio"
                      name="category"
                      checked={category === opt.value}
                      onChange={() => handleCategory(opt.value)}
                    />
                    {catLabel(opt.value === 'all' ? 'allCategories' : opt.value)}
                  </label>
                ))}
              </div>
              <div className="filter-group">
                <h5>{t.shop.priceRange}</h5>
                {priceRangesData.map((r, i) => (
                  <label key={r.id}>
                    <input
                      type="radio"
                      name="price"
                      checked={priceRangeId === r.id}
                      onChange={() => { setPriceRangeId(r.id); setPage(1); }}
                    />
                    {t.shop.priceRanges[i]}
                  </label>
                ))}
              </div>
              <div className="filter-group">
                <h5>{t.shop.search}</h5>
                <input
                  className="form-control"
                  placeholder={t.shop.searchPlaceholder}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ width: '100%' }}
                />
              </div>
            </aside>

            <div>
              <div className="shop-toolbar">
                <div className="result-count">
                  {t.shop.showing} <strong>{filtered.length}</strong> {t.shop.of} {products.length} {t.shop.products}
                </div>
                <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}>
                  <option value="default">{t.shop.sortDefault}</option>
                  <option value="price-asc">{t.shop.sortPriceAsc}</option>
                  <option value="price-desc">{t.shop.sortPriceDesc}</option>
                  <option value="rating">{t.shop.sortRating}</option>
                </select>
              </div>

              <ProductGrid products={paginated} />

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-ghost"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    {t.shop.prev}
                  </button>
                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`page-num ${p === page ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn btn-ghost"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {t.shop.next}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
