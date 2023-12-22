import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useWebsocket } from "../providers/WebsocketProvider";
import { GameState, Room } from "../types";
import classNames from "classnames";
import { Board } from "../components/Board/Board";
import { buildBoardState } from "../components/Board/util";
import { LoginCard } from "../components/LoginCard";
import { Colors } from "../components/elements/Tile/types";
import { Inventory } from "../components/Inventory/Inventory";

const colorOrder: Colors[] = ["red", "blue", "green", "yellow"];

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
      }

      socket?.emit("room/move", { index, value }, handleStateUpdate);
      setSelectedIndex(-1);
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

    return () => {
      socket?.off("state");
      socket?.off("roomState");
      socket?.emit("room/leave", roomId);
    };
  }, [roomId, socket, user]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

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
    playerIndex !== undefined && (colorOrder[playerIndex] as Colors);

  const gameState = roomState?.gameState
    ? (roomState?.gameState as GameState)
    : undefined;

  // Game has started if there is a game state
  const started = !!gameState;

  const board = buildBoardState(gameState?.moves || []);

  const allValuesUsed =
    gameState?.moves
      ?.filter((m) => m.player === playerIndex)
      ?.map((m) => m.value as string) || [];
  const nukesUsed = allValuesUsed?.filter((v) => v === "n").length;

  console.log(130);

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
              onCellSelect={(i) => {
                started &&
                  playerIndex === gameState?.turn &&
                  setSelectedIndex(i);
              }}
            />
          )}
          {color && (
            <Inventory
              color={color}
              valuesUsed={allValuesUsed}
              nukesUsed={nukesUsed}
              handleSelect={(value) => {
                handlePlayTile(selectedIndex, value);
              }}
            />
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
