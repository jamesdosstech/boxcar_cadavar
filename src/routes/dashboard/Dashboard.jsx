import React, { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.styles.scss";
// const DBHeader = lazy(() => import("../../components/DBHeader"));
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
          {navLinks.map(({ path, label }) => (
            <li className="nav-item" key={label}>
              <Link to={path} className="nav-link">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="content">
        <Suspense fallback={<div>Loading...</div>}>
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
    // <div className="dashboard-wrapper">
    //   <div className="sidebar">
    //     <nav className="navbar">
    //       <div className="navbar-brand">
    //         <i className="bi bi-gear-fill me-2"></i>
    //         Admin
    //       </div>
    //       <ul className="navbar-nav">
    //         {navLinks.map(({ path, label, icon }) => (
    //           <li className="nav-item" key={label}>
    //             <Link to={path} className="nav-link">
    //               <i className={`bi ${icon} me-2`} aria-hidden="true"></i>
    //               {label}
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     </nav>
    //   </div>
    //   <div className="content">
    //     <Suspense fallback={<div>Loading...</div>}>
    //       <Routes>
    //         <Route index element={<DBHome />} />
    //         <Route path="/Orders" element={<DBOrders />} />
    //         <Route path="/Products" element={<DBItems />} />
    //         <Route path="/NewProducts" element={<DBNewItems />} />
    //         <Route path="/Users" element={<DBUsers />} />
    //         <Route path="/Products/:id" element={<ProductEdit />} />
    //         <Route path="" element={<DBHome />} />
    //       </Routes>
    //     </Suspense>
    //   </div>
    // </div>
  );
};

export default Dashboard;
