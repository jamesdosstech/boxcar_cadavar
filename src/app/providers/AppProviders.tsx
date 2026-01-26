import React from "react";
import { UserProvider } from "../../context/user/user.context";
import { CartProvider } from "../../context/shoppingCart/shoppingCart.context";

type Props = { children: React.ReactNode };

export default function AppProviders({ children }: Props) {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
}
