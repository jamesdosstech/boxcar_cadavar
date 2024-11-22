import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const DBLeftSection = () => {
  const navLinks = [
    { path: "/admin/Home", label: "Home", icon: "bi-speedometer2" },
    { path: "/admin/Orders", label: "Orders", icon: "bi-box-seam" },
    { path: "/admin/Products", label: "Products", icon: "bi-tag" },
    { path: "/admin/NewProducts", label: "Add Prod", icon: "bi-plus-circle" },
    { path: "/admin/Users", label: "Users", icon: "bi-people" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <div className="navbar-brand">
          <i className="bi bi-gear-fill me-2"></i>
          Admin
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarAdminAltMarkup"
          aria-controls="navbarAdminAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-start"
          id="navbarAdminAltMarkup"
        >
          <ul className="navbar-nav d-flex flex-column flex-lg-row">
            {navLinks.map(({ path, label, icon }) => (
              <li className="nav-item" key={label}>
                <Link to={path} className="nav-link">
                  <i className={`bi ${icon} me-2`} aria-hidden="true"></i>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DBLeftSection;
