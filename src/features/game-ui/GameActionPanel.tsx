import type { ReactNode } from 'react';
import type { Card, Player } from '../../shared/types/game';
import { Card as GameCard } from '../../entities/card/Card';
import { ActionDockButtons, ActionDockPanel, DockButton } from './ActionDock';

const DOCK_CARD_CLASS = '!h-32 !w-20 hover:-translate-y-2';

type PlayerPanelHeaderProps = {
  visiblePlayer: Player;
  description?: ReactNode;
};

type CardChoicePanelProps = {
  visiblePlayer?: Player;
  title?: ReactNode;
  description?: ReactNode;
  cards: Card[];
  onSelect: (cardId: string) => void;
  wrap?: boolean;
  className?: string;
};

type AcceptActionPanelProps = {
  onAccept: () => void;
  label?: ReactNode;
};

export function PlayerPanelHeader({ visiblePlayer, description }: PlayerPanelHeaderProps) {
  return (
    <>
      <p className="font-body text-sm uppercase tracking-[0.2em] text-white/70">
        {visiblePlayer.name}, {visiblePlayer.character}
      </p>
      {description && <p className="mt-1 font-body text-xs text-white/60">{description}</p>}
    </>
  );
}

export function CardChoicePanel({
  visiblePlayer,
  title,
  description,
  cards,
  onSelect,
  wrap = false,
  className = '',
}: CardChoicePanelProps) {
  return (
    <ActionDockPanel>
      {visiblePlayer && <PlayerPanelHeader visiblePlayer={visiblePlayer} description={description} />}
      {!visiblePlayer && title && <p className="font-body text-sm uppercase tracking-[0.2em] text-white/70">{title}</p>}
      <div className={`mt-3 flex justify-end gap-2 ${wrap ? 'flex-wrap' : ''} ${className}`.trim()}>
        {cards.map((card) => (
          <GameCard
            key={card.id}
            card={card}
            compact
            className={DOCK_CARD_CLASS}
            onClick={() => onSelect(card.id)}
          />
        ))}
      </div>
    </ActionDockPanel>
  );
}

export function AcceptActionPanel({ onAccept, label = 'Принять урон' }: AcceptActionPanelProps) {
  return (
    <ActionDockButtons>
      <DockButton onClick={onAccept}>{label}</DockButton>
    </ActionDockButtons>
  );
}

export { DOCK_CARD_CLASS };
