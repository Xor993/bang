import type { Card, Player } from '../../shared/types/game';
import { Card as GameCard } from '../../entities/card/Card';
import { playerHasBarrel } from '../card-effect/barrel';
import { ActionDockButtons, ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  barrelCheckUsed: boolean | undefined;
  jourdonnaisCheckUsed: boolean | undefined;
  hasPendingCheckChoice: boolean;
  visiblePlayer: Player;
  lastDrawnCardForCheck: Card | null;
  onTakeDamage: () => void;
  onDrawBarrel: () => void;
  onDrawJourdonnais: () => void;
  onResolveBarrel: () => void;
};

const getCheckLabel = (
  barrelCheckUsed: boolean | undefined,
  jourdonnaisCheckUsed: boolean | undefined,
) => {
  if (jourdonnaisCheckUsed && !barrelCheckUsed) return 'Проверка способности';
  return 'Проверка бочки';
};

export function RespondToBangPanel({
  barrelCheckUsed,
  jourdonnaisCheckUsed,
  hasPendingCheckChoice,
  visiblePlayer,
  lastDrawnCardForCheck,
  onTakeDamage,
  onDrawBarrel,
  onDrawJourdonnais,
  onResolveBarrel,
}: Props) {
  const canUseJourdonnais = visiblePlayer.characterId === 'jourdonnais';

  return (
    <>
      {lastDrawnCardForCheck && (
        <ActionDockPanel>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-white/60">
            {getCheckLabel(barrelCheckUsed, jourdonnaisCheckUsed)}
          </p>
          <div className="mt-3 flex items-center justify-end gap-4">
            <div className="text-right">
              <p
                className={`font-title text-xl ${lastDrawnCardForCheck.suit === 'hearts' ? 'text-green-400' : 'text-white/90'}`}
              >
                {lastDrawnCardForCheck.suit === 'hearts'
                  ? 'Черви — попадание отменено'
                  : jourdonnaisCheckUsed && !barrelCheckUsed
                    ? 'Не черви — способность не помогла'
                    : 'Не черви — бочка не помогла'}
              </p>
              <DockButton className="mt-3" onClick={onResolveBarrel}>
                Учесть результат
              </DockButton>
            </div>
            <GameCard card={lastDrawnCardForCheck} compact className="!h-32 !w-20" />
          </div>
        </ActionDockPanel>
      )}

      {!lastDrawnCardForCheck && !hasPendingCheckChoice && (
        <ActionDockButtons>
          <DockButton onClick={onTakeDamage}>Получить урон</DockButton>
          {playerHasBarrel(visiblePlayer) && (
            <DockButton disabled={Boolean(barrelCheckUsed)} onClick={onDrawBarrel}>
              Бочка
            </DockButton>
          )}
          {canUseJourdonnais && (
            <DockButton disabled={Boolean(jourdonnaisCheckUsed)} onClick={onDrawJourdonnais}>
              Способность
            </DockButton>
          )}
        </ActionDockButtons>
      )}
    </>
  );
}
