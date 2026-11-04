import type { OpponentCardPrompt, Player } from '../../game';
import { Card as GameCard } from '../../entities/card/Card';
import { DOCK_CARD_CLASS } from './GameActionPanel';
import { ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  prompt: OpponentCardPrompt;
  victim: Player;
  onPick: (zone: 'hand' | 'inPlay', cardId?: string) => void;
};

/** «Паника!» / «Красотка»: случайная карта с руки или выбранная карта из игры. */
export function OpponentCardPickModal({ prompt, victim, onPick }: Props) {
  const verb = prompt.cardKind === 'PANIC' ? 'Забрать' : 'Сбросить';

  return (
    <ActionDockPanel>
      <p className="font-body text-sm uppercase tracking-[0.2em] text-white/70">
        {verb} карту у игрока {victim.name}
      </p>

      {victim.hand.length > 0 && (
        <div className="mt-3 flex justify-end">
          <DockButton onClick={() => onPick('hand')}>
            {verb} случайную с руки ({victim.hand.length})
          </DockButton>
        </div>
      )}

      {victim.inPlay.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          {victim.inPlay.map((card) => (
            <GameCard key={card.id} card={card} compact className={DOCK_CARD_CLASS} onClick={() => onPick('inPlay', card.id)} />
          ))}
        </div>
      )}
    </ActionDockPanel>
  );
}
