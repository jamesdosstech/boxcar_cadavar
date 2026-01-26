import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { UserContext } from "../context/user/user.context";
import { useIsAdmin } from "../hooks/useIsAdmin.hook";
import DashboardNavigation from "../routes/dashboard/DashboardNavigation/DashboardNavigation";

export default function ProtectedGuard() {
  const { currentUser } = useContext(UserContext);
  const isAdmin = useIsAdmin();

  // Not logged in or not admin → redirect
  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <DashboardNavigation />
      <Outlet />
    </>
  );
}
