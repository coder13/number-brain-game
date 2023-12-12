import { createContext, useContext } from "react";

export type User = {
  username: string;
  token: string;
}

export interface AuthContextProps {
  user?: User,
  login: (username: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  login: () => { },
});

export const useAuth = () => useContext(AuthContext);
