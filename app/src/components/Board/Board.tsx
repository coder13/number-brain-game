import classNames from "classnames";
import { BoardCell as BoardCellType } from "./types";
import { BoardCell } from "../Game/BoardCell";

export function Board({
  board,
  canSelect,
  onType,
  playerColor,
  onCellSelect,
}: {
  board: BoardCellType[];
  canSelect: boolean;
  onType: (index: number, value: string) => void;
  playerColor: string;
  onCellSelect: (i: number) => void;
}) {
  return (
    <div
      className={classNames(
        "grid grid-cols-5 grid-rows-5 rounded-md bg-gray-400 drop-shadow-sm gap-1"
      )}
    >
      {board.map(({ color, value }, index) => (
        <BoardCell
          key={index}
          color={color}
          value={value}
          selectable={canSelect}
          playerColor={playerColor}
          onValueChange={(v: string) => onType(index, v)}
          borders={{
            top: index >= 5,
            right: (index + 1) % 5 !== 0,
            bottom: index <= 19,
            left: index % 5 !== 0,
          }}
          onCellSelect={() => onCellSelect(index)}
        />
      ))}
    </div>
  );
}
