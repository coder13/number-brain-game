import { useWebsocket } from "../../providers/WebsocketProvider";
import { Room } from "../../types";
import { useNavigate } from "react-router-dom";

export function CreateRoom() {
  const navigate = useNavigate();
  const { socket } = useWebsocket();

  const handleCreateRoom = () => {
    socket?.emit("room/create", (room: Room | { error: string }) => {
      if ("error" in room) {
        console.log(room.error);
        return;
      }

      navigate(`/rooms/${room.id}`);
    });
  };

  return (
    <div className="w-full ">
      <button
        className="p-4 w-full h-full hover:bg-slate-50 cursor-pointer border-2 rounded-lg"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
    </div>
  );
}
