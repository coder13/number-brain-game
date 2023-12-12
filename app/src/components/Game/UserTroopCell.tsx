import { Background_Colors, Text_Colors } from "./colors";

export function UserTroopCell({
  color,
  value,
  used,
}: {
  color: "red" | "blue" | "black";
  value: string;
  used?: boolean;
}) {
  return (
    <div
      className="cell col-span-1 row-span-1 h-16 w-16 flex justify-center items-center text-4xl"
      style={{
        backgroundColor: Background_Colors[color],
        color: Text_Colors[color],
        ...(used && {
          backgroundColor: Background_Colors.black,
          color: Text_Colors.gray,
        }),
      }}
    >
      <span>{value}</span>
    </div>
  );
}
