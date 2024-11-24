import React from "react";
import { Link } from "react-router-dom";
import './DBHome.styles.scss'

const DBHome = () => {
  return (
    <div className="container-fluid d-flex flex-column" data-bs-theme="dark">
      <div className="row flex-grow-1 align-items-center justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <div className="hero-unit">
            <h1 className="hero-title">Welcome to the Admin Dashboard</h1>
            <p className="hero-description">
              Your one-stop place to manage orders, products, users, and more.
            </p>
            <hr className="divider" />
            <p className="hero-info">
              Stay in control, track performance, and make informed decisions.
            </p>
            <Link to="/admin/Orders" className="btn btn-cotton-candy btn-lg">
              Explore Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;
