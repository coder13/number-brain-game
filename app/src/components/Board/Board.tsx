import classNames from "classnames";
import { BoardCell as BoardCellType } from "./types";
import { BoardCell } from "../Game/BoardCell";

export function Board({
  board,
  canSelect,
  onType,
  playerColor,
}: {
  board: BoardCellType[];
  canSelect: boolean;
  onType: (index: number, value: string) => void;
  playerColor: string;
}) {
  return (
    <div
      className={classNames(
        "grid grid-cols-5 grid-rows-5 rounded-md p-2 bg-gray-100 drop-shadow-sm"
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
        />
      ))}
    </div>
  );
}
