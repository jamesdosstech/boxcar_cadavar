import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/user/user.context";
import { useIsAdmin } from "../hooks/useIsAdmin.hook";

export default function ProtectedGuard() {
  const { currentUser } = useContext(UserContext);
  const isAdmin = useIsAdmin();

  if (!currentUser || !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
