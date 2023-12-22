import { Tile, TileProps } from "../elements/Tile/Tile";
import { Colors } from "../elements/Tile/types";

export function InventoryCell({
  color,
  value,
  used,
  onSelected,
}: {
  color: Colors;
  value: string;
  used?: boolean;
  onSelected?: () => void;
}) {
  return (
    <div
      className="cell col-span-1 row-span-1 h-16 w-16 flex justify-center items-center text-4xl"
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
