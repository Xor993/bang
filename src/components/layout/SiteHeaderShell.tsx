import { Header } from './Header';

type SiteHeaderShellProps = {
  overlay?: boolean;
};

export function SiteHeaderShell({ overlay = false }: SiteHeaderShellProps) {
  return (
    <div
      className={`z-30 ${
        overlay
          ? 'absolute inset-x-0 top-0'
          : 'relative border-b border-[#9a6d33]/15 bg-bang-bg/95 backdrop-blur-sm'
      }`}
    >
      <div className="site-container py-10">
        <Header />
      </div>
    </div>
  );
}
