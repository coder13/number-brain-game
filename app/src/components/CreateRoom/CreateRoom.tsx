import { useWebsocket } from "../../providers/WebsocketProvider";
import { Room } from "../../types";
import { useNavigate } from "react-router-dom";
import { GameButton } from "../ui/GameButton";

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
    <div className="w-full">
      <GameButton onClick={handleCreateRoom} className="w-full text-lg">
        Create Room
      </GameButton>
    </div>
  );
}
