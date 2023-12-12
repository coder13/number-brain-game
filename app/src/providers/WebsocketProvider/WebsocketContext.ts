import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { Room } from "../../types";

export interface WebsocketContextProps {
  socket: Socket | null;
  status: {
    connected: boolean;
    id: string;
  };
  rooms: Room[];
}

export const WebsocketContext = createContext<WebsocketContextProps>({
  socket: null,
  status: {
    connected: false,
    id: '',
  },
  rooms: [],
});

export const useWebsocket = () => useContext(WebsocketContext);
