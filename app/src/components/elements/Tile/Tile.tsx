import { ReactNode, SVGProps } from "react";
import { Number } from "../Number";
import { Blue, Green, Red, Yellow, Gray } from "./tiles";
import { Nuke } from "./Nuke";
import { Colors } from "./types";
import { Tie } from "./Tie";

const byColor: Record<string, ReactNode> = {
  red: Red,
  blue: Blue,
  green: Green,
  yellow: Yellow,
  gray: Gray,
};

export interface TileProps extends SVGProps<SVGSVGElement> {
  value?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  colors: Colors[];
  nuke?: boolean;
  className?: string;
}

export function Tile({ value, colors, nuke, style, ...props }: TileProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 180"
      style={{
        ...style,
      }}
      {...props}
    >
      {!nuke && colors.length === 1 && byColor[colors[0]]}
      {!nuke && colors.length > 1 && <Tie colors={colors} />}

      {value && <Number value={value} />}

      {nuke && colors.length === 1 && <Nuke color={colors[0]} />}
    </svg>
  );
}
