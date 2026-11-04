import type { ReactNode } from 'react';

type PanelProps = {
  children: ReactNode;
  className?: string;
};

type DockButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

/** Кнопка для правого дока — компактная, без обрезки по контейнеру. */
export function DockButton({ children, onClick, className = '', disabled = false }: DockButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`shrink-0 rounded-full bg-bang-plate px-8 py-2.5 font-title text-xl leading-tight whitespace-nowrap text-bang-brown shadow-lg transition ${
        disabled
          ? 'pointer-events-none cursor-not-allowed opacity-45'
          : 'hover:scale-105 hover:text-bang-red active:scale-95'
      } ${className}`}
    >
      {children}
    </button>
  );
}

/** Фиксированная колонка действий справа внизу. */
export function ActionDock({ children }: { children: ReactNode }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5">
      {items}
    </div>
  );
}

export function ActionDockPanel({ children, className = '' }: PanelProps) {
  return (
    <div
      className={`pointer-events-auto shrink-0 rounded-2xl border border-white/25 bg-black/75 px-4 py-3 text-right shadow-2xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function ActionDockButtons({ children, className = '' }: PanelProps) {
  return (
    <div className={`pointer-events-auto flex shrink-0 flex-col items-end gap-2 ${className}`}>
      {children}
    </div>
  );
}
