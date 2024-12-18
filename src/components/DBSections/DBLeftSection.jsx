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
    <nav>
      <div>
        <div>
          <i className="bi bi-gear-fill"></i>
          Admin
        </div>
        <button
          type="button"
          aria-controls="navbarAdminAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span></span>
        </button>
        <div id="navbarAdminAltMarkup">
          <ul>
            {navLinks.map(({ path, label, icon }) => (
              <li key={label}>
                <Link to={path}>
                  <i className={`bi ${icon}`} aria-hidden="true"></i>
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
