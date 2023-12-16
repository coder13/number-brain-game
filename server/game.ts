import { PersonalizedGameState, PrivateGameState, User } from './types';

export const newGameState = ({ player1, player2 }: {
  player1: User,
  player2: User,
}): PrivateGameState => ({
  type: 'private',
  players: [player1, player2],
  internalMoves: [],
  turn: 0,
});


/**
 * Players don't get to know what the other player played.
 * Players get to know all of the moves they played
 * 
 */
export const buildBoardStateForPlayer = (state: PrivateGameState, player: number): PersonalizedGameState => {
  if (player < 0) { // spectator
    return {
      type: 'personalized',
      board: [],
      players: state.players,
      turn: state.turn,
      valuesUsed: [],
      winner: state.winner,
    }
  }

  const allValuesUsed = state.internalMoves.filter((v) => v.player === player).map((v) => v.value);

  const board = [];
  for (let i = 0; i < 25; i++) {
    const moves = state.internalMoves.filter((v) => v.index === i);

    if (!moves.length) {
      continue;
    }

    if (moves.some((m) => m.value === 'n')) {
      board.push({
        index: i,
        owner: -2,
      });
      continue;
    }

    const firstMove = moves[0];
    if (moves.length === 1 && firstMove.player === player) {
      // they get to know the value because it's their's
      board.push({
        index: i,
        owner: player,
        value: firstMove.value,
      });
      continue;
    } else if (moves.length === 1 && firstMove.player !== player) {
      // They get to know who played it but not the value
      board.push({
        index: i,
        owner: firstMove.player,
      });
      continue;
    }

    const secondMove = moves[1];

    const draw = firstMove.value === secondMove.value;
    if (draw) {
      board.push({
        index: i,
        owner: -1,
        value: firstMove.value,
      });
      continue;
    }

    const winningMove = secondMove.value > firstMove.value ? secondMove : firstMove;

    const playersMove = moves.find((m) => m.player === player);

    if (winningMove.player === player) {
      board.push({
        index: i,
        owner: player,
        value: winningMove.value,
      });
      continue;
    } else {
      board.push({
        index: i,
        owner: winningMove.player,
        value: playersMove?.value,
      });
      continue;
    }
  }

  return {
    type: 'personalized',
    board,
    players: state.players,
    turn: state.turn,
    valuesUsed: allValuesUsed,
    winner: state.winner,
  }
}

export const determineWinner = (state: PrivateGameState): number | undefined => {
  let winner = undefined;

  const winnerCache = new Map<number, number>();
  const winnerOf = (index: number) => {
    if (winnerCache.has(index)) {
      return winnerCache.get(index);
    }

    const moves = state.internalMoves.filter((v) => v.index === index);

    if (!moves.length || moves.some((m) => m.value === 'n') || moves?.[0]?.value === moves?.[1]?.value) {
      return undefined;
    }

    const winner = moves.sort((a, b) => +b.value - +a.value);
    const winningPlayer = winner[0].player;

    winnerCache.set(index, winningPlayer);
    return winningPlayer;
  }

  for (let i = 0; i < 25; i++) {
    const moves = state.internalMoves.filter((v) => v.index === i);

    if (!moves.length) {
      continue;
    }

    const player = winnerOf(i);

    if (player === undefined) {
      continue;
    }

    if (i % 5 < 3 && winnerOf(i + 1) === player && winnerOf(i + 2) === player) {
      return player;
    } else if (
      i < 15 &&
      winnerOf(i + 5) === player &&
      winnerOf(i + 10) === player
    ) {
      return player;
    } else if (
      i % 5 < 3 && i < 15 &&
      winnerOf(i + 6) === player &&
      winnerOf(i + 12) === player
    ) {
      return player;
    }
  }

  return winner;
}
