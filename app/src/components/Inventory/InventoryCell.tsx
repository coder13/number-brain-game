import classNames from "classnames";
import { Tile, TileProps } from "../elements/Tile/Tile";
import { Colors } from "../elements/Tile/types";

export function InventoryCell({
  color,
  value,
  used,
  onSelected,
  className,
  selectable,
}: {
  color: Colors;
  value: string;
  used?: boolean;
  onSelected?: () => void;
  className?: string;
  selectable: boolean;
}) {
  return (
    <div
      className={classNames(
        "h-16 w-16 flex justify-center items-center text-4xl",
        {
          "hover:opacity-75 cursor-pointer opacity-100": selectable,
          "opacity-50": !selectable,
        },
        className
      )}
      onClick={() => onSelected?.()}
    >
      <Tile
        colors={[!used ? color : "gray"]}
        value={value as TileProps["value"]}
        nuke={value === "n"}
      />
    </div>
  );
}
