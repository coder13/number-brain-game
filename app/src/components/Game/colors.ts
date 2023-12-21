import colors from "tailwindcss/colors";
import { Colors } from "../elements/Tile/types";

// export type Colors = 'red' | 'blue' | 'green' | 'purple' | 'black' | 'gray';


export const Background_Colors: Record<Colors | ('black' | 'gray'), string> = {
  red: colors.red[500],
  blue: colors.blue[500],
  green: colors.green[500],
  yellow: colors.yellow[500],
  black: colors.black,
  gray: colors.gray[600]
};


export const Text_Colors: Record<Colors | ('black' | 'gray'), string> = {
  red: colors.red[950],
  blue: colors.blue[950],
  green: colors.green[950],
  yellow: colors.yellow[950],
  black: colors.white,
  gray: colors.white,
};

