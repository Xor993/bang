import { getTopOfDiscard } from '../../game';
import { useGame } from '../../store/useGameStore';
import { Card as GameCard } from '../../entities/card/Card';

/** Стопка сброса: видна только верхняя карта. */
export function DiscardPile() {
  const game = useGame();
  const top = getTopOfDiscard(game);
  const count = game.discard.length;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative h-36 w-24"
        id="bang-discard-anchor"
        aria-label={`Сброс, карт: ${count}`}
      >
        {top ? (
          <div className="relative h-full w-full">
            <GameCard
              card={top}
              compact
              className="!h-36 !w-24 shadow-2xl ring-1 ring-black/20"
            />
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-white/25 bg-white/10 shadow-inner">
            <span className="px-1 text-center font-body text-[9px] font-bold uppercase leading-tight text-white/45">
              Сброс пуст
            </span>
          </div>
        )}

        {count > 0 && (
          <span className="absolute -right-1 -top-1 z-[3] min-w-[1.25rem] rounded-full bg-bang-red px-1 py-0.5 text-center font-body text-[10px] font-bold text-white shadow-md ring-2 ring-white/40">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
      <span className="max-w-[6rem] text-center font-body text-[10px] font-bold uppercase leading-tight tracking-widest text-white/85">
        Сброс
      </span>
    </div>
  );
}
