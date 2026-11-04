import { ActionDockPanel } from './ActionDock';

type Props = {
  cardsToDiscard: number;
};

export function DiscardPhaseBanner({ cardsToDiscard }: Props) {
  return (
    <ActionDockPanel>
      <p className="font-body text-sm uppercase tracking-[0.2em] text-white/60">Конец хода</p>
      <p className="mt-1 font-title text-3xl text-bang-plate">Сбросьте {cardsToDiscard}</p>
      <p className="mt-1 font-body text-sm text-white/80">Лимит руки равен вашему текущему здоровью</p>
    </ActionDockPanel>
  );
}
