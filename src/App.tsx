import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { ProductDetail } from '@/pages/ProductDetail';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { OrdersPage } from '@/pages/OrdersPage';
import { Profile } from '@/pages/Profile';
import { Blog } from '@/pages/Blog';
import { BlogDetail } from '@/pages/BlogDetail';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { AuthPage } from '@/pages/AuthPage';
import { NotFound } from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Auth page — outside main layout (no header/footer) */}
      <Route path="/auth" element={<AuthPage />} />

      {/* All other pages inside layout */}
      <Route element={<Layout />}>
        <Route path="/"           element={<Home />} />
        <Route path="/shop"       element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/cart"       element={<Cart />} />
        <Route path="/checkout"   element={<Checkout />} />
        <Route path="/orders"     element={<OrdersPage />} />
        <Route path="/profile"    element={<Profile />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/about"      element={<About />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="*"           element={<NotFound />} />
      </Route>
    </Routes>
  );
}
