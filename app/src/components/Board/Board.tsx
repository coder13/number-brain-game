import classNames from "classnames";
import { Tile } from "./types";
import { BoardCell } from "../Game/BoardCell";
import { Fragment } from "react";
import { Colors } from "../elements/Tile/types";

const array = Array.from({ length: 25 }, (_, i) => i);

export function Board({
  board,
  canSelect,
  onType,
  playerColor,
  onCellSelect,
  selectedIndex,
}: {
  board: Record<number, Tile[]>;
  canSelect: boolean;
  onType: (index: number, value: string) => void;
  playerColor: Colors;
  selectedIndex: number;
  onCellSelect: (i: number) => void;
}) {
  return (
    <div
      className={classNames(
        "grid rounded-md bg-[#babebf] drop-shadow-md gap-1 p-1"
      )}
      style={{
        gridTemplateColumns: "2em repeat(5, 1fr)",
        gridTemplateRows: "2em repeat(5, 1fr)",
      }}
    >
      <div className="col-span-1 row-span-1 " />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="col-span-1 row-span-1 text-center self-center">
          {i}
        </div>
      ))}
      {array.map((index) => {
        const tiles = board[index];
        const sortedTiles = tiles?.sort((a, b) => a.pos - b.pos) || [];

        return (
          <Fragment key={index}>
            {index % 5 === 0 && (
              <div className="col-span-1 text-center self-center">
                {["A", "B", "C", "D", "E"][index / 5]}
              </div>
            )}
            <div className="col-span-1 h-16 w-16 bg-white ">
              <BoardCell
                tiles={sortedTiles || []}
                selectable={canSelect}
                playerColor={playerColor}
                onValueChange={(v: string) => onType(index, v)}
                onClick={() => {
                  console.log(57);
                  onCellSelect(index);
                }}
                selected={selectedIndex === index}
              />
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
