import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./ProductLayout.styles.scss";

export default function ProductLayout() {
  const location = useLocation();
  const isEditing = location.pathname.includes("/edit/");

  return (
    <section className="ds-admin-section">
      <header className="ds-admin-section-header">
        <div className="ds-admin-section-title">
          <h2>Products</h2>
          <p className="ds-admin-section-subtitle">
            Manage catalog items, pricing, and inventory.
          </p>
        </div>

        <div className="ds-admin-section-actions">
          {!isEditing && (
            <NavLink
              to="new-product"
              className={({ isActive }) =>
                `ds-btn ds-btn-sm ${isActive ? "ds-btn-ghost" : ""}`
              }
            >
              + New Product
            </NavLink>
          )}
        </div>
      </header>

      <nav className="ds-admin-subnav" aria-label="Products sub navigation">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `ds-admin-subnav-link ${isActive ? "is-active" : ""}`
          }
        >
          All Products
        </NavLink>

        <NavLink
          to="new-product"
          className={({ isActive }) =>
            `ds-admin-subnav-link ${isActive ? "is-active" : ""}`
          }
        >
          New Product
        </NavLink>
      </nav>

      <div className="ds-admin-section-body">
        <Outlet />
      </div>
    </section>
  );
}
