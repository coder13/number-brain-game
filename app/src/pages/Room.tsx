import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useWebsocket } from "../providers/WebsocketProvider";
import { GameState, Room } from "../types";
import classNames from "classnames";
import { UserTroopCell } from "../components/Game/UserTroopCell";
import { Board } from "../components/Board/Board";
import { buildBoardState } from "../components/Board/util";
import { LoginCard } from "../components/LoginCard";

const colorOrder = ["red", "blue", "green", "purple"];

export default function Page() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { socket } = useWebsocket();

  const [roomState, setRoomState] = useState<Room | undefined>();

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const playerIndex = roomState?.gameState?.players?.findIndex(
    (u) => u.username === user?.username
  );

  const handleStateUpdate = (state: Room | { error: string }) => {
    if ("error" in state) {
      console.error(state.error);
      return;
    }

    setRoomState(state);
  };

  const handleRoomStateUpdate = (state: Room | { error: string }) => {
    if ("error" in state) {
      console.error(state.error);
      return;
    }

    setRoomState((prev) => {
      return prev ? { ...prev, ...state } : state;
    });
  };

  const handlePlayTile = useCallback(
    (index: number, value: string) => {
      if (!["1", "2", "3", "4", "5", "6", "7", "8", "9", "n"].includes(value)) {
        return;
        3;
      }

      socket?.emit("room/move", { index, value }, handleStateUpdate);
    },
    [socket]
  );

  const handleKeyPress = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "n"].includes(e.key)) {
        handlePlayTile(selectedIndex, e.key);
      }
    },
    [handlePlayTile, selectedIndex]
  );

  useEffect(() => {
    if (!socket || !user) {
      return;
    }

    socket.on("state", handleStateUpdate);
    socket.on("roomState", handleRoomStateUpdate);

    socket?.emit("room/join", roomId, (state: Room | { error: string }) => {
      handleStateUpdate(state);
    });

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      socket?.off("state");
      socket?.emit("room/leave", roomId);
    };
  }, [handleKeyPress, roomId, socket, user]);

  if (!user) {
    return (
      <div className="flex flex-col h-full items-center">
        <LoginCard />
      </div>
    );
  }

  const handleRestart = () => {
    socket?.emit("room/restart");
  };

  const handleStart = () => {
    socket?.emit("room/start");
  };

  const color =
    playerIndex !== undefined &&
    (colorOrder[playerIndex] as "red" | "blue" | "green" | "purple");

  const gameState = roomState?.gameState
    ? (roomState?.gameState as GameState)
    : undefined;

  // Game has started if there is a game state
  const started = !!gameState;

  const board = buildBoardState(gameState?.moves || []);

  const allValuesUsed =
    gameState?.moves
      ?.filter((m) => m.player === playerIndex)
      ?.map((m) => m.value) || [];
  const nukesUsed = allValuesUsed?.filter((v) => v === "n").length;

  return (
    <div className="flex flex-col w-full h-full items-center  pt-8">
      <div className="flex flex-col items-center max-w-fit space-y-4 h-full">
        {!started && (
          <>
            <div className="text-xl text-center">{roomState?.id}</div>
            <div className="text-2xl text-center">
              Waiting for players to join...
            </div>
          </>
        )}
        <div className={classNames()}>
          <Players
            players={roomState?.gameState?.players.map((i) => i.username) || []}
            turn={
              roomState?.gameState?.players?.[roomState?.gameState?.turn]
                .username
            }
          />

          {color && (
            <Board
              board={board}
              onType={handlePlayTile}
              canSelect={started && playerIndex === gameState?.turn}
              playerColor={color}
              selectedIndex={selectedIndex}
              onCellSelect={(i) => setSelectedIndex(i)}
            />
          )}
          {color && (
            <div
              className={classNames(
                "grid grid-cols-5 gap-1 bg-slate-200 p-1 mt-4"
              )}
            >
              <UserTroopCell
                color={color}
                value="1"
                used={!!allValuesUsed?.includes("1")}
                onSelected={() => handlePlayTile(selectedIndex, "1")}
              />
              <UserTroopCell
                color={color}
                value="2"
                used={!!allValuesUsed?.includes("2")}
                onSelected={() => handlePlayTile(selectedIndex, "2")}
              />
              <UserTroopCell
                color={color}
                value="3"
                used={!!allValuesUsed?.includes("3")}
                onSelected={() => handlePlayTile(selectedIndex, "3")}
              />
              <UserTroopCell color="black" value="" />
              <UserTroopCell
                color={color}
                value="n"
                used={!!nukesUsed && nukesUsed > 0}
                onSelected={() => handlePlayTile(selectedIndex, "n")}
              />

              <UserTroopCell
                color={color}
                value="4"
                used={!!allValuesUsed?.includes("4")}
                onSelected={() => handlePlayTile(selectedIndex, "4")}
              />
              <UserTroopCell
                color={color}
                value="5"
                used={!!allValuesUsed?.includes("5")}
                onSelected={() => handlePlayTile(selectedIndex, "5")}
              />
              <UserTroopCell
                color={color}
                value="6"
                used={!!allValuesUsed?.includes("6")}
                onSelected={() => handlePlayTile(selectedIndex, "6")}
              />
              <UserTroopCell color="black" value="" />
              <UserTroopCell
                color={color}
                value="n"
                used={!!nukesUsed && nukesUsed > 1}
                onSelected={() => handlePlayTile(selectedIndex, "n")}
              />

              <UserTroopCell
                color={color}
                value="7"
                used={!!allValuesUsed?.includes("7")}
                onSelected={() => handlePlayTile(selectedIndex, "7")}
              />
              <UserTroopCell
                color={color}
                value="8"
                used={!!allValuesUsed?.includes("8")}
                onSelected={() => handlePlayTile(selectedIndex, "8")}
              />
              <UserTroopCell
                color={color}
                value="9"
                used={!!allValuesUsed?.includes("9")}
                onSelected={() => handlePlayTile(selectedIndex, "9")}
              />
              <UserTroopCell color="black" value="" />
              <UserTroopCell
                color={color}
                value="n"
                onSelected={() => handlePlayTile(selectedIndex, "n")}
              />
            </div>
          )}
        </div>
        <div className="text-4xl">
          {roomState?.gameState?.winner !== undefined && (
            <>
              <div>Winner: {colorOrder[roomState?.gameState?.winner]}</div>
              <button className="btn btn-green" onClick={handleRestart}>
                Play again
              </button>
            </>
          )}
        </div>
        {!started && (
          <div className="flex flex-col w-full space-y-2">
            {!started && (
              <button className="btn btn-green" onClick={handleStart}>
                Start
              </button>
            )}
            <h3 className="text-lg font-bold">Users:</h3>
            <ul className="space-y-2">
              {roomState?.users.map((user, index) => (
                <PlayerPill
                  key={user.socketId}
                  username={user.username}
                  color={colorOrder[index]}
                />
              ))}
            </ul>
          </div>
        )}

        <div className="flex-grow" />

        <div className="flex flex-col w-full text-sm pb-2">
          <div>
            Turn: {roomState?.gameState?.turn}{" "}
            {roomState?.gameState?.turn !== undefined
              ? colorOrder[roomState?.gameState?.turn]
              : ""}
          </div>
          {roomState?.gameState?.players.length && (
            <div>Player Count: {roomState?.gameState?.players.length}</div>
          )}
          <div>
            You are player
            {playerIndex}
          </div>
          Index: {selectedIndex}
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
          <PlayerPill
            username={playerName}
            turn={turn === playerName}
            color={["red", "blue", "green", "purple"][index]}
          />
        );
      })}
    </div>
  );
};

export const PlayerPill = ({
  username,
  turn,
  color,
}: {
  username: string;
  turn?: boolean;
  color: string;
}) => {
  return (
    <div
      className={classNames(
        "font-bold text-white px-2 py-1 rounded-md flex-grow text-center align-baseline",
        {
          "bg-red-500": color === "red",
          "bg-sky-500": color === "blue",
          "bg-green-500": color === "green",
          "bg-purple-500": color === "purple",
          "text-2xl py-2": turn === true,
          "text-sm my-2": turn === false,
        }
      )}
      style={{
        flexBasis: turn === true ? "150%" : "75%",
      }}
    >
      {username}
    </div>
  );
};
