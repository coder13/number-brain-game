import { match } from "ts-pattern";
import { GameState } from "../../types";
import { Tile } from "./types";
import { Colors } from "../elements/Tile/types";

type PlayerInt = 0 | 1 | 2 | 3;

/**
 * Builds a board state converting list of moves into a map of tiles.
 * These tiles are summarizes of moves at a given index and position. They can share multiple colors if there is a tie.
 * @param moves 
 * @returns 
 */
export const buildBoardState = (
  moves: GameState['moves']
): Record<number, Tile[]> => {
  const newBoard = {} as Record<number, Tile[]>;

  for (let index = 0; index < 25; index++) {
    const allMovesForIndex = moves.filter((v) => v.index === index);
    if (allMovesForIndex.length === 0) {
      continue;
    }

    if (!newBoard[index]) {
      newBoard[index] = [];
    }

    const positions = [...new Set(allMovesForIndex.map((m) => m.pos))];

    positions.forEach((pos) => {
      const movesAtPos = allMovesForIndex.filter((m) => m.pos === pos);
      const value = allMovesForIndex.find((m) => !!m.value && m.pos === pos)?.value;

      const playersTiedWith = movesAtPos.map((m) => m.player);

      newBoard[index].push({
        index,
        value,
        pos,
        colorsPlayed: playersTiedWith.map((player) => match<PlayerInt, Colors>(player as PlayerInt)
          .with(0, () => 'red')
          .with(1, () => 'blue')
          .with(2, () => 'green')
          .with(3, () => 'yellow')
          .exhaustive()),
      })
    })
  }

  return newBoard;
};
