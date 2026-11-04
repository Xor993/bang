import { getPlayer } from '../../game';
import { useGame, useGameStore } from '../../store/useGameStore';
import { ActionDockButtons, ActionDockPanel, DockButton } from './ActionDock';
import { CharacterDrawSourcePanel } from './CharacterDrawSourcePanel';
import { CardChoicePanel } from './GameActionPanel';
import { OpponentCardPickModal } from './OpponentCardPickModal';
import { describePrompt } from './promptText';
import { RespondToShotPanel } from './RespondToShotPanel';

/** Панель для текущего запроса игры: что игрок может сделать прямо сейчас (кроме карт с руки). */
export function PromptPanel() {
  const game = useGame();
  const dispatch = useGameStore((store) => store.dispatch);
  const { prompt } = game;
  if (!prompt) return null;

  const actor = getPlayer(game, prompt.actorId);
  const { hint } = describePrompt(game, prompt);
  const takeHit = () => dispatch({ type: 'TAKE_HIT' });

  switch (prompt.kind) {
    case 'TURN_START_CHECK':
      return (
        <ActionDockButtons>
          <DockButton onClick={() => dispatch({ type: 'CHECK_TURN_START' })}>
            Проверить {prompt.reason === 'DYNAMITE' ? '«Динамит»' : '«Тюрьму»'}
          </DockButton>
        </ActionDockButtons>
      );

    case 'RESPOND_TO_SHOT':
      return (
        <RespondToShotPanel
          game={game}
          onTakeHit={takeHit}
          onDefend={(source) => dispatch({ type: 'USE_DEFENSE', source })}
        />
      );

    case 'RESPOND_TO_INDIANS':
    case 'RESPOND_TO_DUEL':
      return (
        <ActionDockButtons>
          <DockButton onClick={takeHit}>Потерять здоровье</DockButton>
        </ActionDockButtons>
      );

    case 'DYING':
      return (
        <ActionDockPanel>
          <p className="max-w-xs font-body text-sm text-white/80">{hint}</p>
          <DockButton className="mt-3" onClick={() => dispatch({ type: 'ACCEPT_DEATH' })}>
            Выбыть из игры
          </DockButton>
        </ActionDockPanel>
      );

    case 'GENERAL_STORE_PICK':
      return (
        <CardChoicePanel
          title={`${actor.name}, выберите карту из «Магазина»`}
          cards={game.generalStore}
          onSelect={(cardId) => dispatch({ type: 'PICK_GENERAL_STORE_CARD', cardId })}
          wrap
        />
      );

    case 'CHOOSE_CHECK_CARD':
      return (
        <CardChoicePanel
          visiblePlayer={actor}
          description={hint}
          cards={prompt.cards}
          onSelect={(cardId) => dispatch({ type: 'CHOOSE_CHECK_CARD', cardId })}
        />
      );

    case 'KIT_CARSON_RETURN':
      return (
        <CardChoicePanel
          visiblePlayer={actor}
          description={hint}
          cards={prompt.cards}
          onSelect={(cardId) => dispatch({ type: 'KIT_CARSON_RETURN', cardId })}
        />
      );

    case 'CHOOSE_DRAW_SOURCE':
      return (
        <CharacterDrawSourcePanel
          game={game}
          player={actor}
          onChoose={(source, playerId) => dispatch({ type: 'CHOOSE_DRAW_SOURCE', source, playerId })}
        />
      );

    case 'CHOOSE_OPPONENT_CARD':
      return (
        <OpponentCardPickModal
          prompt={prompt}
          victim={getPlayer(game, prompt.victimId)}
          onPick={(zone, cardId) => dispatch({ type: 'PICK_OPPONENT_CARD', zone, cardId })}
        />
      );
  }
}
