import { getJesseJonesVictims, getTopOfDiscard } from '../../game';
import type { DrawSource, GameState, Player } from '../../game';
import { Card as GameCard } from '../../entities/card/Card';
import { DOCK_CARD_CLASS } from './GameActionPanel';
import { ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  game: GameState;
  player: Player;
  onChoose: (source: DrawSource, playerId?: string) => void;
};

/** Первая карта набора: Туко — из колоды или с верха сброса, Джесси Джеймс — из колоды или с руки соперника. */
export function CharacterDrawSourcePanel({ game, player, onChoose }: Props) {
  const topDiscard = getTopOfDiscard(game);
  const isTuco = player.characterId === 'pedro_ramirez';
  const victims = player.characterId === 'jesse_jones' ? getJesseJonesVictims(game, player.id) : [];

  return (
    <ActionDockPanel>
      <p className="font-body text-sm uppercase tracking-[0.2em] text-white/70">{player.name}, первая карта набора</p>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <DockButton onClick={() => onChoose('deck')}>Из колоды</DockButton>

        {isTuco && topDiscard && (
          <div className="flex flex-col items-end gap-1">
            <GameCard card={topDiscard} compact className={DOCK_CARD_CLASS} onClick={() => onChoose('discard')} />
            <span className="font-body text-xs text-white/70">Верх сброса</span>
          </div>
        )}
      </div>

      {victims.length > 0 && (
        <div className="mt-4 border-t border-white/15 pt-3">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.2em] text-white/60">Вслепую с руки игрока</p>
          <div className="flex flex-wrap justify-end gap-2">
            {victims.map((victim) => (
              <DockButton key={victim.id} onClick={() => onChoose('player', victim.id)}>
                {victim.name} ({victim.hand.length})
              </DockButton>
            ))}
          </div>
        </div>
      )}
    </ActionDockPanel>
  );
}
