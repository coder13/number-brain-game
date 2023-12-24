import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import App from "./App.tsx";
import "./index.css";
import { WebsocketProvider } from "./providers/WebsocketProvider";
import { AuthProvider } from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnackbarProvider>
      <WebsocketProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WebsocketProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
