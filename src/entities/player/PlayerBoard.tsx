import { isInJail, ROLE_LABELS } from '../../game';
import type { Player } from '../../game';
import { BoardCardMini } from './BoardCardMini';
import { HealthBullets } from './HealthBullets';
import { isRoleRevealed, splitInPlayCards } from './playerBoardUtils';

type Props = {
  player: Player;
  isActivePlayer: boolean;
  isValidTarget: boolean;
  compact?: boolean;
  onClick?: () => void;
};

export function PlayerBoard({ player, isActivePlayer, isValidTarget, compact, onClick }: Props) {
  const { weapon, tableCards } = splitInPlayCards(player.inPlay);
  const handPreviewCount = Math.min(player.hand.length, 3);
  const hiddenHandCount = Math.max(0, player.hand.length - 3);
  const roleRevealed = isRoleRevealed(player);

  return (
    <div
      className={`relative flex flex-col items-center ${onClick ? 'cursor-pointer' : ''} ${
        player.isEliminated ? 'opacity-45 grayscale' : ''
      }`}
      onClick={onClick}
    >
      {tableCards.length > 0 && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 flex -translate-x-1/2 items-end justify-center gap-1 px-1">
          {tableCards.map((item, index) => (
            <div
              key={item.id}
              className="pointer-events-auto transition-transform hover:-translate-y-1"
              style={{
                transform: `rotate(${(index - (tableCards.length - 1) / 2) * 8}deg) translateY(${Math.abs(index - (tableCards.length - 1) / 2) * -2}px)`,
                zIndex: index,
              }}
            >
              <BoardCardMini kind="equipment" card={item} compact={compact} title={item.description} />
            </div>
          ))}
        </div>
      )}

      <div
        className={`relative rounded-2xl border-4 shadow-2xl transition-all ${
          isValidTarget
            ? 'border-red-500 ring-4 ring-red-400/50'
            : isActivePlayer
              ? 'border-amber-600/80 ring-2 ring-amber-400/40'
              : 'border-[#5a3d22]'
        } ${compact ? 'p-1.5' : 'p-2'}`}
        style={{
          background: 'linear-gradient(165deg, #c9a66b 0%, #a67c42 35%, #7a552e 70%, #5c3d22 100%)',
          boxShadow: 'inset 0 2px 8px rgba(255,240,210,0.25), inset 0 -4px 12px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.45)',
        }}
      >
        <div
          className={`rounded-xl border border-[#3d2818]/50 bg-[#2a1810]/15 ${
            compact ? 'px-1.5 py-1.5' : 'px-2 py-2'
          }`}
        >
          <div className="mb-1.5 flex items-start justify-center gap-1.5">
            {roleRevealed ? (
              <BoardCardMini
                kind="role"
                role={player.role}
                compact={compact}
                title={
                  player.isEliminated && player.role !== 'sheriff'
                    ? `${ROLE_LABELS[player.role]} (раскрыта после смерти)`
                    : undefined
                }
              />
            ) : (
              <BoardCardMini kind="role-hidden" compact={compact} />
            )}

            <div className="flex flex-col items-center gap-1">
              <BoardCardMini
                kind="character"
                characterId={player.characterId}
                compact={compact}
              />
              <HealthBullets currentHp={player.hp} maxHp={player.maxHp} compact={compact} />
            </div>

            {weapon ? (
              <BoardCardMini kind="weapon" card={weapon} compact={compact} title={weapon.description} />
            ) : (
              <BoardCardMini kind="empty" compact={compact} title="Нет оружия" />
            )}
          </div>

          {!isActivePlayer && (
            <div
              className={`flex items-center justify-center gap-1 rounded-lg border border-[#3d2818]/30 bg-[#1a0f08]/20 ${
                compact ? 'px-1 py-1' : 'px-1.5 py-1.5'
              }`}
            >
              {Array.from({ length: 3 }).map((_, index) =>
                index < handPreviewCount ? (
                  <BoardCardMini key={index} kind="hand-back" compact={compact} title="Скрытая карта" />
                ) : (
                  <BoardCardMini key={index} kind="empty" compact={compact} />
                ),
              )}
              {hiddenHandCount > 0 && (
                <span
                  className={`ml-0.5 rounded-full bg-black/50 px-1.5 font-body font-bold text-amber-200 ${
                    compact ? 'text-[8px]' : 'text-[9px]'
                  }`}
                >
                  +{hiddenHandCount}
                </span>
              )}
              {player.hand.length === 0 && (
                <span className={`font-body text-[#f0e6d2]/60 ${compact ? 'text-[7px]' : 'text-[8px]'}`}>0</span>
              )}
            </div>
          )}
        </div>

        {isInJail(player) && (
          <div
            className={`absolute -right-1 -top-1 rounded-full border-2 border-neutral-400 bg-neutral-800 font-body font-bold text-white ${
              compact ? 'px-1 py-0 text-[7px]' : 'px-1.5 py-0.5 text-[8px]'
            }`}
          >
            Тюрьма
          </div>
        )}

        {isValidTarget && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className={`font-black text-red-500 drop-shadow-lg ${compact ? 'text-3xl' : 'text-4xl'}`}>⌖</span>
          </div>
        )}
      </div>

      <div
        className={`mt-1 rounded-full border border-white/15 bg-black/65 font-body font-bold text-white shadow-lg ${
          compact ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-[11px]'
        }`}
      >
        {player.name}
      </div>
    </div>
  );
}
