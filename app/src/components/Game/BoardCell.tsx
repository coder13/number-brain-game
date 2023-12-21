import classNames from "classnames";
// import { Background_Colors, Text_Colors } from "./colors";
import { Tile as TileType } from "../Board/types";
import { useState } from "react";
import { Tile, TileProps } from "../elements/Tile/Tile";
import { Colors } from "../elements/Tile/types";
import { Background_Colors } from "./colors";

interface BoardCellProps {
  tiles: TileType[];
  selectable?: boolean;
  onValueChange?: (value: string) => void;
  onCellSelect?: () => void;
  // borders: {
  //   bottom: boolean;
  //   top: boolean;
  //   left: boolean;
  //   right: boolean;
  // };
  playerColor: Colors;
  selected?: boolean;
}

export function BoardCell({
  tiles,
  playerColor,
  selectable = true,
  onCellSelect,
  selected,
}: BoardCellProps) {
  const [hover, setHover] = useState(false);
  console.log(selectable, selected, playerColor);
  return (
    <div
      className={classNames(
        "flex justify-center items-center text-4x h-16 w-16 group border-4 border-white"
      )}
      style={{
        ...(selected && {
          border: "4px solid",
          borderColor: Background_Colors[playerColor],
        }),
      }}
      onClick={onCellSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {tiles.map(({ pos, colorsPlayed, value }) => {
        return (
          <Tile
            className={classNames(
              "absolute group transform w-16 h-16 transition duration-75",
              {
                "rotate-0": pos === 0,
                "rotate-15": pos === 1,
                "rotate-30": pos === 2,
                "rotate-45": pos === 3,
              }
            )}
            style={{
              ...(hover && {
                transform: `translateX(${pos * 3}rem) translateY(-${
                  pos * 2
                }rem) rotate(${pos * 15}deg)`,
                zIndex: pos * 2,
              }),
            }}
            key={pos}
            colors={colorsPlayed}
            value={value as TileProps["value"]}
            nuke={value === "n"}
          />
        );
      })}
    </div>
  );
}
