// import { Colors } from "../Game/colors";

import { Colors } from "../elements/Tile/types";

export interface Tile {
  index: number;
  pos: number;
  value?: string;
  colorsPlayed: Colors[];
}

