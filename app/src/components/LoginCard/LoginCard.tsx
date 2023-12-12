import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

export function LoginCard() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(username);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="border p-8 rounded-lg border-gray-300 drop-shadow-lg w-1/3">
        <form onSubmit={handleLogin}>
          <label
            htmlFor="first_name"
            className="block mb-2 font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
