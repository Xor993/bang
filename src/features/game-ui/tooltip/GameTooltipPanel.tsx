import {
  formatCardFace,
  getCharacter,
  getCharacterArtSrc,
  HIDDEN_ROLE_DESCRIPTION,
  ROLE_GOALS,
  ROLE_LABELS,
} from '../../../game';
import type { Card as CardType, CharacterId } from '../../../game';
import { getCardGlyph } from '../../../shared/cardArt';
import { useTooltipStore } from './useTooltipStore';

function CardTooltipArt({ card }: { card: CardType }) {
  return (
    <div className="mx-auto flex h-44 w-32 items-center justify-center rounded-xl border-4 border-[#4a2c1a] bg-gradient-to-b from-[#f5ead8] to-[#dcc9a8] shadow-inner">
      <span className="text-6xl">{getCardGlyph(card.kind)}</span>
    </div>
  );
}

function CharacterTooltipArt({ characterId, name }: { characterId: CharacterId; name: string }) {
  const artSrc = getCharacterArtSrc(characterId);

  return (
    <div className="mx-auto flex h-52 w-36 overflow-hidden rounded-xl border-4 border-[#4a2c1a] bg-gradient-to-b from-[#f5ead8] to-[#dcc9a8] shadow-inner">
      <img src={artSrc} alt={name} className="h-full w-full object-contain" draggable={false} />
    </div>
  );
}

function CharacterTooltip({ characterId }: { characterId: CharacterId }) {
  const character = getCharacter(characterId);

  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0">
        <CharacterTooltipArt characterId={characterId} name={character.name} />
      </div>
      <div className="min-w-0 pt-1">
        <h3 className="font-title text-2xl text-bang-red">{character.name}</h3>
        <p className="mt-1 font-body text-sm text-bang-brown/70">Персонаж · здоровье {character.hp}</p>
        <p className="mt-3 font-body text-base leading-relaxed text-bang-brown">{character.description}</p>
      </div>
    </div>
  );
}

function RoleTooltipArt() {
  return (
    <div className="mx-auto flex h-44 w-32 items-center justify-center rounded-xl border-4 border-amber-600 bg-gradient-to-b from-amber-100 to-amber-200 shadow-inner">
      <span className="font-title text-7xl text-amber-800">★</span>
    </div>
  );
}

export function GameTooltipPanel() {
  const content = useTooltipStore((state) => state.content);
  if (!content) return null;

  return (
    <div
      className="pointer-events-none fixed right-6 top-1/2 z-[120] w-[min(520px,42vw)] -translate-y-1/2"
      aria-live="polite"
    >
      <div className="rounded-3xl border-2 border-bang-plate/60 bg-[#f7ead7]/95 px-5 py-5 shadow-2xl backdrop-blur-sm">
        {content.type === 'card' && (
          <>
            <CardTooltipArt card={content.card} />
            <h3 className="mt-4 text-center font-title text-2xl text-bang-red">{content.card.name}</h3>
            <p className="mt-1 text-center font-body text-sm text-bang-brown/70">
              {formatCardFace(content.card)} · {content.card.color === 'blue' ? 'Синяя карта' : 'Коричневая карта'}
              {content.card.range != null ? ` · Дальность ${content.card.range}` : ''}
            </p>
            <p className="mt-3 font-body text-base leading-relaxed text-bang-brown">{content.card.description}</p>
          </>
        )}

        {content.type === 'character' && <CharacterTooltip characterId={content.characterId} />}


        {content.type === 'role' && (
          <>
            <RoleTooltipArt />
            <h3 className="mt-4 text-center font-title text-2xl text-bang-red">
              {content.revealed && content.role ? ROLE_LABELS[content.role] : 'Секретная роль'}
            </h3>
            <p className="mt-3 font-body text-base leading-relaxed text-bang-brown">
              {content.revealed && content.role
                ? ROLE_GOALS[content.role]
                : HIDDEN_ROLE_DESCRIPTION}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
