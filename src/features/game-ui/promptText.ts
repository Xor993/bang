import { getPlayer } from '../../game';
import type { GameState, Prompt } from '../../game';

/** Заголовок и пояснение к тому, чего игра ждёт от игрока. */
export function describePrompt(game: GameState, prompt: Prompt | null): { title: string; hint: string } {
  const name = (playerId: string) => getPlayer(game, playerId).name;

  if (!prompt) {
    return game.phase === 'DISCARD'
      ? { title: 'Сброс', hint: 'Сбросьте лишние карты: на руке может остаться не больше карт, чем здоровья.' }
      : { title: 'Ваш ход', hint: 'Возьмите 2 карты из колоды, затем разыгрывайте карты.' };
  }

  switch (prompt.kind) {
    case 'TURN_START_CHECK':
      return prompt.reason === 'DYNAMITE'
        ? { title: '«Динамит»', hint: 'Проверка: пика от 2 до 9 — взрыв и −3 здоровья, иначе «Динамит» уйдёт соседу.' }
        : { title: '«Тюрьма»', hint: 'Проверка: черва — свобода, иначе ход пропущен.' };
    case 'RESPOND_TO_SHOT': {
      const what = prompt.cardKind === 'GATLING' ? '«Гатлинг»' : '«Бэнг!»';
      const left = prompt.missedNeeded - prompt.missedPlayed;
      const missed = left > 1 ? `${left} карты «Мимо!»` : '«Мимо!»';
      return { title: 'В вас стреляют', hint: `${name(prompt.attackerId)} играет ${what}. Сыграйте ${missed}, проверьте «Бочку» или потеряйте здоровье.` };
    }
    case 'RESPOND_TO_INDIANS':
      return { title: '«Индейцы!»', hint: `${name(prompt.attackerId)} сыграл «Индейцев». Сбросьте «Бэнг!» или потеряйте 1 здоровье.` };
    case 'RESPOND_TO_DUEL':
      return { title: '«Дуэль»', hint: `Дуэль с игроком ${name(prompt.opponentId)}. Сбросьте «Бэнг!» или потеряйте 1 здоровье.` };
    case 'GENERAL_STORE_PICK':
      return { title: '«Магазин»', hint: 'Выберите одну из открытых карт.' };
    case 'CHOOSE_OPPONENT_CARD':
      return {
        title: prompt.cardKind === 'PANIC' ? '«Паника!»' : '«Красотка»',
        hint: `Выберите карту игрока ${name(prompt.victimId)}: случайную с руки или из игры.`,
      };
    case 'CHOOSE_CHECK_CARD':
      return { title: 'Проверка', hint: 'Счастливчик Люк: выберите одну из двух карт проверки.' };
    case 'CHOOSE_DRAW_SOURCE':
      return { title: 'Набор', hint: 'Выберите, откуда взять первую карту. Вторая — из колоды.' };
    case 'KIT_CARSON_RETURN':
      return { title: 'Набор', hint: 'Кит Карсон: выберите карту, которая вернётся на верх колоды. Две другие — вам.' };
    case 'DYING':
      return { title: 'Смертельное ранение', hint: 'Сыграйте «Отдых», чтобы спастись, или выбывайте из игры.' };
  }
}
