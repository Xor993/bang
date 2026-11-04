import type { CharacterId, Role } from '../../game';

export type MatchResult = 'win' | 'loss';

export interface GameHistoryEntry {
  id: string;
  playedAt: string;
  result: MatchResult;
  role: Role;
  characterId: CharacterId;
  playersCount: number;
  durationMinutes: number;
  summary: string;
}

export const MOCK_GAME_HISTORY: GameHistoryEntry[] = [
  {
    id: 'match-001',
    playedAt: '23 мая 2026, 12:40',
    result: 'win',
    role: 'renegade',
    characterId: 'rose_doolan',
    playersCount: 5,
    durationMinutes: 28,
    summary: 'Остались вдвоём с шерифом и добили его из «Винчестера».',
  },
  {
    id: 'match-002',
    playedAt: '23 мая 2026, 11:15',
    result: 'win',
    role: 'sheriff',
    characterId: 'kit_carson',
    playersCount: 6,
    durationMinutes: 34,
    summary: 'Помощник прикрыл от «Индейцев», затем выбили последнего бандита.',
  },
  {
    id: 'match-003',
    playedAt: '22 мая 2026, 21:08',
    result: 'loss',
    role: 'outlaw',
    characterId: 'willy_the_kid',
    playersCount: 4,
    durationMinutes: 19,
    summary: 'Слишком рано раскрылись и получили фокус-огонь от шерифа.',
  },
  {
    id: 'match-004',
    playedAt: '22 мая 2026, 18:22',
    result: 'win',
    role: 'deputy',
    characterId: 'jourdonnais',
    playersCount: 7,
    durationMinutes: 41,
    summary: 'Удержали шерифа живым до конца, отбили серию «Бэнг!» с «Бочкой».',
  },
  {
    id: 'match-005',
    playedAt: '21 мая 2026, 16:05',
    result: 'loss',
    role: 'renegade',
    characterId: 'lucky_duke',
    playersCount: 5,
    durationMinutes: 31,
    summary: 'Ренегат выбыл третьим — бандиты добили шерифа без вашей помощи.',
  },
  {
    id: 'match-006',
    playedAt: '20 мая 2026, 14:50',
    result: 'win',
    role: 'outlaw',
    characterId: 'slab_the_killer',
    playersCount: 6,
    durationMinutes: 26,
    summary: 'Два «Мимо!» подряд сломали защиту шерифа, финиш «Бэнг!».',
  },
  {
    id: 'match-007',
    playedAt: '19 мая 2026, 20:33',
    result: 'win',
    role: 'sheriff',
    characterId: 'black_jack',
    playersCount: 4,
    durationMinutes: 22,
    summary: 'Быстрая партия: «Паника!» на бандита и добор с «Дилижанса».',
  },
  {
    id: 'match-008',
    playedAt: '18 мая 2026, 13:17',
    result: 'loss',
    role: 'deputy',
    characterId: 'sid_ketchum',
    playersCount: 5,
    durationMinutes: 29,
    summary: 'Шериф пал от ренегата, когда бандиты уже были выбиты.',
  },
];

export const getHistoryStats = (history: GameHistoryEntry[]) => {
  const wins = history.filter((entry) => entry.result === 'win').length;
  const losses = history.length - wins;
  const winRate = history.length > 0 ? Math.round((wins / history.length) * 100) : 0;

  return {
    total: history.length,
    wins,
    losses,
    winRate,
  };
};
