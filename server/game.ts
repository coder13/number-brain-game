import { InternalMove, PersonalizedGameState, PrivateGameState, PublicMove, User } from './types';

export const newGameState = (players: User[]): PrivateGameState => ({
  type: 'private',
  players,
  internalMoves: [],
  turn: 0,
});


/**
 * Players don't get to know what the other player played.
 * Players get to know all of the moves they played
 * 
 */
export const buildBoardStateForPlayer = (state: PrivateGameState, player: number): PersonalizedGameState => {
  let moves: PublicMove[] = [];
  for (let i = 0; i < 25; i++) {
    let internalMovesForIndex = state.internalMoves.filter((v) => v.index === i).map((v, index) => ({ ...v, when: index }));

    if (!internalMovesForIndex.length) {
      continue;
    }

    // We can use localeCompare since numbers are sort before 'n'
    // Returns sortedMoves with rank of the move with ties
    const sortedMoves = [...internalMovesForIndex].sort((a, b) => a.value.localeCompare(b.value));

    const internalMovesWithRank = sortedMoves.reduce((acc, v) => {
      const lastItem = acc[acc.length - 1];
      const lastItemPos = lastItem?.pos ?? -1;

      return [
        ...acc,
        {
          ...v,
          pos: lastItem?.value === v.value ? lastItemPos : lastItemPos + 1,
        }
      ]
    }, [] as (InternalMove & { when: number; pos: number })[]).sort((a, b) => a.when - b.when);

    moves = [...moves, ...internalMovesWithRank.map((m) => {
      return {
        index: m.index,
        player: m.player,
        pos: m.pos,
        value: m.player === player || m.value === 'n' || state.winner !== undefined ? m.value : undefined,
      }
    })];
  }

  return {
    type: 'personalized',
    moves,
    players: state.players,
    turn: state.turn,
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

    const sortedMoves = moves.sort((a, b) => +b.value - +a.value);
    const winningPlayer = sortedMoves[0].player;
    if (sortedMoves.length === 2) {
      console.log(moves, sortedMoves)
    }

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
    } else if (
      winnerOf(i + 4) === player &&
      winnerOf(i + 8) === player
    ) {
      return player;
    }
  }

  return winner;
}
