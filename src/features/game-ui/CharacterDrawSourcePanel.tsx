import type { Card, Player } from '../../shared/types/game';
import { Card as GameCard } from '../../entities/card/Card';
import { DOCK_CARD_CLASS } from './GameActionPanel';
import { ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  visiblePlayer: Player;
  players: Player[];
  topDiscard: Card | undefined;
  onChoose: (source: 'deck' | 'discard' | 'player', sourcePlayerId?: string) => void;
};

export function CharacterDrawSourcePanel({ visiblePlayer, players, topDiscard, onChoose }: Props) {
  const canUseDiscard = visiblePlayer.characterId === 'pedro_ramirez' && topDiscard;
  const stealTargets = players.filter(
    (player) => player.id !== visiblePlayer.id && !player.isEliminated && player.hand.length > 0,
  );

  return (
    <ActionDockPanel>
      <p className="font-body text-sm uppercase tracking-[0.2em] text-white/70">
        {visiblePlayer.name}, первая карта набора
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <DockButton onClick={() => onChoose('deck')}>Из колоды</DockButton>

        {canUseDiscard && topDiscard && (
          <div className="flex flex-col items-end gap-1">
            <GameCard card={topDiscard} compact className={DOCK_CARD_CLASS} onClick={() => onChoose('discard')} />
            <span className="font-body text-xs text-white/70">Верх сброса</span>
          </div>
        )}
      </div>

      {visiblePlayer.characterId === 'jesse_jones' && stealTargets.length > 0 && (
        <div className="mt-4 border-t border-white/15 pt-3">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-white/60">
            Вслепую у игрока
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {stealTargets.map((player) => (
              <DockButton key={player.id} onClick={() => onChoose('player', player.id)}>
                {player.name} ({player.hand.length})
              </DockButton>
            ))}
          </div>
        </div>
      )}
    </ActionDockPanel>
  );
}
