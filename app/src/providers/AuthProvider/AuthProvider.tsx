import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useWebsocket } from "../WebsocketProvider";
import { AuthContext, User } from "./AuthContext";
import { v4 } from "uuid";

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState<User | undefined>();
  const { socket } = useWebsocket();

  useEffect(() => {
    if (!token) {
      const newToken = v4();
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
  }, [token]);

  console.log(19, token);

  const login = useCallback(
    (username: string) => {
      if (username && token) {
        socket?.emit("login", { username, token }, (data: User) => {
          setUser(data);
          localStorage.setItem("username", data.username);
        });
      }
    },
    [socket, token]
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
