import { Colors } from "./types";

export interface TieProps {
  colors: Colors[];
}

const colorMap: Record<Colors, string> = {
  red: "#d74f9d",
  green: "#4eb748",
  blue: "#00bef3",
  yellow: "#fbac18",
  // unused
  gray: "#6d6e71",
};

const BG = (
  <g>
    <path 
      className="fill-[#6d6e71]"
      d="M175.68,164.12l-5.87-5.87V27.17c0-9.38-7.6-16.98-16.98-16.98H21.69l-5.84-5.84L5.91,14.3C2.29,17.42,0,22.02,0,27.17v127.4C0,168.61,11.39,180,25.43,180h127.4c5.12,0,9.7-2.27,12.81-5.84l10.04-10.04Z"
    />
    <rect
      className="fill-[#a7a9ac]"
      x="10.19"
      y="0"
      width="169.81"
      height="169.81"
      rx="16.98"
      ry="16.98"
    />
  </g>
);

export function Tie({ colors }: TieProps) {
  if (colors.length === 1) {
    throw new Error("Tie must have more than one color");
  }

  if (colors.length === 2) {
    const fillColor1 = colorMap[colors[0]];
    const fillColor2 = colorMap[colors[1]];

    return (
      <>
        {BG}
        <g>
          <rect
            className="fill-[#231f20]"
            x="65.02"
            y="4.35"
            width="60.16"
            height="29.94"
            rx="14.97"
            ry="14.97"
          />
          <circle
            style={{
              fill: fillColor1,
            }}
            cx="80.72"
            cy="19.32"
            r="13.23"
          />
          <circle
            style={{
              fill: fillColor2,
            }}
            cx="109.4"
            cy="19.32"
            r="13.23"
          />
        </g>
      </>
    );
  }

  if (colors.length === 3) {
    const fillColor1 = colorMap[colors[0]];
    const fillColor2 = colorMap[colors[1]];
    const fillColor3 = colorMap[colors[2]];

    return (
      <>
        {BG}
        <g>
          <rect
            className="fill-[#231f20]"
            x="65.02"
            y="4.35"
            width="60.16"
            height="29.94"
            rx="14.97"
            ry="14.97"
          />
          <circle
            style={{
              fill: fillColor1,
            }}
            cx="66.2"
            cy="19.32"
            r="13.23"
          />
          <circle
            style={{
              fill: fillColor2,
            }}
            cx="94.89"
            cy="19.32"
            r="13.23"
          />
          <circle
            style={{
              fill: fillColor3,
            }}
            cx="123.94"
            cy="19.37"
            r="13.23"
          />
        </g>
      </>
    );
  }

  if (colors.length === 4) {
    const fillColor1 = colorMap[colors[0]];
    const fillColor2 = colorMap[colors[1]];
    const fillColor3 = colorMap[colors[2]];
    const fillColor4 = colorMap[colors[3]];

    return (
      <>
        {BG}
        <g>
          <rect
            className="fill-[#231f20]"
            x="65.02"
            y="4.35"
            width="60.16"
            height="29.94"
            rx="14.97"
            ry="14.97"
          />
          <circle
            style={{
              fill: fillColor1,
            }}
            cx="51.25"
            cy="19.37"
            r="13.23"
          />
          <circle
            style={{
              fill: fillColor2,
            }}
            cx="80.41"
            cy="19.37"
            r="13.23"
          />
          <circle
            style={{
              fill: fillColor3,
            }}
            cx="109.57"
            cy="19.37"
            r="13.23"
          />
          <circle
            style={{
              fill: fillColor4,
            }}
            cx="138.73"
            cy="19.37"
            r="13.23"
          />
        </g>
      </>
    );
  }

  throw new Error("Tie has too many colors");
}
