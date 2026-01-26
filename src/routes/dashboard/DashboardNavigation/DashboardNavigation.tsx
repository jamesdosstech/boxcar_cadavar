import { NavLink } from "react-router-dom";
import "./DashboardNavigation.styles.scss";

type AdminNavItem = {
  label: string;
  to: string;
  end?: boolean;
};

const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", to: "", end: true },
  { label: "Orders", to: "orders" },
  { label: "Products", to: "products" },
  { label: "Users", to: "users" },
  { label: "Blog", to: "blog" },
];

export default function DashboardNavigation() {
  return (
    <nav className="ds-admin-nav" aria-label="Admin navigation">
      <ul className="ds-admin-nav-list">
        {adminNavItems.map(({ label, to, end }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `ds-admin-nav-link ${isActive ? "is-active" : ""}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
