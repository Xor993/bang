import type { Card as CardType, EffectType } from '../../shared/types/game';
import { getCardArtSrc, getEffectGlyphEmoji } from '../../shared/cardArt';
import { getSuitSymbol, isRedSuit } from '../../shared/cardUtils';
import { HoverHint } from '../../features/game-ui/tooltip/HoverHint';

const SIMPLE_EFFECTS_WITHOUT_RULE_TEXT = new Set<EffectType>(['BANG', 'MISSED', 'BEER', 'WEAPON']);

interface Props {
  card: CardType;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

function FrameNotches({ isBlue }: { isBlue: boolean }) {
  if (isBlue) return null;
  const hole =
    'pointer-events-none absolute z-20 h-1.5 w-1.5 rounded-full bg-white ring-1 ring-black/15';
  const positions = [
    'left-[15%] top-0 -translate-y-1/2',
    'left-[42%] top-0 -translate-y-1/2',
    'left-[70%] top-0 -translate-y-1/2',
    'right-0 top-[20%] translate-x-1/2',
    'right-0 top-[55%] translate-x-1/2',
    'left-[20%] bottom-0 translate-y-1/2',
    'left-[55%] bottom-0 translate-y-1/2',
    'left-[82%] bottom-0 translate-y-1/2',
    'left-0 top-[25%] -translate-x-1/2',
    'left-0 top-[60%] -translate-x-1/2',
  ];
  return (
    <>
      {positions.map((pos) => (
        <span key={pos} className={`${hole} ${pos}`} aria-hidden />
      ))}
    </>
  );
}

function MainIllustration({ effectType, compact }: { effectType: EffectType; compact: boolean }) {
  const artSrc = getCardArtSrc(effectType);
  if (artSrc) {
    return (
      <div className="relative min-h-0 w-full flex-1">
        <img
          src={artSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-contain object-center"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center">
      <span className={`select-none opacity-90 ${compact ? 'text-4xl' : 'text-6xl'}`}>
        {getEffectGlyphEmoji(effectType)}
      </span>
    </div>
  );
}

function RulePanel({
  card,
  compact,
}: {
  card: CardType;
  compact: boolean;
}) {
  if (SIMPLE_EFFECTS_WITHOUT_RULE_TEXT.has(card.effectType)) return null;

  return (
    <div
      className={`mx-auto flex w-[82%] shrink-0 items-center justify-center gap-1 rounded-sm border border-neutral-400 bg-white/95 px-1 text-center font-body leading-tight text-neutral-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] ${
        compact ? 'min-h-[1.65rem] text-[5.5px]' : 'min-h-[2rem] text-[6px]'
      }`}
      title={card.description}
    >
      <span className={compact ? 'text-xs' : 'text-sm'} aria-hidden>
        {getEffectGlyphEmoji(card.effectType)}
      </span>
      <span
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {card.description}
      </span>
    </div>
  );
}

export function Card({ card, onClick, className = '', compact = false }: Props) {
  const hasRedSuit = isRedSuit(card.suit);
  const isBlue = card.color === 'blue';
  const hasRulePanel = !SIMPLE_EFFECTS_WITHOUT_RULE_TEXT.has(card.effectType);

  const frameClass = isBlue
    ? 'border-[5px] border-sky-600 bg-white'
    : 'border-[6px] border-[#4a2c1a] bg-white';

  const titleClass = isBlue ? 'text-[#5a2f18]' : 'text-[#3d2418]';
  const suitColor = hasRedSuit ? 'text-red-700' : 'text-neutral-900';

  const pad = compact ? 'px-1 pb-1 pt-1' : 'px-1.5 pb-1 pt-1.5';

  return (
    <HoverHint content={{ type: 'card', card }}>
      <div
        onClick={onClick}
        className={`relative h-48 w-32 shrink-0 select-none rounded-xl bg-white p-[3px] shadow-2xl transition-all duration-300 active:scale-95 ${
          compact ? '' : 'hover:-translate-y-12 hover:z-50'
        } ${className} ${onClick ? 'cursor-pointer' : ''}`}
      >
      <div className={`relative flex h-full w-full flex-col overflow-hidden rounded-[10px] ${frameClass}`}>
        <FrameNotches isBlue={isBlue} />

        <div className={`relative z-0 flex min-h-0 flex-1 flex-col ${pad}`}>
          <h3
            className={`shrink-0 text-center font-title uppercase leading-none tracking-wide ${titleClass} ${
              compact ? 'pb-0.5 text-[8px]' : 'pb-1 text-[12px]'
            }`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {card.name}
          </h3>

          <div className={`flex min-h-0 flex-1 ${hasRulePanel ? 'pb-1' : 'pb-0.5'}`}>
            <MainIllustration effectType={card.effectType} compact={compact} />
          </div>

          <RulePanel card={card} compact={compact} />

          <div className="relative mt-0.5 flex shrink-0 items-end justify-between">
            <div
              className={`flex shrink-0 items-baseline gap-0.5 font-bold leading-none ${suitColor} ${
                compact ? 'text-xs' : 'text-sm'
              }`}
            >
              <span>{card.value}</span>
              <span className={compact ? 'text-[10px]' : 'text-xs'}>{getSuitSymbol(card.suit)}</span>
            </div>

            {SIMPLE_EFFECTS_WITHOUT_RULE_TEXT.has(card.effectType) && (
              <span className={`leading-none opacity-75 ${compact ? 'text-sm' : 'text-base'}`} aria-hidden>
                {getEffectGlyphEmoji(card.effectType)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
    </HoverHint>
  );
}
