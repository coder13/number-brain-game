import { PropsWithChildren, useEffect, useState } from "react";
import { WebsocketContext, WebsocketContextProps } from "./WebsocketContext";
import { Socket, io } from "socket.io-client";
import { Room } from "../../types";

interface WebsocketProviderProps extends PropsWithChildren {}

const getOrigin = () => {
  if (import.meta.env.VITE_WS_URL === "/") {
    return `${window.location.protocol === "https" ? "wss" : "ws"}://${
      window.location.host
    }`;
  }

  return import.meta.env.VITE_WS_URL;
};

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<WebsocketContextProps["status"]>({
    connected: false,
    id: "",
  });
  const [rooms, setRooms] = useState<Room[]>([]);

  console.log("connecting to", getOrigin());

  useEffect(() => {
    const _socket = io(getOrigin());

    _socket.connect();

    // client-side
    _socket.on("connect", () => {
      console.log("connect", _socket.id);

      setStatus({ connected: true, id: _socket.id });
      setSocket(_socket);
    });

    _socket.on("disconnect", () => {
      console.log("disconnect", _socket.id);
      setStatus({ connected: false, id: _socket.id });
      setSocket(null);
    });

    _socket.on("logged_in", (data) => {
      console.log(data);
    });

    _socket.on("rooms", (data: { rooms: Room[] }) => {
      setRooms(data.rooms);
    });

    return () => {
      _socket.close();
      setSocket(null);
    };
  }, []);

  return (
    <WebsocketContext.Provider value={{ socket, status, rooms }}>
      {children}
    </WebsocketContext.Provider>
  );
}
