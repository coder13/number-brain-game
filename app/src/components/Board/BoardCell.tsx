import classNames from "classnames";
import { Tile as TileType } from "./types";
import { useState } from "react";
import { Tile, TileProps } from "../elements/Tile/Tile";
import { Colors } from "../elements/Tile/types";
import { Background_Colors } from "../Game/colors";

interface BoardCellProps {
  tiles: TileType[];
  selectable?: boolean;
  onValueChange?: (value: string) => void;
  onClick?: () => void;
  playerColor: Colors;
  selected?: boolean;
}

export function BoardCell({
  tiles,
  playerColor,
  onClick,
  selected,
}: BoardCellProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={classNames(
        "flex justify-center items-center text-4x h-16 w-16 group"
      )}
      style={{
        ...(selected && {
          border: "4px solid",
          borderColor: Background_Colors[playerColor],
        }),
      }}
      onClick={() => {
        onClick?.();
        // setHover((prev) => !prev);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      // onTouchStart={() => setHover((prev) => !prev)}
      // onTouchEnd={() => setHover(false)}
    >
      {tiles.map(({ pos, colorsPlayed, value }) => {
        return (
          <Tile
            className={classNames(
              "absolute group transform w-16 h-16 transition duration-150 scale",
              {
                "rotate-0": pos === 0,
                "rotate-15": pos === 1,
                "rotate-30": pos === 2,
                "rotate-45": pos === 3,
              }
            )}
            style={{
              ...(hover && {
                transform: `translateX(${pos * 1}rem) translateY(-${
                  pos * 3
                }rem) rotate(${pos * 15}deg) ${value === "n" ? "" : ""}`,
                // transformOrigin: "bottom right 60rem",
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
