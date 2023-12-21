export interface Room {
  id: string;
  // All users in the room: players and spectators
  users: User[];
  gameState?: GameState;
}

export interface User {
  token: string;
  username: string;
  socketId: string;
}

export interface GameState {
  type: 'personalized'
  moves: PublicMove[];
  players: User[];
  turn: number;
  winner?: number;
}

export interface Move {
  index: number;
  value?: string;
  player: number;
}

export interface InternalMove extends Move {
  value: string;
}

export interface PublicMove extends Move {
  pos: number;
}
