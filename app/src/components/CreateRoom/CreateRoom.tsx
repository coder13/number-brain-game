import { FormEvent, useState } from "react";
import { useWebsocket } from "../../providers/WebsocketProvider";
import { Room } from "../../types";
import { useNavigate } from "react-router-dom";

export function CreateRoom() {
  const navigate = useNavigate();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const { socket } = useWebsocket();

  const handleCreateRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomName) {
      return;
    }

    socket?.emit(
      "room/create",
      { name: roomName },
      (room: Room | { error: string }) => {
        if ("error" in room) {
          console.log(room.error);
          return;
        }

        setCreatingRoom(false);
        setRoomName("");
        navigate(`/rooms/${room.id}`);
      }
    );
  };

  return (
    <div className="w-full ">
      {!creatingRoom && (
        <button
          className="p-4 w-full h-full hover:bg-slate-50 cursor-pointer border-2 rounded-lg"
          onClick={() => {
            setCreatingRoom(true);
          }}
        >
          Create Room
        </button>
      )}
      {creatingRoom && (
        <div className="w-full p-4">
          <p className="text-center"></p>
          <form
            onSubmit={handleCreateRoom}
            className="flex flex-col justify-center items-center space-y-2"
          >
            <div className="border-slate-200 border-1 w-full">
              <label htmlFor="roomName" className="text-neutral-700">
                Room Name
              </label>
              <input
                type="text"
                className="border border-slate-200 focus-visible:border-slate-50 rounded-lg w-full p-2"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="p-4 w-full h-full hover:bg-slate-200 cursor-pointer border-1 rounded-2xl bg-slate-100 transition-all hover:opacity-80"
            >
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
