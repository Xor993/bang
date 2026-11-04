import { useEffect } from 'react';
import { getVisiblePlayerId, isImmediateChoicePendingAction } from '../shared/pendingActions';
import { useGameStore } from '../store/useGameStore';
import { Hand } from '../features/controls/Hand';
import {
  ActionDock,
  BlackJackPanel,
  CharacterDrawSourcePanel,
  DiscardPhaseBanner,
  EndTurnPanel,
  GameBackLink,
  GameLoadingScreen,
  GameTableArena,
  GeneralStoreModal,
  KitCarsonPanel,
  LuckyDukeCheckPanel,
  OpponentCardPickModal,
  RespondToBangPanel,
  RespondToIndiansPanel,
  RespondToDuelPanel,
  SheriffCornerBadge,
  SidKetchumHealButton,
  SidKetchumPanel,
  TurnTransitionOverlay,
  WinnerOverlay,
  GameTooltipPanel,
} from '../features/game-ui';

export function GamePage() {
  const {
    players,
    discard,
    initGame,
    endTurn,
    activePlayerId,
    isLoading,
    isTurnTransitionVisible,
    acknowledgeTurn,
    pendingAction,
    phase,
    resolvePendingAction,
    chooseGeneralStoreCard,
    choosePanicSteal,
    chooseCatBalouDiscard,
    generalStoreCards,
    winnerMessage,
    checkJail,
    checkDynamite,
    lastDrawnCardForCheck,
    drawBarrelCheck,
    drawJourdonnaisCheck,
    resolveBarrelCheck,
    chooseLuckyDukeCheck,
    chooseDrawSource,
    resolveBlackJackDraw,
    chooseKitCarsonReturn,
    startSidKetchumHeal,
    chooseSidKetchumDiscard,
  } = useGameStore();

  useEffect(() => {
    void initGame('Даниил');
  }, [initGame]);

  if (isLoading) return <GameLoadingScreen />;
  if (players.length === 0) return null;

  const activePlayer = players.find((player) => player.id === activePlayerId);
  const visiblePlayerId = getVisiblePlayerId({ activePlayerId, pendingAction });
  const visiblePlayer = players.find((player) => player.id === visiblePlayerId);
  const cardsToDiscard = activePlayer ? Math.max(0, activePlayer.hand.length - activePlayer.currentHp) : 0;
  const sourcePlayer = pendingAction?.sourceId
    ? players.find((player) => player.id === pendingAction.sourceId)
    : null;
  const isImmediateChoiceAction = isImmediateChoicePendingAction(pendingAction);
  const hasWinner = Boolean(winnerMessage);
  const canShowActionDockPanels = !isTurnTransitionVisible && !hasWinner;
  const canShowChoicePanels = !hasWinner;
  const showSidKetchumHeal = canShowActionDockPanels && !pendingAction && phase === 'PLAY' && activePlayer;
  const showEndTurn = canShowActionDockPanels && !pendingAction && phase !== 'DRAW';
  const showDiscardBanner =
    phase === 'DISCARD_EXCESS' && !isTurnTransitionVisible && !hasWinner && activePlayer && cardsToDiscard > 0;

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/game-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <SheriffCornerBadge players={players} />
      <GameTableArena players={players} activePlayerId={activePlayerId} />

      <ActionDock>
        {canShowActionDockPanels && pendingAction?.type === 'RESPOND_TO_BANG' && visiblePlayer && (
          <RespondToBangPanel
            barrelCheckUsed={pendingAction.barrelCheckUsed}
            jourdonnaisCheckUsed={pendingAction.jourdonnaisCheckUsed}
            hasPendingCheckChoice={Boolean(pendingAction.checkCards?.length)}
            visiblePlayer={visiblePlayer}
            lastDrawnCardForCheck={lastDrawnCardForCheck}
            onTakeDamage={resolvePendingAction}
            onDrawBarrel={drawBarrelCheck}
            onDrawJourdonnais={drawJourdonnaisCheck}
            onResolveBarrel={resolveBarrelCheck}
          />
        )}

        {canShowActionDockPanels && pendingAction?.type === 'RESPOND_TO_INDIANS' && visiblePlayer && (
          <RespondToIndiansPanel onAcceptDamage={resolvePendingAction} />
        )}

        {canShowActionDockPanels && pendingAction?.type === 'RESPOND_TO_DUEL' && visiblePlayer && (
          <RespondToDuelPanel onAcceptDamage={resolvePendingAction} />
        )}

        {canShowChoicePanels && pendingAction?.type === 'CHOOSE_GENERAL_STORE_CARD' && visiblePlayer && (
          <GeneralStoreModal
            visiblePlayer={visiblePlayer}
            cards={generalStoreCards}
            onPick={chooseGeneralStoreCard}
          />
        )}

        {canShowChoicePanels && pendingAction?.type === 'CHOOSE_DRAW_SOURCE' && visiblePlayer && (
          <CharacterDrawSourcePanel
            visiblePlayer={visiblePlayer}
            players={players}
            topDiscard={discard[0]}
            onChoose={chooseDrawSource}
          />
        )}

        {canShowChoicePanels && pendingAction?.type === 'RESOLVE_BLACK_JACK_DRAW' && visiblePlayer && (
          <BlackJackPanel
            visiblePlayer={visiblePlayer}
            cards={pendingAction.revealedCards ?? []}
            onContinue={resolveBlackJackDraw}
          />
        )}

        {canShowChoicePanels && pendingAction?.type === 'CHOOSE_KIT_CARSON_CARD' && visiblePlayer && (
          <KitCarsonPanel
            visiblePlayer={visiblePlayer}
            cards={pendingAction.revealedCards ?? []}
            onReturn={chooseKitCarsonReturn}
          />
        )}

        {canShowChoicePanels && pendingAction?.type === 'CHOOSE_SID_KETCHUM_DISCARD' && visiblePlayer && (
          <SidKetchumPanel visiblePlayer={visiblePlayer} onConfirm={chooseSidKetchumDiscard} />
        )}

        {canShowChoicePanels && pendingAction?.checkCards && visiblePlayer && (
          <LuckyDukeCheckPanel visiblePlayer={visiblePlayer} cards={pendingAction.checkCards} onChoose={chooseLuckyDukeCheck} />
        )}

        {canShowChoicePanels && pendingAction?.type === 'CHOOSE_CARD_TO_STEAL' && visiblePlayer && (
          <OpponentCardPickModal
            title={`Выберите, откуда украсть карту у ${visiblePlayer.name}`}
            visiblePlayer={visiblePlayer}
            handButtonLabel={`Взять случайную из руки (${visiblePlayer.hand.length})`}
            onPickHand={() => choosePanicSteal('hand')}
            onPickEquipment={(equipmentCardId) => choosePanicSteal('equipment', equipmentCardId)}
          />
        )}

        {canShowChoicePanels && pendingAction?.type === 'CHOOSE_CARD_TO_DISCARD' && visiblePlayer && (
          <OpponentCardPickModal
            title={`Выберите, какую карту сбросить у ${visiblePlayer.name}`}
            visiblePlayer={visiblePlayer}
            handButtonLabel={`Сбросить случайную из руки (${visiblePlayer.hand.length})`}
            onPickHand={() => chooseCatBalouDiscard('hand')}
            onPickEquipment={(equipmentCardId) => chooseCatBalouDiscard('equipment', equipmentCardId)}
          />
        )}

        {showSidKetchumHeal && (
          <SidKetchumHealButton activePlayer={activePlayer} onHeal={startSidKetchumHeal} />
        )}

        {showEndTurn && (
          <EndTurnPanel phase={phase} onEndTurn={endTurn} />
        )}

        {showDiscardBanner && (
          <DiscardPhaseBanner cardsToDiscard={cardsToDiscard} />
        )}
      </ActionDock>

      <GameBackLink />
      <Hand />

      {isTurnTransitionVisible && visiblePlayer && !hasWinner && !isImmediateChoiceAction && (
        <TurnTransitionOverlay
          visiblePlayer={visiblePlayer}
          pendingAction={pendingAction}
          lastDrawnCardForCheck={lastDrawnCardForCheck}
          sourcePlayer={sourcePlayer ?? null}
          onCheckJail={checkJail}
          onCheckDynamite={checkDynamite}
          onResolveJail={resolvePendingAction}
          onAcknowledgeTurn={acknowledgeTurn}
        />
      )}

      {winnerMessage && <WinnerOverlay message={winnerMessage} />}
      <GameTooltipPanel />
    </div>
  );
}
