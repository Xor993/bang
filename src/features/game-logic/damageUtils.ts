import type { Card, Player } from '../../shared/types/game';


export const eliminatePlayer = (
  players: Player[],
  discard: Card[],
  eliminatedPlayerId: string,
  sourceId?: string,
) => {
  const eliminatedPlayer = players.find((player) => player.id === eliminatedPlayerId);

  if (!eliminatedPlayer) {
    return {
      players,
      discard,
      winnerMessage: getWinnerMessage(players),
    };
  }

  let nextPlayers = players.map((player) =>
    player.id === eliminatedPlayerId
      ? {
          ...player,
          currentHp: 0,
          isEliminated: true,
          isInJail: false,
          hand: [],
          equipment: [],
        }
      : player,
  );
  let nextDiscard = [...eliminatedPlayer.hand, ...eliminatedPlayer.equipment, ...discard];

  const sourcePlayer = sourceId
    ? nextPlayers.find((player) => player.id === sourceId && !player.isEliminated)
    : null;

  if (sourcePlayer && sourcePlayer.role === 'sheriff' && eliminatedPlayer.role === 'deputy') {
    const sheriffCards = [...sourcePlayer.hand, ...sourcePlayer.equipment];
    nextDiscard = [...sheriffCards, ...nextDiscard];
    nextPlayers = nextPlayers.map((player) =>
      player.id === sourcePlayer.id
        ? { ...player, hand: [], equipment: [] }
        : player,
    );
  }

  return {
    players: nextPlayers,
    discard: nextDiscard,
    winnerMessage: getWinnerMessage(nextPlayers),
  };
};

export const getWinnerMessage = (players: Player[]) => {
  const alivePlayers = players.filter((player) => !player.isEliminated);
  const sheriffAlive = alivePlayers.some((player) => player.role === 'sheriff');
  const outlawsAlive = alivePlayers.some((player) => player.role === 'outlaw');
  const renegadeAlive = alivePlayers.some((player) => player.role === 'renegade');

  if (!sheriffAlive) {
    if (alivePlayers.length === 1 && alivePlayers[0].role === 'renegade') {
      return 'Ренегат победил';
    }

    return 'Бандиты победили';
  }

  if (!outlawsAlive && !renegadeAlive) {
    return 'Шериф и помощники победили';
  }

  return null;
};

export const applyDamage = (
  players: Player[],
  discard: Card[],
  targetId: string,
  amount: number,
  sourceId?: string,
) => {
  const nextPlayers = players.map((player) =>
    player.id === targetId
      ? { ...player, currentHp: player.currentHp - amount }
      : player,
  );
  const targetPlayer = nextPlayers.find((player) => player.id === targetId);

  if (targetPlayer && targetPlayer.currentHp <= 0) {
    return eliminatePlayer(nextPlayers, discard, targetId, sourceId);
  }

  return {
    players: nextPlayers,
    discard,
    winnerMessage: getWinnerMessage(nextPlayers),
  };
};