import classNames from "classnames";
import { Tile } from "./types";
import { BoardCell } from "./BoardCell";
import { Fragment } from "react";
import { Colors } from "../elements/Tile/types";
import legend_1 from "../../assets/svgs/legend_1.svg";
import legend_2 from "../../assets/svgs/legend_2.svg";
import legend_3 from "../../assets/svgs/legend_3.svg";
import legend_4 from "../../assets/svgs/legend_4.svg";
import legend_5 from "../../assets/svgs/legend_5.svg";
import legend_A from "../../assets/svgs/legend_A.svg";
import legend_B from "../../assets/svgs/legend_B.svg";
import legend_C from "../../assets/svgs/legend_C.svg";
import legend_D from "../../assets/svgs/legend_D.svg";
import legend_E from "../../assets/svgs/legend_E.svg";

const LegendMap: Record<string, string> = {
  1: legend_1,
  2: legend_2,
  3: legend_3,
  4: legend_4,
  5: legend_5,
  A: legend_A,
  B: legend_B,
  C: legend_C,
  D: legend_D,
  E: legend_E,
};

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
        "grid rounded-md bg-slate-200 drop-shadow-md gap-1 p-1"
      )}
      style={{
        gridTemplateColumns: "2em repeat(5, 1fr)",
        gridTemplateRows: "2em repeat(5, 1fr)",
      }}
    >
      <div className="col-span-1 row-span-1 " />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="col-span-1 row-span-1 flex justify-center items-center select-none"
        >
          <img src={LegendMap[i]} width="15em" />
        </div>
      ))}
      {array.map((index) => {
        const tiles = board[index];
        const sortedTiles = tiles?.sort((a, b) => a.pos - b.pos) || [];

        return (
          <Fragment key={index}>
            {index % 5 === 0 && (
              <div className="col-span-1 flex justify-center items-center select-none">
                <img
                  src={LegendMap[["A", "B", "C", "D", "E"][index / 5]]}
                  width="15em"
                />
              </div>
            )}
            <div className="bg-white col-span-1 h-16 w-16 cursor-pointer hover:bg-gray-100 trans">
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
