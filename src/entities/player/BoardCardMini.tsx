import type { ReactNode } from 'react';
import type { Card, CharacterId, Role } from '../../shared/types/game';
import { getSuitSymbol } from '../../shared/cardUtils';
import { CHARACTERS, getCharacterArtSrc } from '../../shared/data/characters';
import { HoverHint } from '../../features/game-ui/tooltip/HoverHint';
import { EQUIPMENT_ICONS, ROLE_ICONS, ROLE_LABELS } from './playerBoardUtils';

type MiniKind = 'role' | 'role-hidden' | 'character' | 'weapon' | 'equipment' | 'hand-back' | 'empty';

type Props = {
  kind: MiniKind;
  label?: string;
  role?: Role;
  characterId?: CharacterId;
  card?: Card;
  compact?: boolean;
  title?: string;
};

const wrapHint = (node: ReactNode, enabled: boolean, content: Parameters<typeof HoverHint>[0]['content']) => {
  if (!enabled) return node;
  return <HoverHint content={content}>{node}</HoverHint>;
};

export function BoardCardMini({ kind, label, role, characterId, card, compact, title }: Props) {
  const sizeClass = compact ? 'h-[52px] w-[38px]' : 'h-[68px] w-[48px]';
  const textSize = compact ? 'text-[6px]' : 'text-[7px]';

  if (kind === 'empty') {
    return (
      <div
        className={`${sizeClass} rounded-md border border-dashed border-[#5a3d22]/35 bg-[#2a1810]/10`}
        title={title}
      />
    );
  }

  if (kind === 'hand-back') {
    return (
      <div
        className={`${sizeClass} relative overflow-hidden rounded-md border-2 border-[#4a2c1a] bg-gradient-to-br from-[#8b5a2b] via-[#6b4226] to-[#3d2418] shadow-md`}
        title={title}
      >
        <div className="absolute inset-1 rounded-sm border border-[#d4b896]/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-title text-[#f0dcc0] ${compact ? 'text-sm' : 'text-base'}`}>!</span>
        </div>
      </div>
    );
  }

  if (kind === 'role-hidden') {
    return wrapHint(
      <div
        className={`${sizeClass} flex flex-col items-center justify-between rounded-md border-2 border-[#4a2c1a] bg-gradient-to-b from-[#5c4030] to-[#3d2818] p-0.5 shadow-md`}
      >
        <span className={`font-title leading-none text-[#e8d5b8] ${compact ? 'text-sm' : 'text-lg'}`}>?</span>
        <span className={`text-center font-body font-bold uppercase leading-tight text-[#f0e6d2] ${textSize}`}>
          Роль
        </span>
      </div>,
      true,
      { type: 'role', role: null, revealed: false },
    );
  }

  if (kind === 'role' && role) {
    const isSheriff = role === 'sheriff';
    return wrapHint(
      <div
        className={`${sizeClass} flex flex-col items-center justify-between rounded-md border-2 p-0.5 shadow-md ${
          isSheriff
            ? 'border-amber-500 bg-gradient-to-b from-amber-100 to-amber-200'
            : 'border-[#4a2c1a] bg-gradient-to-b from-[#5c4030] to-[#3d2818]'
        }`}
      >
        <span className={`font-title leading-none ${isSheriff ? 'text-amber-700' : 'text-[#e8d5b8]'} ${compact ? 'text-sm' : 'text-lg'}`}>
          {ROLE_ICONS[role]}
        </span>
        <span
          className={`text-center font-body font-bold uppercase leading-tight ${
            isSheriff ? 'text-amber-900' : 'text-[#f0e6d2]'
          } ${textSize}`}
        >
          {ROLE_LABELS[role]}
        </span>
      </div>,
      true,
      { type: 'role', role, revealed: true },
    );
  }

  if (kind === 'character') {
    const character = characterId ? CHARACTERS.find((entry) => entry.id === characterId) : undefined;
    const characterName = character?.name ?? label ?? 'Персонаж';
    const characterHp = character?.hp ?? 4;
    const characterDescription = character?.description ?? 'Описание персонажа недоступно.';
    const characterArtSrc = characterId ? getCharacterArtSrc(characterId) : undefined;
    const characterSizeClass = compact ? 'h-[103px] w-[72px]' : 'h-[139px] w-[96px]';

    return wrapHint(
      <div className={`${characterSizeClass} overflow-hidden rounded-[10px] shadow-lg`}>
        {characterArtSrc ? (
          <img
            src={characterArtSrc}
            alt={characterName}
            className="h-full w-full"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-[10px] border-[3px] border-[#4a2c1a] bg-[#f5ead8]">
            <span className={compact ? 'text-xl' : 'text-2xl'}>🤠</span>
          </div>
        )}
      </div>,
      Boolean(characterId),
      {
        type: 'character',
        characterId: characterId!,
        name: characterName,
        hp: characterHp,
        description: characterDescription,
      },
    );
  }

  const isWeapon = kind === 'weapon';
  const icon = card ? (EQUIPMENT_ICONS[card.effectType] ?? '🃏') : '🔫';

  const cardNode = (
    <div
      className={`${sizeClass} flex flex-col items-center justify-between rounded-md border-2 border-sky-700 bg-gradient-to-b from-sky-50 to-sky-100 p-0.5 shadow-md`}
    >
      <span className={`font-body font-bold uppercase leading-tight text-sky-950 ${textSize}`}>
        {card?.name ?? label}
      </span>
      <span className={compact ? 'text-sm' : 'text-base'}>{icon}</span>
      <div className={`flex w-full items-center justify-between font-bold text-sky-900 ${compact ? 'text-[6px]' : 'text-[7px]'}`}>
        {card && (
          <>
            <span>
              {card.value}
              {getSuitSymbol(card.suit)}
            </span>
            {isWeapon && card.range != null && <span>R{card.range}</span>}
          </>
        )}
      </div>
    </div>
  );

  if (!card) return cardNode;

  return wrapHint(cardNode, true, { type: 'card', card });
}
