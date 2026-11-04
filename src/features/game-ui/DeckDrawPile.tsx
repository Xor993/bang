import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useGame, useGameStore } from '../../store/useGameStore';

export function DeckDrawPile() {
  const { phase, deck, prompt } = useGame();
  const dispatch = useGameStore((store) => store.dispatch);
  const deckLen = deck.length;

  const [cooldown, setCooldown] = useState(false);

  // Колода может быть пуста — тогда при наборе перемешивается сброс
  const shouldPulse = phase === 'DRAW' && prompt === null;
  const canDraw = shouldPulse && !cooldown;

  const handleClick = useCallback(() => {
    if (!canDraw) return;
    setCooldown(true);
    dispatch({ type: 'DRAW_CARDS' });
    window.setTimeout(() => setCooldown(false), 950);
  }, [canDraw, dispatch]);

  return (
    <div className="group relative flex flex-col items-center gap-1">
      <motion.button
        type="button"
        id="bang-deck-anchor"
        aria-label="Колода — нажми, чтобы взять две карты в начале хода"
        disabled={!canDraw}
        onClick={handleClick}
        className={`relative flex h-36 w-24 items-center justify-center rounded-xl border-2 border-white/40 bg-bang-red shadow-[0_5px_15px_rgba(0,0,0,0.5)] select-none ${
          canDraw ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        whileHover={canDraw ? { scale: 1.06, y: -4 } : undefined}
        whileTap={canDraw ? { scale: 0.94 } : undefined}
        animate={
          shouldPulse
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 5px 15px rgba(0,0,0,0.5)',
                  '0 10px 32px rgba(255,210,120,0.55)',
                  '0 5px 15px rgba(0,0,0,0.5)',
                ],
              }
            : { scale: 1 }
        }
        transition={
          shouldPulse
            ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
      >
        <span className="font-title text-2xl text-white -rotate-90">BANG!</span>
        {deckLen > 0 && (
          <span className="absolute bottom-1 right-1 rounded bg-black/50 px-1.5 py-0.5 font-body text-[10px] font-bold text-white/90">
            {deckLen}
          </span>
        )}
      </motion.button>
      {shouldPulse && (
        <span className="font-body text-[10px] font-bold uppercase tracking-widest text-white/80">
          Набор: 2 карты
        </span>
      )}
      <div className="absolute -bottom-2 left-0 -z-10 h-4 w-full rounded-full bg-black/40 blur-md" />
    </div>
  );
}
