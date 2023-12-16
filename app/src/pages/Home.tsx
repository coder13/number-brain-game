import { CreateRoom } from "../components/CreateRoom";
import { JoinRoom } from "../components/JoinRoom/JoinRoom";
import { LoginCard } from "../components/LoginCard";
import { useAuth } from "../providers/AuthProvider";

export default function Page() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="p-8 flex-0 w-full text-6xl  text-center">
        <h1 className="">Tiles</h1>
      </div>

      {user ? (
        <div className="pt-12 w-full space-y-4">
          <CreateRoom />
          <JoinRoom />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <LoginCard />
        </div>
      )}
    </div>
  );
}
