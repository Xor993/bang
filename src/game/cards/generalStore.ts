/**
 * «Магазин» (стр. 7): «раскройте из колоды столько карт, сколько игроков на данный момент осталось в игре.
 * Начиная с вас и далее по часовой стрелке, каждый игрок забирает на руку одну из раскрытых карт».
 */
import { addToHand, takeTopCards } from '../core/cards';
import { addLog } from '../core/log';
import { getAlivePlayers, getAlivePlayersFrom, getPlayer } from '../core/players';
import type { GameState, GeneralStorePrompt } from '../types';

export function openGeneralStore(state: GameState, playerId: string): GameState {
  const { state: next, cards } = takeTopCards(state, getAlivePlayers(state).length);
  const pickers = getAlivePlayersFrom(next, playerId).map(
    (player): GeneralStorePrompt => ({ kind: 'GENERAL_STORE_PICK', actorId: player.id }),
  );

  return { ...next, generalStore: cards, queue: [...pickers, ...next.queue] };
}

export function pickGeneralStoreCard(state: GameState, cardId: string): GameState {
  const { prompt } = state;
  const card = state.generalStore.find((candidate) => candidate.id === cardId);
  if (prompt?.kind !== 'GENERAL_STORE_PICK' || !card) return state;

  const next: GameState = {
    ...addToHand(state, prompt.actorId, [card]),
    generalStore: state.generalStore.filter((candidate) => candidate.id !== cardId),
    prompt: null,
  };
  return addLog(next, `${getPlayer(next, prompt.actorId).name} берёт из «Магазина» «${card.name}».`, card);
}
