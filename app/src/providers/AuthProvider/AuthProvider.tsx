import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useWebsocket } from "../WebsocketProvider";
import { AuthContext, User } from "./AuthContext";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>();
  const { socket } = useWebsocket();

  const login = useCallback(
    (username: string) => {
      socket?.emit("login", { username }, (data: User) => {
        setUser(data);
        localStorage.setItem("username", data.username);
      });
    },
    [socket]
  );

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      login(username);
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}
