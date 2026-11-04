import { LayoutGroup, motion } from 'framer-motion';
import { getVisiblePlayerId } from '../../shared/pendingActions';
import type { EffectType } from '../../shared/types/game';
import { useGameStore } from '../../store/useGameStore';
import { Card } from '../../entities/card/Card';
import { canPlayCard } from '../game-logic/cardRules';

const TARGETED_CARD_EFFECTS = new Set<EffectType>(['BANG', 'MISSED', 'PANIC', 'CAT_BALOU', 'JAIL', 'DUEL']);

export function Hand() {
  const state = useGameStore();
  const { players, playCard, discardCard } = state;

  if (state.isTurnTransitionVisible || state.winnerMessage) return null;

  const visiblePlayerId = getVisiblePlayerId(state);
  const me = players.find((player) => player.id === visiblePlayerId);

  if (!me || me.hand.length === 0) return null;

  const pulseIds = state.drawPulseCardIds;

  return (
    <LayoutGroup id="hand-layout">
      <div
        id="bang-hand-anchor"
        className="fixed bottom-4 left-4 z-50 flex max-w-[min(58vw,720px)] flex-col items-start"
      >
        <div
          className="mb-1 rounded-full border border-[#5a3d22]/50 px-3 py-0.5 font-body text-[10px] uppercase tracking-widest text-[#f0e6d2]/80"
          style={{
            background: 'linear-gradient(180deg, #6b4a2f 0%, #4a3020 100%)',
          }}
        >
          Карты на руке
        </div>
        <div
          className="flex h-52 items-end justify-start rounded-2xl border-2 border-[#5a3d22] py-3 pl-3 pr-10"
          style={{
            background: 'linear-gradient(180deg, rgba(122,85,46,0.92) 0%, rgba(61,36,24,0.95) 100%)',
            boxShadow: 'inset 0 2px 6px rgba(255,240,210,0.15), 0 8px 28px rgba(0,0,0,0.5)',
          }}
        >
          {me.hand.map((card, index) => {
            const isDiscardPhase = state.phase === 'DISCARD_EXCESS' && state.activePlayerId === me.id;
            const canPlay = isDiscardPhase || canPlayCard(card, me, state);
            const isTargetingThis = state.targetingCardId === card.id;
            const isBangDiscardResponse =
              state.pendingAction?.type === 'RESPOND_TO_INDIANS' ||
              state.pendingAction?.type === 'RESPOND_TO_DUEL';
            const isBangMissedResponse = state.pendingAction?.type === 'RESPOND_TO_BANG';
            const needsTarget =
              TARGETED_CARD_EFFECTS.has(card.effectType) &&
              !(
                (card.effectType === 'BANG' || card.effectType === 'MISSED') &&
                (isBangDiscardResponse || isBangMissedResponse)
              );

            const isDrawPulse = pulseIds?.includes(card.id) ?? false;

            return (
              <motion.div
                key={card.id}
                layout
                className="transition-all duration-300"
                style={{
                  marginLeft: index === 0 ? 0 : '-50px',
                  marginTop: canPlay ? (isTargetingThis ? '-28px' : '0') : '14px',
                  zIndex: index,
                }}
                initial={isDrawPulse ? { opacity: 0, y: 88, scale: 0.88 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 460, damping: 30, mass: 0.65 }}
              >
                <Card
                  card={card}
                  className={
                    canPlay
                      ? 'cursor-pointer hover:-translate-y-10 hover:shadow-[0_0_30px_rgba(255,200,0,0.5)] hover:z-50'
                      : 'pointer-events-none grayscale-[0.5]'
                  }
                  onClick={() => {
                    if (!canPlay) return;

                    if (isDiscardPhase) {
                      discardCard(card.id);
                      return;
                    }

                    if (isTargetingThis) {
                      state.setTargeting(null);
                      return;
                    }
                    if (needsTarget) {
                      state.setTargeting(card.id);
                    } else {
                      playCard(card.id);
                    }
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
}
