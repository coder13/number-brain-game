import { match } from "ts-pattern";
import { GameState } from "../../types";

export enum Colors {
  red = "red",
  blue = "blue",
  draw = "gray",
  nuked = "black",
}

export type BoardCell = {
  value?: string;
  color?: Colors;
};


export const buildBoardState = (
  moves: GameState['board']
): BoardCell[] => {
  const newBoard: BoardCell[] = Array.from({ length: 25 }).fill(
    {}
  ) as BoardCell[];

  console.log(30, moves);

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    newBoard[move.index] = {
      value: move.value,
      color: match<-1 | -2 | 0 | 1, Colors>(move.owner as -2 | -1 | 0 | 1)
        .with(-1, () => Colors.draw)
        .with(-2, () => Colors.nuked)
        .with(0, () => Colors.red)
        .with(1, () => Colors.blue)
        .exhaustive(),
    };
  }

  return newBoard;
};
