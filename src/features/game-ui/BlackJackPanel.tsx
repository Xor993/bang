import type { Card, Player } from '../../shared/types/game';
import { isRedCard } from '../../shared/cardUtils';
import { Card as GameCard } from '../../entities/card/Card';
import { DOCK_CARD_CLASS, PlayerPanelHeader } from './GameActionPanel';
import { ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  visiblePlayer: Player;
  cards: Card[];
  onContinue: () => void;
};

export function BlackJackPanel({ visiblePlayer, cards, onContinue }: Props) {
  const secondCard = cards[1];
  const getsBonus = secondCard ? isRedCard(secondCard) : false;

  return (
    <ActionDockPanel>
      <PlayerPanelHeader
        visiblePlayer={visiblePlayer}
        description="Покажите вторую карту набора. Красная масть даёт ещё одну карту."
      />

      <div className="mt-3 flex justify-end gap-3">
        {cards.map((card, index) => (
          <div key={card.id} className="flex flex-col items-center gap-1">
            <GameCard card={card} compact className={DOCK_CARD_CLASS} />
            <span className="font-body text-[9px] uppercase tracking-widest text-white/60">
              {index === 1 ? 'Вторая' : 'Первая'}
            </span>
          </div>
        ))}
      </div>

      <p className={`mt-3 font-title text-xl ${getsBonus ? 'text-amber-300' : 'text-white/70'}`}>
        {getsBonus ? 'Красная! Возьмите бонусную карту.' : 'Не красная. Бонуса нет.'}
      </p>
      <DockButton className="mt-3" onClick={onContinue}>
        Продолжить
      </DockButton>
    </ActionDockPanel>
  );
}
