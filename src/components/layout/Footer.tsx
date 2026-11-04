import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type FooterLinkProps = {
  to: string;
  children: ReactNode;
};

function FooterLink({ to, children }: FooterLinkProps) {
  return (
    <Link to={to} className="font-body text-lg text-bang-plate/90 transition-colors hover:text-white">
      {children}
    </Link>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 font-body text-xl font-bold text-bang-plate">{title}</h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function ContactItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 font-body text-lg text-bang-plate/90">
      <span className="mt-0.5 shrink-0 text-bang-plate">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6.5 3h3l1.5 5-2 1.5c1 2.5 2.8 4.3 5.3 5.3L17.5 13 22.5 14.5V18c0 .6-.4 1-1 1C10.7 19 5 13.3 5 4c0-.6.4-1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 8v4.5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function Footer() {
  return (
    <footer className="mt-16 rounded-t-[36px] bg-bang-dark-red text-bang-plate">
      <div className="mx-auto max-w-[1440px] px-[80px] pt-14 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4 xl:gap-16">
          <div className="max-w-xs">
            <Link to="/" className="inline-flex flex-col items-start text-bang-plate">
              <span
                aria-hidden
                className="block h-12 w-24 bg-current [mask-image:url('/images/icon/logo.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:left_center]"
              />
              <span className="sr-only">БЭНГ</span>
            </Link>
            <p className="mt-5 font-body text-lg leading-relaxed text-bang-plate/85">
              Место, где можно стать настоящим ковбоем и не только.
            </p>
          </div>

          <FooterColumn title="О игре">
            <li>
              <FooterLink to="/game">Играть</FooterLink>
            </li>
            <li>
              <FooterLink to="/rules">Правила</FooterLink>
            </li>
            <li>
              <FooterLink to="/achievements">Достижения</FooterLink>
            </li>
            <li>
              <FooterLink to="/records">Рекорды</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn title="О компании">
            <li>
              <FooterLink to="/about">О нас</FooterLink>
            </li>
            <li>
              <FooterLink to="/news">Новости</FooterLink>
            </li>
            <li>
              <FooterLink to="/blog">Блог</FooterLink>
            </li>
            <li>
              <FooterLink to="/jobs">Вакансии</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn title="Контакты">
            <ContactItem icon={<PhoneIcon />}>8 800 555-35-35</ContactItem>
            <ContactItem icon={<MailIcon />}>info@bang_cowboy.ru</ContactItem>
            <ContactItem icon={<PinIcon />}>Ярославль, ул. Пушкина, 52</ContactItem>
            <ContactItem icon={<ClockIcon />}>Пн—Вс: 10:00—22:00</ContactItem>
          </FooterColumn>
        </div>

        <div className="my-10 h-px bg-[#F5E6D3]/25" />

        <div className="flex flex-col items-center justify-between gap-4 font-body text-base text-[#F5E6D3]/80 md:flex-row">
          <p>© 2026 БЭНГ. Все права защищены.</p>
          <Link to="/privacy" className="transition-colors hover:text-[#F5E6D3]">
            Политика конфиденциальности
          </Link>
          <Link to="/terms" className="transition-colors hover:text-[#F5E6D3]">
            Условия использования
          </Link>
        </div>
      </div>
    </footer>
  );
}
