import { useContext } from "react";
import { UserContext } from "../context/user/user.context";

export const useIsAdmin = () => {
  const { currentUser } = useContext(UserContext);
  return currentUser && currentUser.email === "doosetrain@gmail.com";
};