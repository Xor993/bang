import type { ReactNode } from 'react';
import type { TooltipContent } from './types';
import { useLongHover } from './useLongHover';
import { useTooltipStore } from './useTooltipStore';

type Props = {
  content: TooltipContent;
  children: ReactNode;
  className?: string;
};

export function HoverHint({ content, children, className = '' }: Props) {
  const show = useTooltipStore((state) => state.show);
  const hide = useTooltipStore((state) => state.hide);
  const hover = useLongHover(() => show(content), hide);

  return (
    <div className={className} {...hover}>
      {children}
    </div>
  );
}
