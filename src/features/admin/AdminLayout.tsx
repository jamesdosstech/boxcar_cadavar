import { Outlet } from "react-router-dom";
import "./AdminLayout.styles.scss";
import DashboardNavigation from "../../features/dashboard/DashboardNavigation/DashboardNavigation";

export default function AdminLayout() {
  return (
    <div className="ds-admin-shell">
      <aside className="ds-admin-sidebar" aria-label="Admin navigation">
        <DashboardNavigation />
      </aside>

      <div className="ds-admin-main">
        <header className="ds-admin-header">
          <h1 className="ds-admin-title">Admin</h1>
        </header>

        <main className="ds-admin-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
