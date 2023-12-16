import { BrowserRouter, Route, Routes } from "react-router-dom";
import classNames from "classnames";
import { useWebsocket } from "./providers/WebsocketProvider";
import { useAuth } from "./providers/AuthProvider";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  const { status } = useWebsocket();
  const { user } = useAuth();

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-slate-100">
      <div className="flex flex-col h-screen w-full max-w-screen-sm rounded-md overflow-y-auto bg-white drop-shadow-lg">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms/:roomId" element={<Room />} />
          </Routes>
        </BrowserRouter>
        <div
          className={classNames(
            "divide-x flex flex-start w-full drop-shadow-lg text-sm justify-stretch rounded-b-md flex-shrink-0 py-2 divide-gray-500",
            {
              "bg-green-200": status.connected,
              "bg-red-200": !status.connected,
            }
          )}
        >
          <div className="px-2">
            <span>Status: </span>
            <span className="font-bold">
              {status.connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="px-2">
            {user ? (
              <>
                <span>Username: </span>
                <span className="font-bold">
                  {user ? user.username : "Not logged in"}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
