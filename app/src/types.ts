export interface Room {
  id: string;
  name: string;
  // All users in the room: players and spectators
  users: User[];
  gameState?: PrivateGameState | PersonalizedGameState;
}

export interface User {
  token: string;
  username: string;
  socketId: string;
}

export interface GameState {
  type: 'private' | 'personalized';
  players: User[];
  turn: number;
  winner?: number;
}

export interface PrivateGameState extends GameState {
  type: 'private';
  internalMoves: InternalMove[];
}

export interface Move {
  index: number;
  value: string;
}

export interface InternalMove extends Move {
  player: number; // who played it
}

export interface PersonalizedGameState extends GameState {
  type: 'personalized'
  board: {
    index: number;
    owner: number;
    value?: string;
  }[];
  valuesUsed: string[];
}
