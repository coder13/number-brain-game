import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { PrivateGameState, Room, User } from '../app/src/types';
import { buildBoardStateForPlayer, determineWinner, newGameState } from './game';
import { generateSlug } from './helpers/randomWords';

const port = process.env.PORT || 4000;

const users = [];

const rooms: Room[] = [{
  id: generateSlug(5),
  name: 'Room 1',
  users: [],
}];

console.log(rooms);

(async () => {
  const app = express();

  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket: Socket & {
    user?: User
    room?: string;
  }) => {
    console.log(`New client connected, id: ${socket.id}`);

    socket.on('login', ({ token, username }: {
      token: string;
      username: string;
    }, cb) => {
      console.log('login', { token, username });

      const user: User = {
        token,
        username,
        socketId: socket.id,
      };

      socket.user = user;

      users.push(user);

      cb(user);

      socket.emit('rooms', { rooms });
    });

    socket.on('room/join', (roomId: string, cb) => {
      const room = rooms.find(r => r.id === roomId);
      if (!room) {
        return cb({
          error: 'Room not found',
        });
      }

      socket.join(roomId);

      // join the socket to the room
      socket.room = roomId;

      if (socket.user) {
        if (room.users.some(({ username }) => username === socket.user?.username)) {
          return cb({
            error: 'Joined but already in the room',
          });
        }

        // add the user to the room
        room.users.push(socket.user);
      }

      if (room.users.length === 2 && !room.gameState) {
        room.gameState = newGameState({
          player1: room.users[0],
          player2: room.users[1],
        });
        console.log('Game started', room.gameState)
        socket.broadcast.to(roomId).emit('room/started');
      }

      cb(room);

      console.log('User joined room', { roomId, user: socket.user });

      // send the updated room to the everyone
      socket.broadcast.to(roomId).emit('state', room);
    });

    const leaveRoom = () => {
      if (!socket.room) {
        return;
      }

      const room = rooms.find(r => r.id === socket.room);
      if (!room) {
        return;
      }

      socket.leave(room.id);
      socket.room = undefined;

      room.users = room.users.filter(({ username }) => username !== socket.user?.username);

      socket.broadcast.to(room.id).emit('state', room);
    }

    socket.on('room/leave', () => {
      leaveRoom();
    });

    function checkIfGameOver() {

    }

    socket.on('room/move', (move: { index: number, value: string }, cb) => {
      console.log('room/move', move);

      if (!socket.user || !socket.room) {
        return cb({
          error: 'Not in a room',
        });
      }

      const room = rooms.find(r => r.id === socket.room);
      if (!room) {
        return cb({
          error: 'Room not found',
        });
      }

      const gameState = room.gameState as PrivateGameState;

      if (!gameState) {
        return cb({
          error: 'Game not started',
        });
      }

      const player = gameState?.players.findIndex(({ username }) => username === socket.user?.username);
      if (player < 0) {
        return cb({
          error: 'Player not found',
        });
      }

      const { index, value } = move;

      if (index < 0 || index > 24) {
        return cb({
          error: 'Invalid move',
        })
      }

      const allValuesUsed = gameState?.internalMoves.filter((v) => v.player === player).map((v) => v.value);

      // // If we're using a nuke and we're out of nukes
      if (value === 'n' && allValuesUsed?.length >= 3) {
        return cb({
          error: 'Out of nukes',
        });
      } else if (value !== 'n' && allValuesUsed?.includes(value)) {
        return cb({
          error: 'Value already used',
        });
      }

      const currentValue = gameState.internalMoves.find((v) => v.index === index);

      if (currentValue?.value === 'n') {
        return cb({
          error: 'Cannot overwrite nuke',
        });
      } else if (currentValue?.player === player) {
        return cb({
          error: 'Cannot overwrite your own move',
        });
      }

      gameState.internalMoves.push({ index, value, player });
      gameState.turn = (gameState.turn + 1) % 2;
      gameState.winner = determineWinner(gameState);
      console.log(gameState.winner);

      // TODO filter board
      socket.to(room.id).emit('state', room);

      const player1SocketId = room.users[0].socketId;
      const player2SocketId = room.users[1].socketId;

      const gameStateForPlayer1 = buildBoardStateForPlayer(gameState, 0);
      const gameStateForPlayer2 = buildBoardStateForPlayer(gameState, 1);

      io.to(player1SocketId).emit('state', {
        ...room,
        gameState: gameStateForPlayer1,
      });

      io.to(player2SocketId).emit('state', {
        ...room,
        gameState: gameStateForPlayer2,
      });

      checkIfGameOver();
    });

    socket.on('disconnect', () => {
      leaveRoom();
    });
  });

  server.listen(port, () => console.log(`Listening on port ${port}`));
})();
