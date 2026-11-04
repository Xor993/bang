import { Outlet } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';

export function MarketingLayout() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}
