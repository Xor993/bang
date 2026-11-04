import type { Card, CharacterId, Role } from '../../../game';

export type TooltipContent =
  | { type: 'card'; card: Card }
  | { type: 'character'; characterId: CharacterId }
  | { type: 'role'; role: Role | null; revealed: boolean };
