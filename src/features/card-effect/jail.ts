import type { GameState, Player } from '../../shared/types/game';

export const syncInJailWithEquipment = (player: Player): Player => ({
  ...player,
  isInJail: player.equipment.some((card) => card.effectType === 'JAIL'),
});

export const canApplyJail = (
  source: Player,
  targetId: string | undefined,
  state: GameState,
): boolean => {
  if (!targetId || source.id === targetId) return false;

  const target = state.players.find((p) => p.id === targetId);
  if (!target || target.isEliminated || target.role === 'sheriff') return false;
  if (target.equipment.some((c) => c.effectType === 'JAIL')) return false;

  return true;
};

export const applyJailEffect = (
  state: GameState,
  sourcePlayer: Player,
  targetId?: string,
): Partial<GameState> => {
  void state;
  void sourcePlayer;
  void targetId;
  return {};
};
