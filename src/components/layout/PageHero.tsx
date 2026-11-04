import type { ReactNode } from 'react';

type PageHeroProps = {
  children: ReactNode;
  centered?: boolean;
  className?: string;
};

export function PageHero({ children, centered = false, className = '' }: PageHeroProps) {
  return (
    <section
      className={`relative w-full bg-cover bg-center bg-no-repeat px-6 pb-20 pt-[180px] ${className}`}
      style={{ backgroundImage: "url('/images/hero-bg.png')" }}
    >
      {centered ? (
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center">{children}</div>
      ) : (
        <div className="site-container">{children}</div>
      )}
    </section>
  );
}
