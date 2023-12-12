import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useWebsocket } from "../providers/WebsocketProvider";
import { PersonalizedGameState, Room } from "../types";
import classNames from "classnames";
import { BoardCell } from "../components/Game/BoardCell";
import { UserTroopCell } from "../components/Game/UserTroopCell";
import { match } from "ts-pattern";

enum Colors {
  red = "red",
  blue = "blue",
  draw = "gray",
  nuked = "black",
}

type BoardCell = {
  value?: string;
  color?: Colors;
};

const buildBoardState = (
  moves: PersonalizedGameState["board"]
): BoardCell[] => {
  const newBoard: BoardCell[] = Array.from({ length: 25 }).fill(
    {}
  ) as BoardCell[];

  console.log(30, moves);

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    newBoard[move.index] = {
      value: move.value,
      color: match<-1 | -2 | 0 | 1, Colors>(move.owner as -2 | -1 | 0 | 1)
        .with(-1, () => Colors.draw)
        .with(-2, () => Colors.nuked)
        .with(0, () => Colors.red)
        .with(1, () => Colors.blue)
        .exhaustive(),
    };
  }

  return newBoard;
};

// Player 1 is red
// Player 2 is blue

export default function Page() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { socket } = useWebsocket();

  const [roomState, setRoomState] = useState<Room | undefined>();

  const playerIndex = roomState?.gameState?.players?.findIndex(
    (u) => u.username === user?.username
  );

  const handleStateUpdate = (state: Room | { error: string }) => {
    console.log(53, state);

    if ("error" in state) {
      console.error(state.error);
      return;
    }

    setRoomState(state);
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("state", handleStateUpdate);

    socket?.emit("room/join", roomId, (state: Room | { error: string }) => {
      console.log("joined room");
      handleStateUpdate(state);
    });

    return () => {
      socket?.off("state");
      socket?.emit("room/leave", roomId);
    };
  }, [roomId, socket, user]);

  const handleValueChange = (index: number, value: string) => {
    if (!["1", "2", "3", "4", "5", "6", "7", "8", "9", "n"].includes(value)) {
      return;
    }

    console.log(74, value);
    socket?.emit("room/move", { index, value }, handleStateUpdate);
  };

  const color = playerIndex === 0 ? "red" : "blue";

  const gameState = roomState?.gameState
    ? (roomState?.gameState as PersonalizedGameState)
    : undefined;

  // Game has started if there is a game state
  const started = !!gameState;

  const board = buildBoardState(gameState?.board || []);
  console.log(95, gameState?.board, board);

  const allValuesUsed = gameState?.valuesUsed;
  const nukesUsed = allValuesUsed?.filter((v) => v === "n").length;

  return (
    <div className="flex flex-col w-full h-full items-center drop-shadow-lg pt-8">
      <div className="flex flex-col items-center max-w-fit space-y-4">
        <div className="w-full text-2xl text-center">
          <h1>{roomState?.name}</h1>
        </div>
        <div
          className={classNames("p-4 bg-slate-100", {
            "bg-slate-100": !started,
          })}
        >
          <div
            className={classNames(
              "grid grid-cols-5 border-2 border-gray-700 drop-shadow-lg"
            )}
          >
            <UserTroopCell
              color={color}
              value="1"
              used={!!allValuesUsed?.includes("1")}
            />
            <UserTroopCell
              color={color}
              value="2"
              used={!!allValuesUsed?.includes("2")}
            />
            <UserTroopCell
              color={color}
              value="3"
              used={!!allValuesUsed?.includes("3")}
            />
            <UserTroopCell color="black" value="" />
            <UserTroopCell
              color={color}
              value="n"
              used={!!nukesUsed && nukesUsed > 0}
            />

            <UserTroopCell
              color={color}
              value="4"
              used={!!allValuesUsed?.includes("4")}
            />
            <UserTroopCell
              color={color}
              value="5"
              used={!!allValuesUsed?.includes("5")}
            />
            <UserTroopCell
              color={color}
              value="6"
              used={!!allValuesUsed?.includes("6")}
            />
            <UserTroopCell color="black" value="" />
            <UserTroopCell
              color={color}
              value="n"
              used={!!nukesUsed && nukesUsed > 1}
            />

            <UserTroopCell
              color={color}
              value="7"
              used={!!allValuesUsed?.includes("7")}
            />
            <UserTroopCell
              color={color}
              value="8"
              used={!!allValuesUsed?.includes("8")}
            />
            <UserTroopCell
              color={color}
              value="9"
              used={!!nukesUsed && nukesUsed > 2}
            />
            <UserTroopCell color="black" value="" />
            <UserTroopCell color={color} value="n" />

            <div className="cell bg-black col-span-5 row-span-1 h-16  flex justify-center items-center text-4xl"></div>
            {board.map(({ color, value }, index) => (
              <BoardCell
                key={index}
                color={color}
                value={value}
                selectable={playerIndex === roomState?.gameState?.turn}
                onValueChange={(v: string) => handleValueChange(index, v)}
              />
            ))}
          </div>
        </div>
        <div className="text-4xl">
          {roomState?.gameState?.winner !== undefined && (
            <div>Winner: {["red", "blue"][roomState?.gameState?.winner]}</div>
          )}
        </div>
        <div className="flex flex-col w-full text-lg">
          <p className="font-bold text-sm mb-1">Players:</p>
          <ul className="">
            {roomState?.users?.map((user, index) => {
              const playerIndex = roomState?.gameState?.players?.findIndex(
                (p) => p.username === user.username
              );

              return (
                <li
                  key={user.username}
                  className={classNames("px-2 py-1 text-gray-800", {
                    "bg-red-100": playerIndex === 0,
                    "bg-blue-100": playerIndex === 1,
                  })}
                >
                  <span className="font-extrabold mr-1">{index + 1}</span>
                  <span>{user.username}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-col w-full text-sm">
          <div>Turn: {roomState?.gameState?.turn ? "blue" : "red"}</div>
          <div>Players: {roomState?.gameState?.players.length}</div>
        </div>
      </div>
    </div>
  );
}
