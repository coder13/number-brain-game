import { PropsWithChildren, useEffect, useState } from "react";
import { WebsocketContext, WebsocketContextProps } from "./WebsocketContext";
import { Socket, io } from "socket.io-client";

interface WebsocketProviderProps extends PropsWithChildren {}

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  // const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<WebsocketContextProps["status"]>({
    connected: false,
    id: "",
  });
  const [rooms, setRooms] = useState<string[]>([]);

  // useEffect(() => {
  //   if (!token) {
  //     const _token = Randomstring.generate(32);
  //     localStorage.setItem("token", _token);
  //     setToken(_token);
  //   }
  // }, [token]);

  useEffect(() => {
    console.log(14);

    const _socket = io("ws://localhost:4000");

    _socket.connect();

    // client-side
    _socket.on("connect", () => {
      console.log(_socket.id);
      setSocket(_socket);

      setStatus({ connected: true, id: _socket.id });
    });

    _socket.on("disconnect", () => {
      console.log(_socket.id);
      setStatus({ connected: false, id: _socket.id });
    });

    _socket.on("logged_in", (data) => {
      console.log(data);
    });

    _socket.on("rooms", (data: { rooms: string[] }) => {
      setRooms(data.rooms);
    });

    return () => {
      _socket.close();
      setSocket(null);
    };
  }, []);

  // const login = useCallback(
  //   (username: string) => {
  //     if (!socket) {
  //       return;
  //     }

  //     // socket.emit("login", { username }, (data: { username: string }) => {
  //     //   console.log("logged in", data);
  //     // });
  //   },
  //   [socket]
  // );

  return (
    <WebsocketContext.Provider value={{ socket, status, rooms }}>
      {children}
    </WebsocketContext.Provider>
  );
}
