import classNames from "classnames";
import { InventoryCell } from "./InventoryCell";
import { Colors } from "../elements/Tile/types";

interface InventoryProps {
  color: Colors;
  valuesUsed?: string[];
  nukesUsed?: number;
  handleSelect: (value: string) => void;
}

export function Inventory({
  color,
  valuesUsed,
  nukesUsed,
  handleSelect,
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
      />
      <InventoryCell
        color={color}
        value="2"
        used={!!valuesUsed?.includes("2")}
        onSelected={() => handleSelect("2")}
      />
      <InventoryCell
        color={color}
        value="3"
        used={!!valuesUsed?.includes("3")}
        onSelected={() => handleSelect("3")}
      />
      <InventoryCell
        color={color}
        value="n"
        used={!!nukesUsed && nukesUsed > 0}
        onSelected={() => handleSelect("n")}
      />

      <InventoryCell
        color={color}
        value="4"
        used={!!valuesUsed?.includes("4")}
        onSelected={() => handleSelect("4")}
      />
      <InventoryCell
        color={color}
        value="5"
        used={!!valuesUsed?.includes("5")}
        onSelected={() => handleSelect("5")}
      />
      <InventoryCell
        color={color}
        value="6"
        used={!!valuesUsed?.includes("6")}
        onSelected={() => handleSelect("6")}
      />
      <InventoryCell
        color={color}
        value="n"
        used={!!nukesUsed && nukesUsed > 1}
        onSelected={() => handleSelect("n")}
      />

      <InventoryCell
        color={color}
        value="7"
        used={!!valuesUsed?.includes("7")}
        onSelected={() => handleSelect("7")}
      />
      <InventoryCell
        color={color}
        value="8"
        used={!!valuesUsed?.includes("8")}
        onSelected={() => handleSelect("8")}
      />
      <InventoryCell
        color={color}
        value="9"
        used={!!valuesUsed?.includes("9")}
        onSelected={() => handleSelect("9")}
      />
      <InventoryCell
        color={color}
        value="n"
        used={!!nukesUsed && nukesUsed > 2}
        onSelected={() => handleSelect("n")}
      />
    </div>
  );
}
