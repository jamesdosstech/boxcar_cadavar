import React,{ NavLink, Outlet, useLocation } from "react-router-dom";
import "./BlogLayout.styles.scss";

export default function BlogLayout() {
  const location = useLocation();
  const isEditing =
    location.pathname.includes("/edit") || location.pathname.includes("/new-post");

  return (
    <section className="ds-admin-section">
      <header className="ds-admin-section-header">
        <div className="ds-admin-section-title">
          <h2>Blog</h2>
          <p className="ds-admin-section-subtitle">
            Create and manage posts displayed on your public blog.
          </p>
        </div>

        <div className="ds-admin-section-actions">
          {!isEditing && (
            <NavLink
              to="new-post"
              className={({ isActive }) =>
                `ds-btn ds-btn-sm ${isActive ? "ds-btn-ghost" : ""}`
              }
            >
              + New Post
            </NavLink>
          )}
        </div>
      </header>

      <nav className="ds-admin-subnav" aria-label="Blog sub navigation">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `ds-admin-subnav-link ${isActive ? "is-active" : ""}`
          }
        >
          All Posts
        </NavLink>

        <NavLink
          to="new-post"
          className={({ isActive }) =>
            `ds-admin-subnav-link ${isActive ? "is-active" : ""}`
          }
        >
          New Post
        </NavLink>
      </nav>

      <div className="ds-admin-section-body">
        <Outlet />
      </div>
    </section>
  );
}
