import { Link } from "react-router-dom";
import { Room } from "../../types";

export function RoomList({ rooms }: { rooms: Room[] }) {
  return (
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
  );
}
