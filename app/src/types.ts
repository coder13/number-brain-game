export interface Room {
  id: string;
  name: string;
  // All users in the room: players and spectators
  users: User[];
  gameState?: GameState;
}

export interface User {
  token: string;
  username: string;
  socketId: string;
}

export interface Move {
  index: number;
  value: string;
}

export interface InternalMove extends Move {
  player: number; // who played it
}

export interface GameState {
  players: User[];
  turn: number;
  winner?: number;
  board: {
    index: number;
    owner: number;
    value?: string;
  }[];
  valuesUsed: string[];
}
