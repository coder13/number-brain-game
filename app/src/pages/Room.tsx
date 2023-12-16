import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useWebsocket } from "../providers/WebsocketProvider";
import { GameState, Room } from "../types";
import classNames from "classnames";
import { BoardCell } from "../components/Game/BoardCell";
import { UserTroopCell } from "../components/Game/UserTroopCell";
import { Board } from "../components/Board/Board";
import { buildBoardState } from "../components/Board/types";

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
    ? (roomState?.gameState as GameState)
    : undefined;

  // Game has started if there is a game state
  const started = !!gameState;

  const board = buildBoardState(gameState?.board || []);
  console.log(95, gameState?.board, board);

  const allValuesUsed = gameState?.valuesUsed;
  const nukesUsed = allValuesUsed?.filter((v) => v === "n").length;

  return (
    <div className="flex flex-col w-full h-full items-center  pt-8">
      <div className="flex flex-col items-center max-w-fit space-y-4">
        <div className="w-full text-2xl text-center">
          <h1>{roomState?.name}</h1>
        </div>
        {playerIndex}
        <div className={classNames()}>
          <Players
            players={roomState?.gameState?.players.map((i) => i.username) || []}
            turn={
              roomState?.gameState?.players?.[roomState?.gameState?.turn]
                .username
            }
          />

          <Board
            board={board}
            onType={handleValueChange}
            canSelect={started && playerIndex === gameState?.turn}
            playerColor={playerIndex ? "blue" : "red"}
          />

          <div className={classNames("grid grid-cols-5 mt-2")}>
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
          </div>
        </div>
        <div className="text-4xl">
          {roomState?.gameState?.winner !== undefined && (
            <div>Winner: {["red", "blue"][roomState?.gameState?.winner]}</div>
          )}
        </div>

        <div className="flex flex-col w-full text-sm">
          <div>
            Turn: {roomState?.gameState?.turn}{" "}
            {roomState?.gameState?.turn !== undefined
              ? ["red", "blue"][roomState?.gameState?.turn]
              : ""}
          </div>
          <div>Players: {roomState?.gameState?.players.length}</div>
        </div>
      </div>
    </div>
  );
}

export const Players = ({
  players,
  turn,
}: {
  players: string[];
  turn?: string;
}) => {
  return (
    <div className="flex w-full justify-stretch items-stretch space-x-1 my-2">
      {players.map((playerName, index) => {
        return (
          <div
            key={playerName}
            className={classNames(
              "font-bold text-white px-2 py-1 rounded-md flex-grow text-center align-baseline",
              {
                "bg-red-500": index === 0,
                "bg-sky-500": index === 1,
                "bg-green-500": index === 2,
                "bg-yellow-500": index === 3,
                "text-2xl py-2": turn === playerName,
                "text-sm my-2": turn !== playerName,
              }
            )}
            style={{
              flexBasis: turn === playerName ? "150%" : "75%",
            }}
          >
            {playerName}
          </div>
        );
      })}
    </div>
  );
};
