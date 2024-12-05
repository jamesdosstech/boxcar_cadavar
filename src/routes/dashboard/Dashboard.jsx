import React, { Suspense, lazy, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./Dashboard.styles.scss";

const AdminHome = lazy(() => import("./pages/Home"));
const AdminUsers = lazy(() => import("./pages/Users"));
const AdminProducts = lazy(() => import("./pages/Products"));
const AdminOrders = lazy(() => import("./pages/Orders"));

const AdminRoute = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navLinks = [
    { path: "/admin", label: "Home", icon: "bi-house-door" },
    { path: "/admin/users", label: "Users", icon: "bi-people" },
    { path: "/admin/products", label: "Products", icon: "bi-box-seam" },
    { path: "/admin/orders", label: "Orders", icon: "bi-bag" },
  ];

  return (
    <div className="admin-wrapper">
      {/* Hamburger button */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Navigation */}
      <nav className={`admin-nav ${menuOpen ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <ul>
          {navLinks.map(({ path, label, icon }) => (
            <li key={path}>
              <NavLink to={path} onClick={() => setMenuOpen(false)}>
                <i className={`bi ${icon}`}></i> {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div className="admin-content">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/orders" element={<AdminOrders />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default AdminRoute;
