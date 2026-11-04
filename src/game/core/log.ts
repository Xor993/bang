import type { Card, GameState } from '../types';

const MAX_LOG_ENTRIES = 50;

/** Добавляет запись в журнал партии — чтобы все за столом видели, что произошло. */
export function addLog(state: GameState, text: string, card?: Card): GameState {
  const id = (state.log[state.log.length - 1]?.id ?? 0) + 1;
  return { ...state, log: [...state.log, { id, text, card }].slice(-MAX_LOG_ENTRIES) };
}
