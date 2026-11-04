/**
 * Доменные типы игры «Бэнг!».
 * Термины совпадают с правилами (bang-rules.pdf, версия 1.1).
 */

// ─── Карты ──────────────────────────────────────────────────────────────────

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

/** Достоинство карты: от «двойки» до «туза» (2-3-…-10-J-Q-K-A). */
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

/** Коричневая рамка — разовая карта, синяя — постоянная (лежит «в игре»). */
export type CardColor = 'brown' | 'blue';

export type CardKind =
  // Разовые (коричневые)
  | 'BANG' // «Бэнг!»
  | 'MISSED' // «Мимо!»
  | 'BEER' // «Отдых» (в старых тиражах — «Пиво»)
  | 'SALOON' // «Салун»
  | 'PANIC' // «Паника!»
  | 'CAT_BALOU' // «Красотка»
  | 'STAGECOACH' // «Дилижанс»
  | 'WELLS_FARGO' // «Уэллс Фарго»
  | 'GATLING' // «Гатлинг»
  | 'INDIANS' // «Индейцы!»
  | 'DUEL' // «Дуэль»
  | 'GENERAL_STORE' // «Магазин»
  // Постоянные (синие)
  | 'BARREL' // «Бочка»
  | 'MUSTANG' // «Мустанг»
  | 'SCOPE' // «Прицел»
  | 'JAIL' // «Тюрьма»
  | 'DYNAMITE' // «Динамит»
  // Оружие (синие)
  | 'VOLCANIC' // «Волканик»
  | 'SCHOFIELD' // «Скофилд»
  | 'REMINGTON' // «Ремингтон»
  | 'CARABINE' // «Карабин»
  | 'WINCHESTER'; // «Винчестер»

export interface Card {
  id: string;
  kind: CardKind;
  name: string;
  color: CardColor;
  suit: Suit;
  rank: Rank;
  description: string;
  /** Дальность стрельбы. Есть только у оружия. */
  range?: number;
}

// ─── Игроки ─────────────────────────────────────────────────────────────────

export type Role = 'sheriff' | 'deputy' | 'outlaw' | 'renegade';

/**
 * Идентификаторы персонажей — оригинальные (международные) имена.
 * Русские имена из правил — в data/characters.ts.
 */
export type CharacterId =
  | 'slab_the_killer' // Ангельские Глазки
  | 'calamity_janet' // Бедовая Джейн
  | 'black_jack' // Бешеный Пёс
  | 'vulture_sam' // Большой Змей
  | 'bart_cassidy' // Бутч Кэссиди
  | 'lucky_duke' // Счастливчик Люк
  | 'el_gringo' // Джанго
  | 'jesse_jones' // Джесси Джеймс
  | 'kit_carson' // Кит Карсон
  | 'willy_the_kid' // Малыш Билли
  | 'paul_regret' // Неуловимый Джо
  | 'suzy_lafayette' // Сюзи Лафайет
  | 'sid_ketchum' // Том Кетчум
  | 'pedro_ramirez' // Туко
  | 'rose_doolan' // Хладнокровная Рози
  | 'jourdonnais'; // Человек-без-Имени

export interface Player {
  id: string;
  name: string;
  characterId: CharacterId;
  role: Role;
  /** Здоровье в начале партии — больше этого вылечиться нельзя. */
  maxHp: number;
  hp: number;
  hand: Card[];
  /** Карты «в игре» — синие карты, лежащие перед игроком. */
  inPlay: Card[];
  isEliminated: boolean;
}

// ─── Ход ────────────────────────────────────────────────────────────────────

/**
 * TURN_START — проверки «Динамита» и «Тюрьмы» (до набора);
 * DRAW — 1. Набор; PLAY — 2. Розыгрыш; DISCARD — 3. Сброс лишних карт.
 */
export type Phase = 'TURN_START' | 'DRAW' | 'PLAY' | 'DISCARD' | 'GAME_OVER';

/** LAW — шериф и помощники. */
export type Winner = 'LAW' | 'OUTLAWS' | 'RENEGADE';

/** Зачем делается «Проверка» (вскрытие верхней карты колоды). */
export type CheckReason = 'DYNAMITE' | 'JAIL' | 'BARREL' | 'JOURDONNAIS';

// ─── Запросы к игроку ───────────────────────────────────────────────────────
// Prompt — то, чего игра ждёт от конкретного игрока (actorId) прямо сейчас.

/** Начало хода: нужно вскрыть карту для проверки «Динамита» или «Тюрьмы». */
export interface TurnStartCheckPrompt {
  kind: 'TURN_START_CHECK';
  actorId: string;
  reason: 'DYNAMITE' | 'JAIL';
}

/** В игрока попали «Бэнг!» или «Гатлингом»: «Мимо!», «Бочка» или потеря здоровья. */
export interface ShotPrompt {
  kind: 'RESPOND_TO_SHOT';
  actorId: string;
  attackerId: string;
  cardKind: 'BANG' | 'GATLING';
  /** Ангельские Глазки требуют двух «Мимо!». */
  missedNeeded: number;
  missedPlayed: number;
  barrelUsed: boolean;
  /** Встроенная бочка Человека-без-Имени. */
  abilityUsed: boolean;
}

/** «Индейцы!»: сбросить «Бэнг!» или потерять здоровье. */
export interface IndiansPrompt {
  kind: 'RESPOND_TO_INDIANS';
  actorId: string;
  attackerId: string;
}

/** «Дуэль»: actor должен сбросить «Бэнг!», иначе теряет здоровье. */
export interface DuelPrompt {
  kind: 'RESPOND_TO_DUEL';
  actorId: string;
  opponentId: string;
}

/** «Магазин»: выбрать одну из открытых карт (они лежат в GameState.generalStore). */
export interface GeneralStorePrompt {
  kind: 'GENERAL_STORE_PICK';
  actorId: string;
}

/** «Паника!» / «Красотка»: выбрать карту соперника — случайную с руки или из игры. */
export interface OpponentCardPrompt {
  kind: 'CHOOSE_OPPONENT_CARD';
  actorId: string;
  victimId: string;
  cardKind: 'PANIC' | 'CAT_BALOU';
}

/** Счастливчик Люк выбирает одну из двух карт проверки. */
export interface CheckChoicePrompt {
  kind: 'CHOOSE_CHECK_CARD';
  actorId: string;
  reason: CheckReason;
  cards: Card[];
  /** Для проверки «Бочки» — выстрел, на который игрок отвечает. */
  shot?: ShotPrompt;
}

/** Джесси Джеймс / Туко выбирают, откуда взять первую карту набора. */
export interface DrawSourcePrompt {
  kind: 'CHOOSE_DRAW_SOURCE';
  actorId: string;
}

/** Кит Карсон: из трёх карт выбрать одну, которая вернётся на верх колоды. */
export interface KitCarsonPrompt {
  kind: 'KIT_CARSON_RETURN';
  actorId: string;
  cards: Card[];
}

/** Игрок потерял последнюю единицу здоровья и может спастись «Отдыхом». */
export interface DyingPrompt {
  kind: 'DYING';
  actorId: string;
  attackerId?: string;
}

export type Prompt =
  | TurnStartCheckPrompt
  | ShotPrompt
  | IndiansPrompt
  | DuelPrompt
  | GeneralStorePrompt
  | OpponentCardPrompt
  | CheckChoicePrompt
  | DrawSourcePrompt
  | KitCarsonPrompt
  | DyingPrompt;

export type PromptKind = Prompt['kind'];

// ─── Состояние партии ───────────────────────────────────────────────────────

export interface LogEntry {
  id: number;
  text: string;
  /** Карта, которую стоит показать рядом с записью (например, карта проверки). */
  card?: Card;
}

export interface GameState {
  /** Игроки в порядке рассадки по часовой стрелке. */
  players: Player[];
  activePlayerId: string;
  phase: Phase;
  /** Колода. Верхняя карта — последний элемент. */
  deck: Card[];
  /** Сброс. Верхняя карта — последний элемент. */
  discard: Card[];
  /** Сколько «Бэнг!» сыграно в этот ход (лимит — 1). */
  bangsPlayedThisTurn: number;
  /** Открытые карты «Магазина». */
  generalStore: Card[];
  /** Текущий запрос к игроку. */
  prompt: Prompt | null;
  /** Запросы, ожидающие своей очереди (цели «Гатлинга», «Индейцев», «Магазина», проверки начала хода). */
  queue: Prompt[];
  winner: Winner | null;
  log: LogEntry[];
}

// ─── Действия ───────────────────────────────────────────────────────────────
// Все действия совершает «текущий игрок»: prompt.actorId, а без запроса — активный игрок.

export type DrawSource = 'deck' | 'discard' | 'player';

export type GameAction =
  | { type: 'CHECK_TURN_START' }
  | { type: 'DRAW_CARDS' }
  | { type: 'CHOOSE_DRAW_SOURCE'; source: DrawSource; playerId?: string }
  | { type: 'KIT_CARSON_RETURN'; cardId: string }
  | { type: 'PLAY_CARD'; cardId: string; targetId?: string }
  | { type: 'USE_DEFENSE'; source: 'BARREL' | 'JOURDONNAIS' }
  | { type: 'CHOOSE_CHECK_CARD'; cardId: string }
  | { type: 'TAKE_HIT' }
  | { type: 'PICK_GENERAL_STORE_CARD'; cardId: string }
  | { type: 'PICK_OPPONENT_CARD'; zone: 'hand' | 'inPlay'; cardId?: string }
  | { type: 'SID_KETCHUM_HEAL'; cardIds: [string, string] }
  | { type: 'ACCEPT_DEATH' }
  | { type: 'END_TURN' }
  | { type: 'DISCARD_CARD'; cardId: string };
