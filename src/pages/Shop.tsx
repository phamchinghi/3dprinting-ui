import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGrid } from '@/components/ProductGrid';
import { useLang } from '@/i18n/LanguageContext';
import { categoryApi, type Category } from '@/api/category';
import { productApi, toProduct, type ApiProduct, type ProductSort } from '@/api/product';
import type { Product } from '@/types';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating';

const PAGE_SIZE = 6;

const sortKeyToBe = (s: SortKey): ProductSort | undefined => {
  switch (s) {
    case 'price-asc':  return 'price_asc';
    case 'price-desc': return 'price_desc';
    case 'rating':     return 'rating_desc';
    default:           return undefined;
  }
};

const priceRangesData = [
  { id: 'all', min: 0,        max: undefined as number | undefined },
  { id: 'r1',  min: 0,        max: 100000 },
  { id: 'r2',  min: 100000,   max: 300000 },
  { id: 'r3',  min: 300000,   max: 600000 },
  { id: 'r4',  min: 600000,   max: undefined },
];

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, lang } = useLang();

  const initialCat = searchParams.get('category') ?? 'all';
  const [category, setCategory] = useState<string>(initialCat);
  const [priceRangeId, setPriceRangeId] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load category list once for filter sidebar
  useEffect(() => {
    let cancelled = false;
    categoryApi.list()
      .then((list) => { if (!cancelled) setCategories(list); })
      .catch(() => { if (!cancelled) setCategories([]); });
    return () => { cancelled = true; };
  }, []);

  // Sync ?category= → state on URL change
  useEffect(() => {
    setCategory(searchParams.get('category') ?? 'all');
    setPage(1);
  }, [searchParams]);

  // Debounce search input → reset page
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const id = setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1); }, 300);
    return () => clearTimeout(id);
  }, [search]);

  // Fetch products whenever filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);

    const range = priceRangesData.find((r) => r.id === priceRangeId)!;

    const fetcher = debouncedSearch
      ? productApi.search(debouncedSearch, page, PAGE_SIZE)
      : productApi.list({
          page,
          size: PAGE_SIZE,
          category: category === 'all' ? undefined : category,
          minPrice: range.min > 0 ? range.min : undefined,
          maxPrice: range.max,
          sort: sortKeyToBe(sort),
        });

    fetcher
      .then((res) => {
        if (cancelled) return;
        setItems(res.items.map((p: ApiProduct) => toProduct(p, lang)));
        setTotalElements(res.totalElements);
        setTotalPages(Math.max(1, res.totalPages));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? 'Không tải được danh sách sản phẩm');
        setItems([]); setTotalElements(0); setTotalPages(1);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [category, priceRangeId, sort, debouncedSearch, page, lang]);

  const handleCategory = (val: string) => {
    setCategory(val);
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (val === 'all') next.delete('category');
    else next.set('category', val);
    setSearchParams(next, { replace: true });
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
                <label>
                  <input
                    type="radio" name="category"
                    checked={category === 'all'}
                    onChange={() => handleCategory('all')}
                  />
                  {t.shop.allCategories}
                </label>
                {categories.map((c) => (
                  <label key={c.id}>
                    <input
                      type="radio" name="category"
                      checked={category === c.slug}
                      onChange={() => handleCategory(c.slug)}
                    />
                    {c.iconEmoji ?? ''} {lang === 'vi' ? c.nameVi : c.nameEn}
                  </label>
                ))}
              </div>
              <div className="filter-group">
                <h5>{t.shop.priceRange}</h5>
                {priceRangesData.map((r, i) => (
                  <label key={r.id}>
                    <input
                      type="radio" name="price"
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
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </aside>

            <div>
              <div className="shop-toolbar">
                <div className="result-count">
                  {t.shop.showing} <strong>{items.length}</strong> {t.shop.of} {totalElements} {t.shop.products}
                </div>
                <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}>
                  <option value="default">{t.shop.sortDefault}</option>
                  <option value="price-asc">{t.shop.sortPriceAsc}</option>
                  <option value="price-desc">{t.shop.sortPriceDesc}</option>
                  <option value="rating">{t.shop.sortRating}</option>
                </select>
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}
              {loading
                ? <div className="empty-state"><div className="icon">⏳</div><h3>...</h3></div>
                : <ProductGrid products={items} />}

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    {t.shop.prev}
                  </button>
                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} className={`page-num ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <button className="btn btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
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
