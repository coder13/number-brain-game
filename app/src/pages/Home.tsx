import { Link } from "react-router-dom";
import { LoginCard } from "../components/LoginCard";
import { useAuth } from "../providers/AuthProvider";
import { useWebsocket } from "../providers/WebsocketProvider";

export default function Page() {
  const { user } = useAuth();
  const { rooms } = useWebsocket();

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full">
        <LoginCard />
      </div>
    );
  }

  console.log(17, rooms);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 pt-12 border-gray-300">
        <h2 className="text-2xl font-bold pb-4">Rooms</h2>
        <ul className="space-y-4">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="w-full border rounded-md text-2xl hover:bg-slate-50 cursor-pointer flex"
            >
              <Link to={`/rooms/${room.id}`} className="w-full">
                <button className="p-2">{room.name}</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
