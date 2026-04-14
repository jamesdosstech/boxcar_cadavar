import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./App";

import { UserProvider } from "./context/user/user.context";
import { CartProvider } from "./context/shoppingCart/shoppingCart.context";
import reportWebVitals from "./reportWebVitals";
import AppProviders from "./app/providers/AppProviders";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

ReactDOM.createRoot(rootEl).render(
  // <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  // {/* </React.StrictMode> */}
);

reportWebVitals();
