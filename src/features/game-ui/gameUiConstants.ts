import type { CSSProperties } from 'react';

const POSITION_LAYOUTS: Record<number, string[]> = {
  2: [
    'bottom-[-200px] left-1/2 -translate-x-1/2 scale-105',
    'top-[-160px] left-1/2 -translate-x-1/2',
  ],
  3: [
    'bottom-[-200px] left-1/2 -translate-x-1/2 scale-105',
    'top-[20px] left-[80px]',
    'top-[20px] right-[80px]',
  ],
  4: [
    'bottom-[-200px] left-1/2 -translate-x-1/2 scale-105',
    'top-1/2 right-[-60px] -translate-y-1/2',
    'top-[-160px] left-1/2 -translate-x-1/2',
    'top-1/2 left-[-60px] -translate-y-1/2',
  ],
};

export type PlayerStationPlacement = {
  className: string;
  style?: CSSProperties;
};

/** Раскладка мест за столом: пресет для 4 игроков, для 5–7 — по эллипсу вокруг стола. */
export const getPlayerStationPlacement = (
  playerCount: number,
  relativeIndex: number,
): PlayerStationPlacement => {
  const preset = POSITION_LAYOUTS[playerCount]?.[relativeIndex];
  if (preset) {
    return { className: preset };
  }

  const radiusX = 540;
  const radiusY = 300;
  const step = (2 * Math.PI) / playerCount;
  const angle = relativeIndex * step + Math.PI / 2;
  const x = Math.cos(angle) * radiusX;
  const y = Math.sin(angle) * radiusY;
  const scale = playerCount > 6 ? 'scale-90' : '';

  return {
    className: `left-1/2 top-1/2 ${scale}`.trim(),
    style: { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` },
  };
};
