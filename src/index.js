import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { DisplayNameProvider } from "./context/displayName/DisplayName.context";
import { UserProvider } from "./context/user/user.context";
import reportWebVitals from "./reportWebVitals";
import { ProductsProvider } from "./context/product/product.context";
import {
  CartProvider,
  ShoppingCartProvider,
} from "./context/shoppingCart/shoppingCart.context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ProductsProvider collectionName={"Products"}>
          <CartProvider>
            <DisplayNameProvider>
              <App />
            </DisplayNameProvider>
          </CartProvider>
        </ProductsProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
