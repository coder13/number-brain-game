export interface Room {
  id: string;
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

export interface PersonalizedGameState extends GameState {
  type: 'personalized'
  moves: PublicMove[];
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
