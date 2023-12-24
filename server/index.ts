import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { PrivateGameState, Room, User } from './types';
import { buildBoardStateForPlayer, determineWinner, newGameState } from './game';
import { generateSlug } from './helpers/randomWords';
import { RoomsNamespace, getRoom, setRoom } from './controllers/rooms';
import { redis } from './redis';
import path from 'path';

const port = process.env.PORT && parseInt(process.env.PORT, 10) || 3000;

const users = [];

const generateSlugNotAlreadyUsed = async (): Promise<string> => {
  const slug = generateSlug(5);
  const exists = await redis.exists(`${RoomsNamespace}:${slug}`);
  if (exists) {
    return await generateSlugNotAlreadyUsed();
  }
  return slug;
}

(async () => {
  const app = express();

  //cors
  app.use(cors());

  app.get('/ping', (_, res) => {
    res.send('pong');
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../app/dist'));
    app.get('/', (_, res) => {
      // out of dist, out of server into app
      res.sendFile(path.resolve(__dirname, '../../app/dist/index.html'));
    });

    app.get('/*', (_, res) => {
      // out of dist, out of server into app
      res.sendFile(path.resolve(__dirname, '../../app/dist/index.html'));
    });
  }

  const server = createServer(app);

  const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || 'http://localhost:5173';

  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://10.0.0.110:5173', CORS_ALLOW_ORIGIN],
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
      const user: User = {
        token,
        username,
        socketId: socket.id,
      };

      socket.user = user;

      users.push(user);

      cb(user);
    });

    socket.on('room/join', async (roomId: string, cb) => {
      let room = await getRoom(roomId);

      if (!room) {
        // Create room if not exists
        socket.room = roomId;

        room = {
          id: roomId,
          users: [],
        };

        await setRoom(room);
      } else {
        console.log(socket.id, 'Room exists', room.id);
      }

      socket.join(roomId);

      // join the socket to the room
      socket.room = roomId;

      if (socket.user && !room.users.some(({ token }) => token === socket.user?.token)) {
        // add the user to the room
        room.users.push(socket.user);
      }

      setRoom(room).then(() => {
        if (!room) {
          return;
        }

        // if game is ongoing, send the game state to the player
        if (room.gameState && room.gameState?.players.some(({ token }) => token === socket.user?.token)) {
          const gameState = room.gameState as PrivateGameState;
          // send the personalized game state to the player
          const playerIndex = gameState.players.findIndex(({ token }) => token === socket.user?.token);
          const boardState = buildBoardStateForPlayer(gameState, playerIndex);

          cb({
            ...room,
            gameState: boardState,
          });
        } else {
          cb({
            id: room.id,
            users: room.users
          });
        }

        console.log('User joined room', { roomId, user: socket.user?.username });

        // send the updated room to the everyone
        socket.broadcast.to(roomId).emit('roomState', {
          id: room.id,
          users: room.users,
        });
      });
    });

    const leaveRoom = async () => {
      if (!socket.room) {
        return;
      }

      const room = await getRoom(socket.room);
      if (!room) {
        return;
      }

      socket.leave(room.id);
      socket.room = undefined;

      room.users = room.users.filter(({ token }) => token !== socket.user?.token);

      await setRoom(room);

      socket.broadcast.to(room.id).emit('roomState', {
        id: room.id,
        users: room.users,
      });
    }

    socket.on('room/leave', () => {
      leaveRoom();
    });

    socket.on('room/move', async (move: { index: number, value: string }, cb) => {
      console.log('room/move', socket.user, move);

      if (!socket.user || !socket.room) {
        return cb({
          error: 'Not in a room',
        });
      }

      const room = await getRoom(socket.room);
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

      const player = gameState?.players.findIndex(({ token }) => token === socket.user?.token);
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
      if (value === 'n' && allValuesUsed.filter((i) => i === 'n')?.length >= 3) {
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
      gameState.turn = (gameState.turn + 1) % gameState.players.length;
      gameState.winner = determineWinner(gameState);

      setRoom(room).then(() => {
        gameState.players.forEach((p) => {
          const socketId = room.users.find((i) => i.token === p.token)?.socketId;
          const playerIndex = gameState.players.findIndex((i) => i.token === p.token);
          const boardState = buildBoardStateForPlayer(gameState, playerIndex);
          if (socketId) {
            io.to(socketId).emit('state', {
              ...room,
              gameState: boardState,
            });
          } else {
            console.log('Socket not found for player', p.username, p.token);
          }
        });
      });
    });

    socket.on('doesRoomExist', async (roomId, cb) => {
      const room = await getRoom(roomId);
      cb(!!room);
    })

    socket.on('room/create', async (cb) => {
      if (!socket.user) {
        return cb({
          error: 'Not logged in',
        });
      }

      const room: Room = {
        id: await generateSlugNotAlreadyUsed(),
        users: [],
      };

      setRoom(room).then(() => {
        cb(room);
      })
    });

    socket.on('room/start', async () => {
      if (!socket.room) {
        return;
      }

      const room = await getRoom(socket.room);
      if (!room || room.gameState) {
        return;
      }

      if (room.users.length < 2) {
        return;
      }

      room.gameState = newGameState(room.users);
      await setRoom(room).then(() => {
        io.to(room.id).emit('state', room);
      });
    });

    socket.on('room/restart', async () => {
      if (!socket.room) {
        return;
      }

      const room = await getRoom(socket.room);
      if (!room || !room.gameState) {
        return;
      }

      room.gameState = newGameState(room.users);

      room.gameState.players = [...room.gameState.players.slice(3), ...room.gameState.players.slice(0, 3)]

      await setRoom(room).then(() => {
        io.to(room.id).emit('state', room);
      });
    })

    socket.on('disconnect', () => {
      leaveRoom();
    });
  });

  server.listen(port, '0.0.0.0', () => console.log(`test Listening at 0.0.0.0:${port}`));
})();
