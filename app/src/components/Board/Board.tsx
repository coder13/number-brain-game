import classNames from "classnames";
import { BoardCell as BoardCellType } from "./types";
import { BoardCell } from "../Game/BoardCell";
import { Fragment } from "react";

export function Board({
  board,
  canSelect,
  onType,
  playerColor,
  onCellSelect,
  selectedIndex,
}: {
  board: BoardCellType[];
  canSelect: boolean;
  onType: (index: number, value: string) => void;
  playerColor: string;
  selectedIndex: number;
  onCellSelect: (i: number) => void;
}) {
  return (
    <div
      className={classNames("grid rounded-md bg-white drop-shadow-md gap-1")}
      style={{
        gridTemplateColumns: "2em repeat(5, 1fr)",
        gridTemplateRows: "2em repeat(5, 1fr)",
      }}
    >
      <div className="col-span-1 row-span-1 " />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="col-span-1 row-span-1 text-center align-middle">
          {i}
        </div>
      ))}
      {board.map(({ index, color, value }) => (
        <Fragment key={index}>
          {index % 5 === 0 && (
            <div className="col-span-1 text-center align-middle">
              {["a", "b", "c", "d", "e"][index / 5]}
            </div>
          )}
          <BoardCell
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
            selected={selectedIndex === index}
          />
        </Fragment>
      ))}
    </div>
  );
}
