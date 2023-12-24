import classNames from "classnames";
import { InventoryCell } from "./InventoryCell";
import { Colors } from "../elements/Tile/types";

interface InventoryProps {
  color: Colors;
  valuesUsed?: string[];
  nukesUsed?: number;
  handleSelect: (value: string) => void;
  selectable: boolean;
}

export function Inventory({
  color,
  valuesUsed,
  nukesUsed,
  handleSelect,
  selectable,
}: InventoryProps) {
  return (
    <div
      className={classNames(
        "grid grid-cols-4 gap-1 bg-slate-200 p-2 mt-4 rounded-md"
      )}
    >
      <InventoryCell
        color={color}
        value="1"
        used={!!valuesUsed?.includes("1")}
        onSelected={() => handleSelect("1")}
        className="col-span-1"
        selectable={selectable}
      />
      <InventoryCell
        color={color}
        value="2"
        used={!!valuesUsed?.includes("2")}
        onSelected={() => handleSelect("2")}
        className="col-span-1"
        selectable={selectable}
      />
      <InventoryCell
        color={color}
        value="3"
        used={!!valuesUsed?.includes("3")}
        onSelected={() => handleSelect("3")}
        className="col-span-1"
        selectable={selectable}
      />
      <div className="row-span-3 col-span-1 flex flex-col justify-center items-center">
        <InventoryCell
          color={color}
          value="n"
          used={!!nukesUsed && nukesUsed > 2}
          onSelected={() => handleSelect("n")}
          selectable={selectable}
        />
        <span>
          {nukesUsed !== undefined && !isNaN(nukesUsed) && (
            <span className="text-2xl">{3 - nukesUsed} left</span>
          )}
        </span>
      </div>

      <InventoryCell
        color={color}
        value="4"
        used={!!valuesUsed?.includes("4")}
        onSelected={() => handleSelect("4")}
        className="col-span-1"
        selectable={selectable}
      />
      <InventoryCell
        color={color}
        value="5"
        used={!!valuesUsed?.includes("5")}
        onSelected={() => handleSelect("5")}
        className="col-span-1"
        selectable={selectable}
      />
      <InventoryCell
        color={color}
        value="6"
        used={!!valuesUsed?.includes("6")}
        onSelected={() => handleSelect("6")}
        className="col-span-1"
        selectable={selectable}
      />

      <InventoryCell
        color={color}
        value="7"
        used={!!valuesUsed?.includes("7")}
        onSelected={() => handleSelect("7")}
        className="col-span-1"
        selectable={selectable}
      />
      <InventoryCell
        color={color}
        value="8"
        used={!!valuesUsed?.includes("8")}
        onSelected={() => handleSelect("8")}
        className="col-span-1"
        selectable={selectable}
      />
      <InventoryCell
        color={color}
        value="9"
        used={!!valuesUsed?.includes("9")}
        onSelected={() => handleSelect("9")}
        className="col-span-1"
        selectable={selectable}
      />
    </div>
  );
}
