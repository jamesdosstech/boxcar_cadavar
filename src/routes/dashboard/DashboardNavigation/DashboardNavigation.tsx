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
      {items.map((i) => (
        <NavLink
          key={i.label}
          to={i.to}
          end={i.to === ""}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {i.label}
        </NavLink>
      ))}
    </nav>
  );
}
