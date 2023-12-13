import { CreateRoom } from "../components/CreateRoom";
import { LoginCard } from "../components/LoginCard";
import { RoomList } from "../components/RoomList";
import { useAuth } from "../providers/AuthProvider";
import { useWebsocket } from "../providers/WebsocketProvider";

export default function Page() {
  const { user } = useAuth();
  const { rooms } = useWebsocket();

  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="p-8 flex-0 w-full text-6xl  text-center">
        <h1 className="">Tiles</h1>
      </div>

      {user ? (
        <div className="pt-12 w-full">
          <RoomList rooms={rooms} />
          <CreateRoom />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <LoginCard />
        </div>
      )}
    </div>
  );
}
