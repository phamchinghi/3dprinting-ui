import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [pathname]);
  return null;
};

export const Layout = () => (
  <>
    <ScrollToTop />
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export { ScrollRestoration };
