import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { SiteHeaderShell } from './SiteHeaderShell';

type SiteLayoutProps = {
  children: ReactNode;
  showFooter?: boolean;
};

export function SiteLayout({ children, showFooter = true }: SiteLayoutProps) {
  const isHome = useLocation().pathname === '/';

  return (
    <div className="min-h-screen bg-bang-bg font-body text-bang-brown">
      <SiteHeaderShell overlay={isHome} />
      {children}
      {showFooter ? <Footer /> : null}
    </div>
  );
}
