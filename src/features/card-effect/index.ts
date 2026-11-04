import { applyBeerEffect } from "./beer";
import type { Card, GameState, Player } from "../../shared/types/game";
import { applyBangEffect } from "./bang";
import { applyMissedEffect } from "./missed";
import { applyBangResponseEffect } from "./bangResponse";
import { applySaloonEffect } from "./saloon";
import { applyStagecoachEffect } from "./stagecoach";
import { applyWellsFargoEffect } from "./wellsFargo";
import { applyGatlingEffect } from "./gatling";
import { applyIndiansEffect } from "./indians";
import { applyGeneralStoreEffect } from "./generalStore";
import { applyPanicEffect } from "./panic";
import { applyCatBalouEffect } from "./catBalou";
import { applyJailEffect } from "./jail";
import { applyDuelEffect, applyDuelBangDiscardEffect } from "./duel";
import { canUseCardAsMissed } from "../character-logic/cardRules";

export const resolveCardEffect = (
  card: Card,
  player: Player,
  state: GameState,
  targetId?: string
): Partial<GameState> => {
  switch (card.effectType) {
    case 'BEER':
      return applyBeerEffect(state, player);

    case 'BANG':
      if (state.pendingAction?.type === 'RESPOND_TO_BANG' && canUseCardAsMissed(card, player)) {
        return applyMissedEffect(state);
      }
      if (state.pendingAction?.type === 'RESPOND_TO_INDIANS') {
        return applyBangResponseEffect(state);
      }
      if (state.pendingAction?.type === 'RESPOND_TO_DUEL') {
        return applyDuelBangDiscardEffect(state);
      }
      if (!targetId) return {};
      return applyBangEffect(state, targetId, player.id);

    case 'MISSED':
      if (state.pendingAction?.type === 'RESPOND_TO_INDIANS' && player.characterId === 'calamity_janet') {
        return applyBangResponseEffect(state);
      }
      if (state.pendingAction?.type === 'RESPOND_TO_DUEL' && player.characterId === 'calamity_janet') {
        return applyDuelBangDiscardEffect(state);
      }
      if (!state.pendingAction && player.characterId === 'calamity_janet') {
        if (!targetId) return {};
        return applyBangEffect(state, targetId, player.id);
      }
      return applyMissedEffect(state);

    case 'SALOON':
      return applySaloonEffect(state);

    case 'STAGECOACH':
      return applyStagecoachEffect(state, player);

    case 'WELLS_FARGO':
      return applyWellsFargoEffect(state, player);

    case 'GATLING':
      return applyGatlingEffect(state, player.id);

    case 'INDIANS':
      return applyIndiansEffect(state, player.id);

    case 'DUEL':
      if (!targetId) return {};
      return applyDuelEffect(state, player.id, targetId);

    case 'GENERAL_STORE':
      return applyGeneralStoreEffect(state, player.id);

    case 'PANIC':
      if (!targetId) return {};
      return applyPanicEffect(state, player.id, targetId);

    case 'CAT_BALOU':
      if (!targetId) return {};
      return applyCatBalouEffect(state, player.id, targetId);

    case 'JAIL':
      if (!targetId) return {};
      return applyJailEffect(state, player, targetId);

    default:
      return {};
  }
};
