import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useWebsocket } from "../providers/WebsocketProvider";
import { GameState, PublicMove, Room } from "../types";
import classNames from "classnames";
import { Board } from "../components/Board/Board";
import { buildBoardState } from "../components/Board/util";
import { LoginCard } from "../components/LoginCard";
import { Colors } from "../components/elements/Tile/types";
import { Inventory } from "../components/Inventory/Inventory";
import { useSnackbar } from "notistack";
import { GameButton } from "../components/ui/GameButton";

const colorOrder: Colors[] = ["red", "blue", "green", "yellow"];

export default function Page() {
  const { enqueueSnackbar } = useSnackbar();
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

  useEffect(() => {
    document.title = `${roomState?.id} | Tiles`;

    return () => {
      document.title = "Tiles";
    };
  }, [roomState?.id]);

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

  return (
    <div className="flex flex-col w-full h-screen items-center">
      <div className="max-w-md flex justify-between w-full px-8 pt-2 ">
        <div>{roomId}</div>
        <Link to="/" className="text-blue-600 hover:underline">
          Go Back
        </Link>
      </div>
      {!started && (
        <div className="max-w-md w-full flex flex-col px-4 space-y-4">
          <div className="text-2xl flex items-center w-full justify-between">
            <span className=" text-center">{roomState?.id}</span>
            <button
              className="w-8 cursor-pointer rounded-full"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: document.title,
                      url: window.location.href,
                    })
                    .then(() => console.log("Successful share"))
                    .catch((error) => console.log("Error sharing:", error));
                } else {
                  navigator.clipboard.writeText(window.location.pathname || "");
                  enqueueSnackbar("Copied url to clipboard", {
                    variant: "success",
                  });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
                <path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z"></path>
              </svg>
            </button>
          </div>

          <div className="text-2xl ">Waiting for players to join...</div>

          <div className="flex flex-col w-full space-y-2">
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
          <br />
          <GameButton
            onClick={handleStart}
            disabled={!roomState?.users.length || roomState?.users.length <= 1}
          >
            <span className="drop-shadow-lg text-4xl">Start</span>
          </GameButton>
        </div>
      )}

      <div className="flex flex-col items-center max-w-fit space-y-2 flex-grow min-h-0 pb-2">
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
          {color && gameState?.winner === undefined && (
            <Inventory
              color={color}
              valuesUsed={allValuesUsed}
              nukesUsed={nukesUsed}
              handleSelect={(value) => {
                handlePlayTile(selectedIndex, value);
              }}
              selectable={started && playerIndex === gameState?.turn}
            />
          )}
        </div>
        {roomState?.gameState?.winner !== undefined && (
          <div className="flex justify-between items-center w-full">
            <span className="text-4xl">
              Winner: {colorOrder[roomState?.gameState?.winner]}
            </span>
            <GameButton className="text-xl" onClick={handleRestart}>
              Play again
            </GameButton>
          </div>
        )}
        {gameState && (
          <div className="flex flex-col justify-start w-full overflow-hidden bg-slate-200 rounded-md flex-grow">
            <div className="flex flex-col">
              {!roomState?.gameState?.moves?.length && (
                <div className="col-span-full p-2 text-center text-xl font-bold">
                  No moves yet
                </div>
              )}
              {gameState?.moves?.length
                ? gameState.moves
                    .reduce(
                      (
                        acc: PublicMove[][],
                        move: PublicMove,
                        index: number
                      ) => {
                        const moveIndex = Math.floor(
                          index / gameState.players.length
                        );

                        acc[moveIndex] = [...(acc[moveIndex] || []), move];

                        return [...acc];
                      },
                      [] as PublicMove[][]
                    )
                    ?.map((moves, index) => {
                      return (
                        <div className="flex w-full hover:bg-slate-300 transition-colors duration-100">
                          <span className="font-bold flex-shrink p-1 px-2">
                            {index + 1}.
                          </span>
                          <div
                            className="p-1 flex-grow grid"
                            style={{
                              gridTemplateColumns: `repeat(${gameState.players.length}, 1fr)`,
                            }}
                          >
                            {moves.map((move) => {
                              const x = move.index % 5;
                              const y = Math.floor(move.index / 5);
                              const formattedCoords = `${
                                ["a", "b", "c", "d", "e"][y]
                              }${x + 1}`;
                              return (
                                <div className="col-span-1 flex justify-center w-full space-x-1">
                                  <span className="font-semibold">
                                    {move.value || "?"}
                                  </span>
                                  <span>at</span>
                                  <span className="font-semibold">
                                    {formattedCoords}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                : ""}
            </div>
          </div>
        )}
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
          "bg-red-500 bg-opacity-90": color === "red",
          "bg-sky-500 bg-opacity-90": color === "blue",
          "bg-green-500 bg-opacity-90": color === "green",
          "bg-purple-500 bg-opacity-90": color === "purple",
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
