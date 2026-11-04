import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, meta, actions, aside }: PageHeaderProps) {
  return (
    <section className="site-container border-b border-[#9a6d33]/15 pb-10 pt-4">
      <div className={aside ? 'grid grid-cols-1 items-start gap-10 xl:grid-cols-[1.15fr_0.85fr]' : undefined}>
        <div>
          {eyebrow ? (
            <p className="font-body text-[18px] uppercase tracking-[0.18em] text-bang-brown/60">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 font-title text-[72px] leading-none text-bang-red">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-[760px] text-[22px] leading-[1.5] text-bang-brown">{description}</p>
          ) : null}
          {meta ? <div className="mt-6 flex flex-wrap gap-3">{meta}</div> : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center gap-5">{actions}</div> : null}
        </div>

        {aside ? <div className="justify-self-center xl:justify-self-end">{aside}</div> : null}
      </div>
    </section>
  );
}
