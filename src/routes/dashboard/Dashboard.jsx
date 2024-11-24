import React, { Suspense, lazy } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.styles.scss";

// Lazy load components for better performance
const DBOrders = lazy(() => import("../../components/DBSections/DBOrders"));
const DBItems = lazy(() => import("../../components/DBSections/DBItems"));
const DBNewItems = lazy(() => import("../../components/DBSections/DBNewItems"));
const DBUsers = lazy(() => import("../../components/DBSections/DBUsers"));
const DBHome = lazy(() => import("../../components/DBSections/DBHome"));
const ProductEdit = lazy(() => import("../../routes/ProductEdit/ProductEdit"));

const Dashboard = () => {
  const navLinks = [
    { path: "/admin/Home", label: "Home", icon: "bi-speedometer2" },
    { path: "/admin/Orders", label: "Orders", icon: "bi-box-seam" },
    { path: "/admin/Products", label: "Products", icon: "bi-tag" },
    { path: "/admin/NewProducts", label: "Add Prod", icon: "bi-plus-circle" },
    { path: "/admin/Users", label: "Users", icon: "bi-people" },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="navbar-brand">
          <i className="bi bi-gear-fill me-2"></i> Admin Dashboard
        </div>
        <ul className="navbar-nav">
          {navLinks.map(({ path, label, icon }) => (
            <li className="nav-item" key={path}>
              <NavLink
                to={path}
                className="nav-link"
                activeClassName="active"
                aria-label={label}
              >
                <i className={`bi ${icon} me-2`} aria-hidden="true"></i>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        <Suspense fallback={<div role="status" aria-live="polite"><p>Loading, please wait...</p></div>}>
          <Routes>
            <Route index element={<DBHome />} />
            <Route path="/Orders" element={<DBOrders />} />
            <Route path="/Products" element={<DBItems />} />
            <Route path="/NewProducts" element={<DBNewItems />} />
            <Route path="/Users" element={<DBUsers />} />
            <Route path="/Products/:id" element={<ProductEdit />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
