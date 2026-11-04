export type Suit = 'hearts' | 'spades' | 'diamonds' | 'clubs';
export type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type CardColor = 'brown' | 'blue';

export type CharacterId =
  | 'slab_the_killer'
  | 'calamity_janet'
  | 'black_jack'
  | 'vulture_sam'
  | 'bart_cassidy'
  | 'lucky_duke'
  | 'el_gringo'
  | 'jesse_jones'
  | 'kit_carson'
  | 'willy_the_kid'
  | 'paul_regret'
  | 'suzy_lafayette'
  | 'sid_ketchum'
  | 'pedro_ramirez'
  | 'rose_doolan'
  | 'jourdonnais';

export type EffectType = 
  | 'BANG'           // Бэнг! (Выстрел)
  | 'MISSED'         // Мимо! (Уклонение)
  | 'BEER'           // Пиво (Лечение)
  | 'SALOON'         // Салун (Все лечат 1 ХП)
  | 'PANIC'          // Паника! (Забрать карту на дистанции 1)
  | 'CAT_BALOU'      // Красотка (Сбросить любую карту)
  | 'STAGECOACH'     // Дилижанс (Взять 2 карты)
  | 'WELLS_FARGO'    // Уэллс Фарго (Взять 3 карты)
  | 'GATLING'        // Гатлинг (Бэнг по всем)
  | 'INDIANS'        // Индейцы! (Все сбрасывают Бэнг или теряют ХП)
  | 'DUEL'           // Дуэль (Сбрасываем Бэнги по очереди)
  | 'GENERAL_STORE'  // Магазин (Вскрыть карты по числу игроков)
  | 'WEAPON'         // Оружие (Меняет дистанцию стрельбы)
  | 'MUSTANG'        // Мустанг (Дистанция до вас +1)
  | 'SCOPE'          // Прицел (Дистанция от вас -1)
  | 'BARREL'         // Бочка (Проверка на червы при выстреле)
  | 'JAIL'           // Тюрьма (Пропуск хода)
  | 'DYNAMITE';      // Динамит (Передается по кругу, взрывается на 2-9 пики)

export interface Card {
  id: string;
  name: string;
  color: CardColor;
  suit: Suit;
  value: CardValue; 
  effectType: EffectType;
  
  description: string;
  range?: number;
}
export type Role = 'sheriff' | 'deputy' | 'outlaw' | 'renegade';

export interface Player {
  id: string;
  name: string;
  characterId: CharacterId;
  character: string; 
  role: Role;
  maxHp: number;
  currentHp: number;
  hand: Card[];
  equipment: Card[]; 
  isEliminated: boolean;
  isInJail: boolean;
}


export type GamePhase = 
  | 'CHECK_PENALTIES'
  | 'DRAW'
  | 'PLAY'
  | 'DISCARD_EXCESS';

export type PendingActionType = 
  | 'RESPOND_TO_BANG'       // Цель должна сыграть Мимо или получить урон
  | 'CHOOSE_GENERAL_STORE_CARD' // Игрок выбирает карту из Магазина
  | 'RESPOND_TO_INDIANS'    // Игрок должен сыграть Бэнг или получить урон
  | 'RESPOND_TO_DUEL'       // Игрок должен сыграть Бэнг или получить урон
  | 'CHOOSE_CARD_TO_STEAL'  // Атакующий должен выбрать чужую карту (Паника)
  | 'CHOOSE_CARD_TO_DISCARD' // Атакующий должен выбрать чужую карту (Красотка)
  | 'CHOOSE_DRAW_SOURCE'    // Персонаж выбирает источник первой карты набора
  | 'RESOLVE_BLACK_JACK_DRAW' // Бешеный Пёс показывает вторую карту набора
  | 'CHOOSE_KIT_CARSON_CARD' // Кит Карсон выбирает карту, которую вернуть в колоду
  | 'CHOOSE_LUCKY_DUKE_CHECK' // Счастливчик Люк выбирает карту проверки
  | 'CHOOSE_SID_KETCHUM_DISCARD' // Том Кетчум выбирает 2 карты для лечения
  | 'CHECK_JAIL'           // Проверка тюрьмы в начале хода (до набора)
  | 'CHECK_DYNAMITE';      // Проверка динамита в начале хода (до набора), раньше тюрьмы

export interface PendingAction {
  type: PendingActionType;
  targetId: string;    // ОТ КОГО мы ждем действия? (например, в кого стреляли)
  sourceId?: string;   // КТО инициатор? (кто стрелял)
  cardId?: string;     // Какая карта вызвала это?
  queueTargetIds?: string[]; // Цели которые должны ответить
  barrelCheckUsed?: boolean; // Одна проверка бочки
  jourdonnaisCheckUsed?: boolean; // Встроенная проверка Человека-без-Имени
  missedRequired?: number; // Сколько карт "Мимо!" нужно для отмены
  missedPlayed?: number; // Сколько уже сыграно
  checkCards?: Card[]; // Две карты проверки Счастливчика Люка
  revealedCards?: Card[]; // Карты, открытые для выбора (например Кит Карсон)
  selectedCardIds?: string[]; // Выбранные карты в многошаговых действиях
  drawSource?: 'deck' | 'discard' | 'player';
}

export interface GameState {
  players: Player[];
  activePlayerId: string;
  deck: Card[];
  discard: Card[];
  phase: GamePhase;
  targetingCardId: string | null;
  bangsPlayedThisTurn: number;
  generalStoreCards: Card[];
  
  pendingAction: PendingAction | null; 
}
