import type { Card, PendingAction, Player } from '../../shared/types/game';
import { BangButton } from '../../shared/ui/BangButton';
import { Card as GameCard } from '../../entities/card/Card';
import { formatHotSeatRoleLine } from '../../entities/player/playerBoardUtils';
import { checkDynamiteEscape, checkResultFromCard } from '../game-logic/checkUtils';

type Props = {
  visiblePlayer: Player;
  pendingAction: PendingAction | null;
  lastDrawnCardForCheck: Card | null;
  sourcePlayer: Player | null;
  onCheckJail: () => void;
  onCheckDynamite: () => void;
  onResolveJail: () => void;
  onAcknowledgeTurn: () => void;
};

export function TurnTransitionOverlay({
  visiblePlayer,
  pendingAction,
  lastDrawnCardForCheck,
  sourcePlayer,
  onCheckJail,
  onCheckDynamite,
  onResolveJail,
  onAcknowledgeTurn,
}: Props) {
  const dynamiteSafe =
    pendingAction?.type === 'CHECK_DYNAMITE' && lastDrawnCardForCheck
      ? checkDynamiteEscape(checkResultFromCard(lastDrawnCardForCheck))
      : null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border-2 border-bang-plate/70 bg-[#f7ead7] px-10 py-12 text-center shadow-2xl">
        <p className="font-body text-lg uppercase tracking-[0.2em] text-bang-brown/70">
          {pendingAction?.type === 'CHECK_JAIL'
            ? 'Проверка на выход'
            : pendingAction?.type === 'CHECK_DYNAMITE'
              ? 'Проверка динамита'
              : pendingAction
                ? 'Реакция игрока'
                : 'Hot Seat'}
        </p>
        <h2 className="mt-4 font-title text-6xl text-bang-red">
          {pendingAction?.type === 'CHECK_JAIL'
            ? lastDrawnCardForCheck
              ? lastDrawnCardForCheck.suit === 'hearts'
                ? 'СВОБОДА!'
                : 'НЕУДАЧА'
              : 'Тюрьма'
            : pendingAction?.type === 'CHECK_DYNAMITE'
              ? lastDrawnCardForCheck
                ? dynamiteSafe
                  ? 'ПЕРЕДАЧА'
                  : 'ВЗРЫВ!'
                : 'Динамит'
              : pendingAction
                ? 'Нужен ответ'
                : 'Ход игрока'}
        </h2>
        <p className="mt-2 font-title text-5xl text-bang-brown">{visiblePlayer.name}</p>

        {pendingAction?.type === 'CHECK_JAIL' && lastDrawnCardForCheck && (
          <div className="my-8 flex items-center justify-center gap-6">
            <GameCard card={lastDrawnCardForCheck} className="scale-125" />
            <div className="text-left">
              <p
                className={`font-title text-2xl ${lastDrawnCardForCheck.suit === 'hearts' ? 'text-green-600' : 'text-red-600'}`}
              >
                {lastDrawnCardForCheck.suit === 'hearts' ? 'Черви!' : 'Не черви.'}
              </p>
              <p className="mt-2 font-body text-lg text-bang-brown">
                {lastDrawnCardForCheck.suit === 'hearts'
                  ? 'Ты свободен. Возьми 2 карты и продолжи ход.'
                  : 'Тюрьма уходит в сброс, ход пропущен целиком (фазы набора и розыгрыша нет).'}
              </p>
            </div>
          </div>
        )}

        {pendingAction?.type === 'CHECK_DYNAMITE' && lastDrawnCardForCheck && (
          <div className="my-8 flex items-center justify-center gap-6">
            <GameCard card={lastDrawnCardForCheck} className="scale-125" />
            <div className="text-left">
              <p className={`font-title text-2xl ${dynamiteSafe ? 'text-amber-700' : 'text-red-600'}`}>
                {dynamiteSafe ? 'Динамит не взорвался' : 'Взрыв! −3 жизни'}
              </p>
              <p className="mt-2 font-body text-lg text-bang-brown">
                {dynamiteSafe
                  ? 'Карта уходит соседу слева. Затем набор с колоды (если нет тюрьмы).'
                  : 'Карта «Динамит» в сброс. Затем набор или тюрьма, если висит.'}
              </p>
            </div>
          </div>
        )}

        <p className="mt-6 font-body text-2xl text-bang-brown">
          {formatHotSeatRoleLine(visiblePlayer)}
        </p>
        <p className="mt-3 font-body text-lg text-bang-brown/80">
          {pendingAction?.type === 'CHECK_JAIL'
            ? lastDrawnCardForCheck
              ? 'Нажми кнопку, чтобы применить результат.'
              : 'Нажми кнопку, чтобы вытянуть карту для проверки.'
            : pendingAction?.type === 'CHECK_DYNAMITE'
              ? lastDrawnCardForCheck
                ? 'Нажми кнопку, чтобы применить результат динамита.'
                : 'Нажми кнопку, чтобы вытянуть карту для проверки динамита.'
              : pendingAction?.type === 'RESPOND_TO_BANG'
                ? `${sourcePlayer?.name ?? 'Соперник'} ждёт ответа. Можете разыграть "Мимо!" или принять урон.`
                : pendingAction?.type === 'RESPOND_TO_INDIANS'
                  ? `${sourcePlayer?.name ?? 'Соперник'} сыграл «Индейцы!». Сбросьте «Бэнг!» с руки или примите 1 урон.`
                  : pendingAction?.type === 'RESPOND_TO_DUEL'
                    ? `${sourcePlayer?.name ?? 'Соперник'} вызвал вас на дуэль. По очереди сбрасывайте «Бэнг!» или примите 1 урон.`
                    : 'Передайте экран следующему игроку и откройте ход только когда будете готовы.'}
        </p>

        <div className="mt-10">
          <BangButton
            className="scale-75"
            onClick={() => {
              if (pendingAction?.type === 'CHECK_JAIL') {
                if (!lastDrawnCardForCheck) onCheckJail();
                else onResolveJail();
              } else if (pendingAction?.type === 'CHECK_DYNAMITE') {
                if (!lastDrawnCardForCheck) onCheckDynamite();
                else onResolveJail();
              } else {
                onAcknowledgeTurn();
              }
            }}
          >
            {pendingAction?.type === 'CHECK_JAIL'
              ? lastDrawnCardForCheck
                ? 'Продолжить'
                : 'Вытянуть карту'
              : pendingAction?.type === 'CHECK_DYNAMITE'
                ? lastDrawnCardForCheck
                  ? 'Продолжить'
                  : 'Вытянуть карту'
                : pendingAction
                  ? 'Показать руку'
                  : 'Начать ход'}
          </BangButton>
        </div>
      </div>
    </div>
  );
}
