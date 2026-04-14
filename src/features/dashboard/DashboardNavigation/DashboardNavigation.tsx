import { NavLink } from "react-router-dom";
import "./DashboardNavigation.styles.scss";

const items = [
  { label: "Dashboard", to: "" },
  { label: "Orders", to: "orders" },
  { label: "Products", to: "products" },
  { label: "Users", to: "users" },
  { label: "Blog", to: "blog" },
];

export default function DashboardNavigation() {
  return (
    <nav className="ds-admin-nav" aria-label="Admin navigation">
      <div className="ds-admin-nav-header">
        <div className="ds-admin-nav-brand">Admin</div>
        <div className="ds-admin-nav-subtitle">Manage the store</div>
      </div>

      <div className="ds-admin-nav-links">
        {items.map((i) => (
          <NavLink
            key={i.label}
            to={i.to}
            end={i.to === ""}
            className={({ isActive }) =>
              `ds-admin-nav-link ${isActive ? "is-active" : ""}`
            }
          >
            <span className="ds-admin-nav-link-text">{i.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
