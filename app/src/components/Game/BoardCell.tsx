import classNames from "classnames";
import { Background_Colors, Text_Colors } from "./colors";
import { useMediaQuery } from "usehooks-ts";

interface BoardCellProps {
  value?: string;
  color?: string;
  selectable?: boolean;
  onValueChange?: (value: string) => void;
  onCellSelect?: () => void;
  borders: {
    bottom: boolean;
    top: boolean;
    left: boolean;
    right: boolean;
  };
  playerColor: string;
  selected?: boolean;
}

export function BoardCell({
  value,
  color,
  playerColor,
  selectable = true,
  onValueChange,
  onCellSelect,
  selected,
}: BoardCellProps) {
  const matches = useMediaQuery("(any-pointer: none)");

  return (
    <div
      className={classNames(
        "bg-gray-300 border-gray-300 col-span-1 row-span-1 h-16 w-16 flex justify-center items-center text-4x border-4",
        {
          ...(selectable && {
            "hover:border-red-500": selectable && playerColor === "red",
            "hover:border-sky-500": selectable && playerColor === "blue",
            "hover:border-green-500": selectable && playerColor === "green",
            "hover:border-purple-500": selectable && playerColor === "purple",
            "border-red-500": playerColor === "red" && selected,
            "border-sky-500": playerColor === "blue" && selected,
            "border-green-500": playerColor === "green" && selected,
            "border-purple-500": playerColor === "purple" && selected,
          }),
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
        disabled={!selectable || !!value || color === "black"}
        className="w-full h-full text-2xl text-center bg-inherit focus:outline-none rounded-md"
        maxLength={1}
        value={value || ""}
        onClick={() => onCellSelect?.()}
        onChange={(e) => onValueChange?.(e.target.value.slice(-1))}
        readOnly={!matches}
        onKeyDown={(e) => {
          onValueChange?.(e.key);
        }}
      />
    </div>
  );
}
