import { LayoutGroup, motion } from 'framer-motion';
import { canPlayCard, getActorId, getPlayer, needsTarget } from '../../game';
import type { Card as CardType, GameState, Player } from '../../game';
import { useGame, useGameStore } from '../../store/useGameStore';
import { Card } from '../../entities/card/Card';

type CardAction = 'discard' | 'target' | 'play' | null;

/** Что произойдёт при клике на карту: сброс лишней, выбор цели или розыгрыш. */
function getCardAction(game: GameState, player: Player, card: CardType): CardAction {
  if (game.phase === 'DISCARD' && !game.prompt && game.activePlayerId === player.id) return 'discard';
  if (!canPlayCard(game, player.id, card)) return null;
  return !game.prompt && needsTarget(player, card) ? 'target' : 'play';
}

/** Рука игрока, который сейчас за экраном. */
export function Hand() {
  const game = useGame();
  const { dispatch, targetingCardId, setTargeting } = useGameStore();
  const player = getPlayer(game, getActorId(game));

  if (player.hand.length === 0) return null;

  const handleClick = (card: CardType, action: CardAction) => {
    if (action === 'discard') dispatch({ type: 'DISCARD_CARD', cardId: card.id });
    if (action === 'target') setTargeting(targetingCardId === card.id ? null : card.id);
    if (action === 'play') dispatch({ type: 'PLAY_CARD', cardId: card.id });
  };

  return (
    <LayoutGroup id="hand-layout">
      <div id="bang-hand-anchor" className="fixed bottom-4 left-4 z-50 flex max-w-[min(58vw,720px)] flex-col items-start">
        <div
          className="mb-1 rounded-full border border-[#5a3d22]/50 px-3 py-0.5 font-body text-[10px] uppercase tracking-widest text-[#f0e6d2]/80"
          style={{ background: 'linear-gradient(180deg, #6b4a2f 0%, #4a3020 100%)' }}
        >
          Карты на руке · {player.name}
        </div>
        <div
          className="flex h-52 items-end justify-start rounded-2xl border-2 border-[#5a3d22] py-3 pl-3 pr-10"
          style={{
            background: 'linear-gradient(180deg, rgba(122,85,46,0.92) 0%, rgba(61,36,24,0.95) 100%)',
            boxShadow: 'inset 0 2px 6px rgba(255,240,210,0.15), 0 8px 28px rgba(0,0,0,0.5)',
          }}
        >
          {player.hand.map((card, index) => {
            const action = getCardAction(game, player, card);
            const isTargeting = targetingCardId === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                className="transition-all duration-300"
                style={{
                  marginLeft: index === 0 ? 0 : '-50px',
                  marginTop: action ? (isTargeting ? '-28px' : '0') : '14px',
                  zIndex: index,
                }}
                initial={{ opacity: 0, y: 88, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 460, damping: 30, mass: 0.65 }}
              >
                <Card
                  card={card}
                  className={
                    action
                      ? 'cursor-pointer hover:-translate-y-10 hover:shadow-[0_0_30px_rgba(255,200,0,0.5)] hover:z-50'
                      : 'pointer-events-none grayscale-[0.5]'
                  }
                  onClick={action ? () => handleClick(card, action) : undefined}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
}
