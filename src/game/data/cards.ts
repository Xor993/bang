import type { Card, CardColor, CardKind, Rank, Suit } from '../types';

interface CardDefinition {
  name: string;
  color: CardColor;
  description: string;
  range?: number;
}

/** Названия и тексты карт — по правилам (стр. 5–9). */
export const CARD_DEFINITIONS: Record<CardKind, CardDefinition> = {
  BANG: { name: 'Бэнг!', color: 'brown', description: 'Попадание в игрока в пределах дальности вашего оружия.' },
  MISSED: { name: 'Мимо!', color: 'brown', description: 'Отменяет попадание. Играется только в ответ.' },
  BEER: {
    name: 'Отдых',
    color: 'brown',
    description: 'Восстанавливает 1 здоровье. Можно сыграть, чтобы спастись от гибели. Не действует, если в игре двое.',
  },
  SALOON: { name: 'Салун', color: 'brown', description: 'Все игроки в игре восстанавливают по 1 здоровью.' },
  PANIC: { name: 'Паника!', color: 'brown', description: 'Заберите карту у игрока на расстоянии 1: случайную с руки или из игры.' },
  CAT_BALOU: { name: 'Красотка', color: 'brown', description: 'Заставьте любого игрока сбросить карту: случайную с руки или из игры.' },
  STAGECOACH: { name: 'Дилижанс', color: 'brown', description: 'Возьмите на руку 2 карты из колоды.' },
  WELLS_FARGO: { name: 'Уэллс Фарго', color: 'brown', description: 'Возьмите на руку 3 карты из колоды.' },
  GATLING: { name: 'Гатлинг', color: 'brown', description: 'Попадание в каждого другого игрока. Не считается картой «Бэнг!».' },
  INDIANS: { name: 'Индейцы!', color: 'brown', description: 'Каждый другой игрок сбрасывает «Бэнг!» или теряет 1 здоровье.' },
  DUEL: {
    name: 'Дуэль',
    color: 'brown',
    description: 'Вызовите любого игрока. По очереди сбрасывайте «Бэнг!»; кто не смог — теряет 1 здоровье.',
  },
  GENERAL_STORE: {
    name: 'Магазин',
    color: 'brown',
    description: 'Откройте карты по числу игроков. Начиная с вас, каждый забирает одну.',
  },
  BARREL: { name: 'Бочка', color: 'blue', description: 'Когда в вас попадают, сделайте проверку: черва отменяет попадание.' },
  MUSTANG: { name: 'Мустанг', color: 'blue', description: 'Другие игроки видят вас на расстоянии на 1 больше.' },
  SCOPE: { name: 'Прицел', color: 'blue', description: 'Вы видите других игроков на расстоянии на 1 меньше.' },
  JAIL: {
    name: 'Тюрьма',
    color: 'blue',
    description: 'Сыграйте на любого игрока, кроме шерифа. В начале хода проверка: черва — свобода, иначе пропуск хода.',
  },
  DYNAMITE: {
    name: 'Динамит',
    color: 'blue',
    description: 'В начале хода проверка: пика 2–9 — взрыв и −3 здоровья, иначе передайте соседу слева.',
  },
  VOLCANIC: { name: 'Волканик', color: 'blue', range: 1, description: 'Оружие, дальность 1. Можно играть сколько угодно «Бэнг!» за ход.' },
  SCHOFIELD: { name: 'Скофилд', color: 'blue', range: 2, description: 'Оружие, дальность 2.' },
  REMINGTON: { name: 'Ремингтон', color: 'blue', range: 3, description: 'Оружие, дальность 3.' },
  CARABINE: { name: 'Карабин', color: 'blue', range: 4, description: 'Оружие, дальность 4.' },
  WINCHESTER: { name: 'Винчестер', color: 'blue', range: 5, description: 'Оружие, дальность 5.' },
};

const SUIT_SYMBOLS: Record<Suit, string> = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };

export const getSuitSymbol = (suit: Suit) => SUIT_SYMBOLS[suit];

export const isRedSuit = (suit: Suit) => suit === 'hearts' || suit === 'diamonds';

/** «Q♥», «10♠» — масть и достоинство карты. */
export const formatCardFace = (card: Pick<Card, 'rank' | 'suit'>) => `${card.rank}${getSuitSymbol(card.suit)}`;

const WEAPON_KINDS: ReadonlySet<CardKind> = new Set(['VOLCANIC', 'SCHOFIELD', 'REMINGTON', 'CARABINE', 'WINCHESTER']);

export const isWeapon = (card: Pick<Card, 'kind'>) => WEAPON_KINDS.has(card.kind);

type CardFace = `${Rank}${'♥' | '♦' | '♣' | '♠'}`;

const SUIT_BY_SYMBOL: Record<string, Suit> = { '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs', '♠': 'spades' };

/** Состав базовой колоды — 80 карт с их настоящими мастями и достоинствами. */
const DECK_COMPOSITION: Record<CardKind, CardFace[]> = {
  BANG: [
    'A♠',
    '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦',
    '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣',
    'Q♥', 'K♥', 'A♥',
  ],
  MISSED: ['10♣', 'J♣', 'Q♣', 'K♣', 'A♣', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠'],
  BEER: ['6♥', '7♥', '8♥', '9♥', '10♥', 'J♥'],
  SALOON: ['5♥'],
  PANIC: ['J♥', 'Q♥', 'A♥', '8♦'],
  CAT_BALOU: ['K♥', '9♦', '10♦', 'J♦'],
  STAGECOACH: ['9♠', '9♠'],
  WELLS_FARGO: ['3♥'],
  GATLING: ['10♥'],
  INDIANS: ['K♦', 'A♦'],
  DUEL: ['Q♦', 'J♠', '8♣'],
  GENERAL_STORE: ['9♣', 'Q♠'],
  BARREL: ['Q♠', 'K♠'],
  MUSTANG: ['8♥', '9♥'],
  SCOPE: ['A♠'],
  JAIL: ['J♠', '10♠', '4♥'],
  DYNAMITE: ['2♥'],
  VOLCANIC: ['10♠', '10♣'],
  SCHOFIELD: ['J♣', 'Q♣', 'K♠'],
  REMINGTON: ['K♣'],
  CARABINE: ['A♣'],
  WINCHESTER: ['8♠'],
};

const parseFace = (face: CardFace): { rank: Rank; suit: Suit } => ({
  rank: face.slice(0, -1) as Rank,
  suit: SUIT_BY_SYMBOL[face.slice(-1)],
});

/** Создаёт полную колоду (не перемешанную). */
export function createDeck(): Card[] {
  return (Object.entries(DECK_COMPOSITION) as [CardKind, CardFace[]][]).flatMap(([kind, faces]) =>
    faces.map((face, index) => ({
      id: `${kind.toLowerCase()}-${index + 1}`,
      kind,
      ...CARD_DEFINITIONS[kind],
      ...parseFace(face),
    })),
  );
}
