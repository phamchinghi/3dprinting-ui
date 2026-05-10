# CLAUDE.md – TiNi 3D Store Frontend Guidelines

> Living document — updated after each implementation sprint. Legend: ✅ Done · ⚠️ Partial · ❌ Pending

---

# 🗂️ MONOREPO STRUCTURE

```
3dprinting_website/
 ├── 3dprinting_ui/    ← Customer-facing website  (port 5173)
 ├── 3dprinting_admin/ ← Admin dashboard          (port 5174)
 └── database/         ← PostgreSQL DDL + DML seed scripts
      ├── 01_ddl.sql   ← Schema: 10 tables, ENUMs, indexes, triggers
      └── 02_dml.sql   ← Seed data: all tables (child tables ≤20 rows)
```

Both projects share the same brand palette and read/write the same localStorage keys (`tini-orders`, `tini-3d-cart`). They are independent Vite projects — run each with `npm run dev` in their own directory.

---

# 🎯 PROJECT CONTEXT — 3dprinting_ui

| Field | Value |
|---|---|
| Brand | **TiNi 3D Store** |
| Type | Personal brand e-commerce website |
| Domain | 3D printing — products, filaments & custom print services |
| Stack | **Vite 5 + React 18 + TypeScript (strict)** |
| Routing | react-router-dom v6 |
| Styling | Single global CSS (`src/index.css`) with CSS custom properties |
| Primary color | `#34526F` (navy slate) |
| Palette | `#34526F` · `#7EAED0` · `#A0D4FF` · `#F6F7EC` (Color Hunt calm-winter) |
| i18n | Vietnamese + English (LanguageContext + `src/i18n/vi.ts` / `en.ts`) |
| Theme | Light / Dark (ThemeContext + CSS `[data-theme="dark"]` block) |
| Auth | Mock auth — Google · Facebook · Phone OTP · Email/Password (AuthContext) |

**Pages live:**
`/` Home · `/shop` Shop · `/shop/:slug` Product Detail · `/cart` Cart ·
`/checkout` Checkout · `/orders` Order History · `/profile` User Profile (P1-3) ·
`/blog` Blog · `/blog/:slug` Blog Detail ·
`/about` About · `/contact` Contact · `/auth` Login/Register · `*` 404

---

# 1. THINK BEFORE CODING ✅

**Rule:** Identify reusable UI patterns *before* writing any component.

**Applied:** Before implementation a component-responsibility matrix was drafted:

| Pattern | Used in | Component |
|---|---|---|
| Product card | Home, Shop, ProductDetail (related) | `ProductCard.tsx` |
| Product grid | Home (×2), Shop, ProductDetail | `ProductGrid.tsx` |
| Hero banner | Home | `HeroBanner.tsx` |
| Cart row | Cart | `CartItem.tsx` |
| Breadcrumb | All inner pages | `Breadcrumb.tsx` |
| Layout shell | All pages | `Layout.tsx` (Outlet) |

---

# 2. SIMPLICITY FIRST ✅

- ✅ All React **functional components + hooks** — zero class components
- ✅ State management: **React Context only** (Cart, Language, Theme) — no Redux/Zustand
- ✅ Components stay ≤ 170 lines; split if exceeded
- ✅ No unnecessary prop drilling — contexts consumed where needed

---

# 3. SURGICAL MIGRATION ✅ (adapted)

> Original rule: keep HTML template CSS. **Adapted by user decision:** full rebrand to TiNi 3D Store with Color Hunt palette. Template preserved in `template-reference/` for reference.

**Component mapping — status:**

| HTML Section | React Component | Status |
|---|---|---|
| Header | `components/layout/Header.tsx` | ✅ |
| Footer | `components/layout/Footer.tsx` | ✅ |
| Product Item | `components/product/ProductCard.tsx` | ✅ |
| Hero Banner | `components/product/HeroBanner.tsx` | ✅ |
| Cart Item | `components/product/CartItem.tsx` | ✅ |
| Logo | `components/common/Logo.tsx` | ✅ |
| Breadcrumb | `components/common/Breadcrumb.tsx` | ✅ |
| Button | `components/common/Button.tsx` | ✅ |

---

# 4. GOAL-DRIVEN DEVELOPMENT ✅

Each feature verified against success criteria:

### Add to Cart ✅
1. `CartContext` created → state updates correctly ✅
2. `+ Add to Cart` button in `ProductCard` → click adds item ✅
3. Cart page shows items, update qty, remove ✅
4. Persisted to `localStorage` ✅

### Language Switch ✅
1. `LanguageContext` + `src/i18n/vi.ts` + `src/i18n/en.ts` ✅
2. Toggle button in Header (VI | EN) ✅
3. All pages/components consume `useLang()` ✅
4. Persisted to `localStorage` ✅

### Login / Register ✅
1. `AuthContext` — user state, mock login, logout, persist `localStorage` ✅
2. `/auth` page — tab Đăng nhập / Đăng ký ✅
3. **Google** — mock OAuth (1.4s delay, ui-avatars avatar) ✅
4. **Facebook** — mock OAuth (1.4s delay, ui-avatars avatar) ✅
5. **Phone + OTP** — số VN (+84), 6-digit auto-advance input, demo code `123456` ✅
6. **Email / Password** — form + confirm password khi register ✅
7. `UserMenu` — avatar dropdown (tên, email/phone, Đơn hàng, Tài khoản, Đăng xuất) ✅
8. Header: nút **Đăng nhập** khi chưa login → `UserMenu` khi đã login ✅
9. i18n đầy đủ vi/en cho toàn bộ auth flow ✅
10. `AuthPage` nằm ngoài Layout (không có Header/Footer) ✅

### Dark / Light Theme ✅
1. `ThemeContext` with OS preference detection ✅
2. CSS `[data-theme="dark"]` block in `index.css` ✅
3. Toggle button in Header (🌙 / ☀️) ✅
4. Anti-flash inline script in `index.html` ✅
5. Smooth CSS transitions on bg/border/color ✅

### Order History ✅
1. `Order` type in `src/types/index.ts` — id, createdAt, items, customer, paymentMethod, status ✅
2. `src/utils/orders.ts` — `saveOrder()` + `getOrders()` via `localStorage` key `tini-orders` ✅
3. Checkout captures form data via `FormData`, saves order before clearing cart ✅
4. After successful checkout → redirects to `/orders` instead of home ✅
5. `/orders` page — protected (redirects to `/auth` if not logged in) ✅
6. Order list: status badge (Pending/Confirmed/Shipped/Delivered), item preview, payment method, shipping address, total ✅
7. i18n đầy đủ vi/en cho `orders` section ✅
8. Dark mode support for all order card styles ✅

### Responsive Fixes ✅
1. Mobile hamburger menu in Header — `☰ / ✕` toggle with slide-down nav drawer ✅
2. Close nav on route change + outside click ✅
3. `header-actions` gap tightened on mobile (`.5rem`) ✅
4. Cart badge simplified (icon only, count badge) on mobile ✅
5. OTP boxes shrink to `40×48px` on `≤680px`, `36×44px` on `≤400px` ✅
6. Auth card padding reduced on mobile (`1.75rem 1.25rem`) ✅
7. Section padding reduced on mobile ✅

### Shop ProductCard Fix ✅
1. `.shop-layout .products-grid` → **3 cột** (trước: 4 cột) — card rộng ~320px thay vì ~232px ✅
2. `.card-actions .btn` — `min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis` — nút không tràn card ✅
3. Padding nút giảm nhẹ `.6rem .8rem` (trước `.65rem .9rem`), font `0.88rem` (trước `0.9rem`) ✅
4. `.card-actions` thêm `flex-wrap: wrap` — fallback nếu màn hình quá hẹp ✅
5. `@media ≤680px` thêm `.shop-layout .products-grid { 2 cột }` override specificity ✅

### Video Demo Autoplay ✅
1. `Product` interface thêm `videoUrl?: string` ✅
2. Mock data: 4 sản phẩm có `videoUrl` (p001 Rồng · p003 Chậu cây · p004 Filament PLA · p006 Waifu) ✅
3. `ProductCard` — hover vào `.media` → `video.play()`; rời → `video.pause()` + reset `currentTime` ✅
4. `ProductCard` — crossfade CSS: `.media:hover .media-emoji { opacity:0 }` ↔ `.media:hover .media-video { opacity:1 }` ✅
5. `ProductCard` — badge `▶ Video` góc trên phải (backdrop-filter blur) khi sản phẩm có video ✅
6. `ProductDetail` — tab state `'main' | 'video'`; mặc định `'video'` nếu sản phẩm có `videoUrl` ✅
7. `ProductDetail` — `<video autoPlay muted loop playsInline controls>` trong `.detail-image` khi tab = video ✅
8. `ProductDetail` — `useEffect([slug])` reset tab khi navigate sang sản phẩm khác ✅
9. `ProductDetail` — `useEffect([activeMedia])` gọi `.play()` / `.pause()` khi chuyển tab ✅
10. `ProductDetail` — thumb `▶` (`.detail-thumb-video`) click để chuyển giữa ảnh và video ✅
11. i18n: thêm `detail.watchVideo` + `detail.videoTab` vào `vi.ts` và `en.ts` ✅
12. CSS: `.media-emoji` transition opacity · `.media-video` absolute + crossfade · `.badge-video` · `.detail-video` fill container · `.detail-thumb-video` dark bg · `overflow: hidden` trên `.detail-image` ✅

---

# 5. PROJECT STRUCTURE ✅ (Centralized · Flat)

```
src/
 ├── App.tsx                    Route table (12 routes — /auth outside Layout)
 ├── main.tsx                   Provider tree: Theme > Language > Auth > Cart > App
 │
 ├── api/                       ── All API calls centralized ─────────────────────────
 │    ├── client.ts             HTTP engine · token mgmt · authApi · api (protected)
 │    └── user.ts               userApi: GET/PUT /api/users/me · PUT /password
 │
 ├── components/                ── All reusable UI (flat — no subfolders) ────────────
 │    ├── Breadcrumb.tsx
 │    ├── Button.tsx
 │    ├── CartItem.tsx
 │    ├── Footer.tsx
 │    ├── Header.tsx
 │    ├── HeroBanner.tsx
 │    ├── Layout.tsx
 │    ├── Logo.tsx
 │    ├── PhoneOtpForm.tsx
 │    ├── ProductCard.tsx
 │    ├── ProductGrid.tsx
 │    ├── SocialButton.tsx
 │    └── UserMenu.tsx
 │
 ├── contexts/                  ── All React contexts ────────────────────────────────
 │    ├── AuthContext.tsx        login/register/logout · real API + mock social/phone
 │    ├── CartContext.tsx        cart state · localStorage persistence
 │    └── ThemeContext.tsx       light/dark · OS preference · localStorage
 │
 ├── data/                      ── Mock data & local storage helpers ─────────────────
 │    ├── orders.ts             getOrders / saveOrder (localStorage; → API in P1-6)
 │    └── products.ts           8 mock products · 6 blog posts
 │
 ├── pages/                     ── All page components (flat) ────────────────────────
 │    ├── About.tsx
 │    ├── AuthPage.tsx
 │    ├── Blog.tsx
 │    ├── BlogDetail.tsx
 │    ├── Cart.tsx
 │    ├── Checkout.tsx
 │    ├── Contact.tsx
 │    ├── Home.tsx
 │    ├── NotFound.tsx
 │    ├── OrdersPage.tsx
 │    ├── ProductDetail.tsx
 │    ├── Profile.tsx           ← P1-3 self-service: getMe + updateMe + changePassword
 │    └── Shop.tsx
 │
 ├── types/
 │    └── index.ts              Product · Order · BlogPost · CartItem · User · AuthProviderType
 │
 ├── utils/
 │    └── format.ts             formatPrice (VND) · formatDate (vi-VN)
 │
 ├── i18n/                      ── Translation context + tables ──────────────────────
 │    ├── LanguageContext.tsx
 │    ├── vi.ts · en.ts
 │
 └── styles/
      └── index.css             CSS variables · dark mode · all global styles
```

**Path alias:** `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts`).
All imports use `@/...` absolute paths — zero `../../` relative imports.

**Rules:**
- New page → `pages/PageName.tsx` (flat, no subdirectory).
- New reusable component → `components/ComponentName.tsx` (only if used in 2+ places).
- New API domain → `api/domainName.ts` (import `api` from `./client`).
- New context → `contexts/ContextName.tsx`.
- Mock data / localStorage helpers → `data/`.
- Pure formatters / pure functions → `utils/`.

---

# 6. E-COMMERCE FEATURES

## 🛒 Core Pages

| Page | Features | Status |
|---|---|---|
| Home | Hero banner · 4 categories · Featured products · New arrivals · CTA banner | ✅ |
| Shop | Product listing · Filter (category + price range) · Search · Sort · Pagination (6/page) | ✅ |
| Product Detail | Emoji gallery · Price (w/ old price) · Qty selector · Add to cart / Buy now · Related products | ✅ |
| Cart | Item list · Update qty · Remove · Clear cart · Order summary · Shipping calc | ✅ |
| Checkout | Customer info form · Payment method selector · Order summary · Save order · Redirect to /orders | ✅ |
| Orders | Order history list · Status badge · Item preview · Protected route | ✅ |
| Blog | Grid layout · Category + date meta | ✅ |
| Blog Detail | Full post · Related articles | ✅ |
| About | Brand story · Core values | ✅ |
| Contact | Info panel · Contact form · Success state | ✅ |

## 🚀 Recommended (future)

| Feature | Priority | Status |
|---|---|---|
| Login / Register | High | ✅ **Real API** — email/password wired to `POST /api/auth/login` + `/register` |
| Social Login (Google/Facebook) | Medium | ⚠️ Still mock — P2-1 OAuth2 pending |
| Phone OTP Login | Medium | ⚠️ Still mock — P2-2 OTP pending |
| Persistent session | High | ✅ Refresh token in localStorage, silent restore on mount |
| Order History | Medium | ✅ localStorage (migrates to API in P1-6) |
| Admin panel | Low / Optional | ✅ Separate project `3dprinting_admin/` (port 5174) |
| Real product images (replace emoji) | High | ❌ Needs asset upload |
| Backend / API integration | High | ⚠️ Auth done; Product/Order/Blog still mock data |

---

# 7. REUSABILITY RULES ✅

**Implemented reusable components:**

| Component | Props | Used in |
|---|---|---|
| `<Button variant="primary\|outline\|ghost" block? size?>` | variant, block, size | All pages |
| `<ProductCard product={…}>` | Product object | Home, Shop, Detail |
| `<ProductGrid products={…}>` | Product[] | Home (×2), Shop, Detail |
| `<CartItem item onUpdateQuantity onRemove>` | CartItem, callbacks | Cart |
| `<HeroBanner title desc ctas stats visual>` | flexible props | Home |
| `<Breadcrumb title crumbs>` | title, crumbs[] | All inner pages |
| `<Logo size="sm\|md\|lg">` | size | Header, Footer |

**Pending reusable components:**

| Component | Status |
|---|---|
| `<Input label ...>` (form wrapper) | ❌ Using native `<input>` in forms |
| `<Modal>` | ❌ Not needed yet |

---

# 8. STYLING STRATEGY

## Phase 1 ✅ (current)
- Single global CSS file `src/index.css`
- CSS custom properties (variables) for entire design token system
- **Color Hunt palette** — `#34526F` · `#7EAED0` · `#A0D4FF` · `#F6F7EC`
- Dark mode via `[data-theme="dark"]` attribute overrides
- Google Fonts: **Inter** (body) + **Poppins** (headings/display)
- Fully responsive (breakpoints 992px / 680px)
- Smooth theme transitions via CSS `transition` on all elements

## Phase 2 (future / optional)
- Convert to **CSS Modules** per component (when file count warrants it)
- Or adopt **Tailwind CSS** — decision pending

---

# 9. PERFORMANCE

| Item | Status | Notes |
|---|---|---|
| Lazy load pages (`React.lazy`) | ❌ | All routes eagerly loaded — add when bundle > 500KB |
| `useMemo` in CartContext | ✅ | Prevents unnecessary re-renders |
| `localStorage` persistence | ✅ | Cart, language, theme, user, orders all persisted |
| Anti-flash theme script | ✅ | Inline script in `index.html` before React mounts |
| Image optimization | ⚠️ | Emoji placeholders — real images need `loading="lazy"` |
| Code splitting | ❌ | Add `React.lazy` per route when real assets are added |

---

# 10. DEFINITION OF DONE ✅

A feature is **DONE** when:

- [x] UI renders correctly in both **light** and **dark** mode
- [x] All user-visible text is translated in both **VI** and **EN**
- [x] Code is modular — no page-level duplication
- [x] TypeScript compiles with **zero errors** (`npx tsc -b`)
- [x] Logic works correctly end-to-end
- [x] Easy to extend (new language = new file in `src/i18n/`)

---

# 🔧 DEV COMMANDS

```bash
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # Production build (tsc + vite build)
npm run preview  # Preview production build
npx tsc -b       # Type check only
```

---

# 📋 CHANGE LOG

| Date | Change | Sections |
|---|---|---|
| 2026-04-23 | Initial React migration: scaffold + all pages + CartContext + mock data | 1–6 |
| 2026-04-23 | Color palette → Color Hunt calm-winter (`#34526F`…`#F6F7EC`) | 8 |
| 2026-04-23 | Extracted `HeroBanner.tsx` + `CartItem.tsx` | 3, 7 |
| 2026-04-24 | **VI/EN language switching** — LanguageContext + full i18n coverage | 4, 7 |
| 2026-04-24 | **Light/Dark theme toggle** — ThemeContext + `[data-theme]` CSS | 4, 8, 9 |
| 2026-04-24 | **Pagination** added to Shop (6 products/page) | 6 |
| 2026-04-24 | **Login/Register** — Google · Facebook · Phone OTP · Email, UserMenu, AuthContext | 4, 5, 6 |
| 2026-04-25 | **Order History** — Order type, saveOrder/getOrders utils, OrdersPage, protected route | 4, 5, 6 |
| 2026-04-25 | **Responsive fixes** — mobile hamburger nav, OTP box sizing, auth card padding, section spacing | 8 |
| 2026-04-25 | **ProductCard resize +10%** — emoji 5→5.5rem, larger padding/fonts, rating row added, gap tightened | 3, 7 |
| 2026-04-26 | **Admin Dashboard** — `3dprinting_admin/` project (Vite+React+TS, port 5174): Login, Dashboard, Products CRUD, Orders management, Users, Blog | — |
| 2026-04-26 | **Admin Edit Pages** — nút Sửa chuyển trang riêng (không modal): `ProductEdit` (basic info + tech + live preview) · `BlogEdit` (all fields + preview) · `UserEdit` (banner + personal + account). DataContext chia sẻ state giữa các trang. | — |
| 2026-04-26 | **Shop product card fix** — `.shop-layout .products-grid` giảm 4→3 cột (card rộng ~320px); nút `card-actions` thêm `min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis` + giảm padding `.6rem .8rem` + `flex-wrap:wrap`; thêm override 680px cho shop grid 2 cột | 8 |
| 2026-04-26 | **Video Demo Autoplay** — `videoUrl?` field trên `Product`; 4 mock videos; `ProductCard` hover crossfade emoji↔video + badge `▶ Video`; `ProductDetail` tab state với default video, `<video autoPlay muted loop playsInline controls>`, thumb `▶` click-to-switch, reset on slug change | 4, 5, 6, 8 |
| 2026-04-26 | **Database Design** — PostgreSQL 15+ chosen; `database/` folder tạo cùng cấp; `01_ddl.sql` 10 bảng + 6 ENUM + 12 indexes + trigger `fn_set_updated_at` + COMMENT; `02_dml.sql` seed đủ mọi bảng, child tables ≤20 rows (product_tags:14, order_shipping:5, order_items:9) | — |
| 2026-04-27 | **Backend API Integration — Auth** — `apiClient.ts` tạo mới: fetch wrapper, token management (access token in memory / refresh token in localStorage), auto-refresh on 401, `authApi` (public), `api` (protected). `AuthContext` wired to `POST /api/auth/login` + `POST /api/auth/register` + `POST /api/auth/logout` + auto-restore on mount. Social/Phone còn mock (P2). `AuthPage` thêm try/catch hiển thị lỗi từ API. `User` type thêm `role?`. | `utils/apiClient.ts` (NEW) · `context/AuthContext.tsx` · `types/auth.ts` · `pages/Auth/AuthPage.tsx` |
| 2026-05-04 | **Project Structure Refactor — Feature-based** — Tái cấu trúc toàn bộ `src/` từ "categorized by file type" sang "categorized by feature" để cải thiện readability, maintainability, scalability. Tạo `features/{auth,cart,product,order,blog,home,about,contact}/` co-locating components + pages + state + storage. Tách `i18n/`, `theme/`, `lib/`, `styles/` ra khỏi `src/` root. Thêm `vite.config.ts` alias `@/*` → `src/*` (tsconfig đã có sẵn). Convert tất cả relative imports (`../../...`) → absolute imports (`@/...`). Thêm `index.ts` barrel exports cho mọi feature/folder để clean import (`import { Cart, Checkout } from '@/features/cart'`). Move 27 files, update 90 imports, 0 broken. `tsc --noEmit` xanh. | toàn bộ `src/` · `vite.config.ts` |
| 2026-05-05 | **Project Structure Refactor — Centralized/Flat** — Đổi từ feature-based sang flat/centralized để dễ quản lý. Xóa toàn bộ `features/`, `lib/`, `theme/`, `components/common/`, `components/layout/` subdirectories. Tạo `api/` (client.ts + user.ts mới), `contexts/` (Auth + Cart + Theme), `data/` (products + orders), `utils/` (format). Components và pages đều flat — không có subfolders. **API Mapping**: thêm `api/user.ts` expose `GET/PUT /api/users/me` và `PUT /api/users/me/password`. Auth types (`User`, `AuthProviderType`) merge vào `types/index.ts`. 0 tsc errors. | toàn bộ `src/` |
| 2026-05-10 | **API Wiring — P1-4 Category** — từng điểm khác trước: (1) `api/category.ts` (NEW) — interface `Category` mirror BE `CategoryResponse` (id, slug, nameVi/En, iconEmoji, descriptionVi/En, sortOrder, createdAt); `categoryApi.list()` + `getBySlug()` dùng `rawFetch` (BE public, không cần auth). (2) `pages/Home.tsx`: thay 4 hardcoded category cards (`t.home.categories` + 2 mảng song song `categoryIcons`/`categorySlugs`) bằng `useEffect` fetch `categoryApi.list()` → render `iconEmoji + nameVi/nameEn (theo lang) + descriptionVi/En` sort theo `sortOrder` từ BE. **Fallback**: nếu API rỗng/lỗi vẫn hiện 4 card cũ từ i18n để không vỡ UI khi BE chưa có category nào. (3) `tsconfig.node.json` sửa `noEmit: true` (không tương thích `composite: true`) thành `outDir: "node_modules/.cache/tsc-node"` — tsc emit ra cache folder thay vì root, không pollute repo. Shop filter và ProductDetail vẫn dùng product.category mock (chờ BE P1-5). 0 tsc errors. | `api/category.ts` (NEW) · `pages/Home.tsx` · `tsconfig.node.json` |
| 2026-05-10 | **API Wiring — P1-3 User self-service** — phát hiện gap: `api/user.ts` đã define từ trước (getMe/updateMe/changePassword) nhưng **không page nào dùng**; `UserMenu` link `/profile` nhưng không có route `/profile` → click ra 404. Sửa: (1) `api/user.ts` — `UserProfile` interface trước có field `role: string` SAI (BE `UserResponse` không trả role); cập nhật khớp BE chính xác: thêm `provider` (UPPERCASE enum), `status`, `orderCount`, `createdAt`, bỏ `role`. (2) `pages/Profile.tsx` (NEW) — protected route (`<Navigate to="/auth">` nếu chưa login); 2 tab: "Thông tin cá nhân" (load qua `userApi.getMe()`, edit name/phone/avatar partial-update qua `userApi.updateMe()` — chỉ POST các field thực sự đổi; email + provider + orderCount read-only) và "Đổi mật khẩu" (currentPassword + newPassword + confirm, validate min 6 ký tự + match confirm trước khi gọi `userApi.changePassword()`; note rõ tài khoản social/phone chưa có password — không đổi được). (3) `App.tsx` thêm route `/profile` (12 → **13 routes**). 0 tsc errors. | `api/user.ts` (FIXED interface) · `pages/Profile.tsx` (NEW) · `App.tsx` |

---

# 🗄️ DATABASE DESIGN ✅

## Database Choice: PostgreSQL 15+

| Candidate | Decision | Reason |
|---|---|---|
| **PostgreSQL** | ✅ **Chosen** | UUID native, JSONB, ENUMs, partial indexes, strong ACID, array types, full-text search, best for relational e-commerce |
| MySQL / MariaDB | ❌ | Weaker UUID support, no native CHECK constraints before 8.0, partial JSONB |
| SQLite | ❌ | Not suitable for concurrent multi-user production workloads |
| MongoDB | ❌ | Data is inherently relational (orders → items, products → tags); ACID compliance required |
| Redis | ❌ | Cache layer only, not a primary data store |

## Schema Overview — 10 Tables

| Table | Type | Rows (seed) | Description |
|---|---|---|---|
| `admin_users` | Parent | 2 | Admin dashboard accounts (superadmin · admin) |
| `users` | Parent | 5 | Customer accounts — Google · Facebook · Phone · Email |
| `categories` | Parent | 4 | Product categories (bilingual vi/en) |
| `products` | Parent | 8 | Full product catalog — price in VND (BIGINT) |
| `product_tags` | **Child** | **14** | Many tags per product (≤20 ✓) |
| `blog_categories` | Parent | 5 | Blog post categories |
| `blog_posts` | Parent | 6 | Articles authored by admin users |
| `orders` | Parent | 5 | Purchase orders — polymorphic audit columns |
| `order_shipping` | **Child** | **5** | 1-to-1 shipping address snapshot per order (≤20 ✓) |
| `order_items` | **Child** | **9** | Line items snapshot per order (≤20 ✓) |

## Audit Columns (on every table)

```sql
created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()      -- auto-set on INSERT
updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()      -- auto-updated by trigger
created_by  UUID                                     -- FK → admin_users or users
updated_by  UUID                                     -- FK → admin_users or users
```

`orders`, `order_shipping`, `order_items` use **polymorphic audit** (no FK) — `created_by` may be `users.id` (customer) or `admin_users.id` (admin).

## Key Design Decisions

- **UUID PK everywhere** — `gen_random_uuid()` (pgcrypto extension)
- **BIGINT for prices** — VND has no decimal part; avoids float rounding errors
- **ENUM types** — `user_provider`, `account_status`, `order_status`, `payment_method`, `product_badge`
- **Snapshot pattern** — `order_items` stores `product_name` + `unit_price` at time of order; historical accuracy preserved if product is later edited
- **Partial indexes** — `products(is_active) WHERE is_active = TRUE`; `blog_posts(published_at) WHERE is_published = TRUE`
- **`fn_set_updated_at()` trigger** — one trigger function shared by all 10 tables
- **Soft FK on order audit** — polymorphic UUID columns with comment documentation

## Files

```
database/
 ├── 01_ddl.sql  ← CREATE TYPE · CREATE TABLE · CREATE INDEX · TRIGGER · COMMENT
 └── 02_dml.sql  ← INSERT wrapped in BEGIN/COMMIT; fixed UUIDs for FK consistency
```

---

# 🚀 FINAL PRINCIPLE

> Build like a scalable product, not just convert a template.

Avoid: copy-paste coding · over-engineering · silent type errors
Focus: clean structure · reusability · both languages · both themes