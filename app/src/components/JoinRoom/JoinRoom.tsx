import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebsocket } from "../../providers/WebsocketProvider";
import classNames from "classnames";

export function JoinRoom() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(false);
  const { socket } = useWebsocket();

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomId || !socket) {
      return;
    }

    socket?.emit("doesRoomExist", roomId, (doesRoomExist: boolean) => {
      if (!doesRoomExist) {
        setError(true);
        return;
      }

      setError(false);
      navigate(`/rooms/${roomId}`);
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setRoomId("");
      }
    });

    return () => {
      window.removeEventListener("keydown", () => {});
    };
  }, []);

  return (
    <div className="w-full ">
      {!open && (
        <button
          className="p-4 w-full h-full hover:bg-slate-50 cursor-pointer border-2 rounded-lg"
          onClick={() => {
            setOpen(true);
          }}
        >
          Join Room
        </button>
      )}
      {open && (
        <div className="w-full p-4">
          <p className="text-center"></p>
          <form
            onSubmit={handleJoinRoom}
            className="flex flex-col justify-center items-center space-y-2"
          >
            <div className={"border-slate-200 border-1 w-full"}>
              <label htmlFor="roomName" className="text-neutral-700">
                Room identifier
              </label>
              <input
                type="text"
                className={classNames(
                  "border focus-visible:border-slate-50 rounded-lg w-full p-2",
                  {
                    "border-red-500": error,
                    "border-slate-200": !error,
                  }
                )}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="p-4 w-full h-full hover:bg-slate-200 cursor-pointer border-1 rounded-2xl bg-slate-100 transition-all hover:opacity-80"
            >
              Join
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
