import { CreateRoom } from "../components/CreateRoom";
import { JoinRoom } from "../components/JoinRoom/JoinRoom";
import { LoginCard } from "../components/LoginCard";
import { useAuth } from "../providers/AuthProvider";
import Logo from "../assets/logo.svg";

export default function Page() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center h-full w-full px-12 py-12">
      <div className="flex-0 w-full text-center">
        <img src={Logo} />
      </div>
      <br />

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
