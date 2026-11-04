import type { Card, CharacterId, Role } from '../../../shared/types/game';

export type TooltipContent =
  | { type: 'card'; card: Card }
  | { type: 'character'; characterId: CharacterId; name: string; hp: number; description: string }
  | { type: 'role'; role: Role | null; revealed: boolean };
