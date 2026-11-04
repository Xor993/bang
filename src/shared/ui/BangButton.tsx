import { Link } from 'react-router-dom';

type BangButtonProps = {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'link';
};

const primaryClassName =
  'inline-block bg-bang-plate text-bang-brown font-title text-[40px] px-16 py-4 rounded-full shadow-lg transition active:scale-95 hover:text-bang-red hover:scale-105';

const linkClassName =
  'inline-block font-body transition-colors hover:text-bang-red';

export function BangButton({
  children,
  to,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
}: BangButtonProps) {
  const baseClassName = variant === 'link' ? linkClassName : primaryClassName;
  const combinedClassName = `${baseClassName} ${
    disabled ? 'pointer-events-none cursor-not-allowed opacity-45' : ''
  } ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}
