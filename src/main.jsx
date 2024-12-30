import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import GlobalStyle from "./styles/globalStyles";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyle />
    <AppRouter />
  </React.StrictMode>
);
