import { match } from "ts-pattern";
import { GameState } from "../../types";

export enum Colors {
  red = "red",
  blue = "blue",
  green = "green",
  purple = "purple",
  draw = "gray",
  nuked = "black",
}

export type BoardCell = {
  index: number;
  value?: string;
  color?: Colors;
};


export const buildBoardState = (
  moves: GameState['board']
): BoardCell[] => {
  const newBoard = Array.from({ length: 25 }).fill(
    {}
  ).map((_, index) => ({ index })) as BoardCell[];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    newBoard[move.index] = {
      index: move.index,
      value: move.value,
      color: match<-1 | -2 | 0 | 1 | 2 | 3, Colors>(move.owner as -2 | -1 | 0 | 1 | 2 | 3)
        .with(-1, () => Colors.draw)
        .with(-2, () => Colors.nuked)
        .with(0, () => Colors.red)
        .with(1, () => Colors.blue)
        .with(2, () => Colors.green)
        .with(3, () => Colors.purple)
        .exhaustive(),
    };
  }

  return newBoard;
};
