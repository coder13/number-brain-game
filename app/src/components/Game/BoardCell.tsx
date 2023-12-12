import classNames from "classnames";
import { Background_Colors, Text_Colors } from "./colors";

interface BoardCellProps {
  value?: string;
  color?: string;
  selectable?: boolean;
  onValueChange?: (value: string) => void;
  onCellSelect?: () => void;
}

export function BoardCell({
  value,
  color,
  selectable = true,
  onValueChange,
  onCellSelect,
}: BoardCellProps) {
  return (
    <div
      className={classNames(
        "bg-white col-span-1 row-span-1 h-16 w-16 flex justify-center items-center text-4x border-2",
        {
          "hover:bg-slate-200": selectable,
        }
      )}
      style={{
        ...(color && {
          backgroundColor: color
            ? Background_Colors[color as keyof typeof Background_Colors]
            : "black",
          color: color
            ? Text_Colors[color as keyof typeof Text_Colors]
            : "black",
          border: "none",
        }),
      }}
    >
      <input
        type="tel"
        disabled={!selectable}
        className="w-full h-full text-2xl text-center bg-inherit"
        maxLength={1}
        value={value || ""}
        onClick={() => onCellSelect?.()}
        onChange={(e) => onValueChange?.(e.target.value)}
      />
    </div>
  );
}
