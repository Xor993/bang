import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', label: 'Главная' },
  { to: '/history', label: 'История игр' },
  { to: '/rules', label: 'Правила игры' },
] as const;

function HeaderNav() {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, height: 0, top: 0 });
  const [useSpring, setUseSpring] = useState(false);
  const prevPathRef = useRef<string | null>(null);

  const activeIndex = NAV_ITEMS.findIndex((item) => item.to === location.pathname);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Вне пунктов меню индикатор скрыт — ширина обнуляется при рендере
    if (activeIndex < 0) {
      prevPathRef.current = location.pathname;
      return;
    }

    const link = linkRefs.current[activeIndex];
    if (!link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    setUseSpring(prevPathRef.current !== null && prevPathRef.current !== location.pathname);
    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      height: navRect.height,
      top: 0,
    });
    prevPathRef.current = location.pathname;
  }, [location.pathname, activeIndex]);

  return (
    <nav
      ref={navRef}
      className="relative inline-flex items-center rounded-full bg-bang-plate py-0 shadow-[0_4px_14px_rgba(74,44,26,0.18)]"
    >
      <motion.div
        className="pointer-events-none absolute rounded-full bg-[#63472D]"
        animate={{
          left: indicator.left,
          width: activeIndex < 0 ? 0 : indicator.width,
          height: indicator.height,
          top: indicator.top,
        }}
        initial={false}
        transition={
          useSpring
            ? { type: 'spring', stiffness: 420, damping: 34 }
            : { duration: 0 }
        }
      />

      {NAV_ITEMS.map((item, index) => {
        const isActive = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            ref={(node) => {
              linkRefs.current[index] = node;
            }}
            to={item.to}
            className={`relative z-10 px-[100px] py-[15px] font-title text-[28px] leading-none whitespace-nowrap transition-colors duration-200 ${
              isActive ? 'text-bang-plate' : 'text-bang-brown hover:text-bang-red'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  return (
    <header className="relative z-30 flex items-start justify-between">
      <Link to="/" className="shrink-0 text-bang-red">
        <img src="/images/icon/logo.svg" alt="БЭНГ" className="w-24" />
      </Link>

      <HeaderNav />

      <Link
        to="/profile"
        className="flex h-[57px] w-[57px] shrink-0 items-center justify-center rounded-full bg-bang-plate shadow-md transition-all hover:bg-[#D4B685] active:scale-95"
        aria-label="Профиль"
      >
        <img src="/images/icon/profile.svg" alt="" className="h-[29px] w-[29px]" />
      </Link>
    </header>
  );
}
