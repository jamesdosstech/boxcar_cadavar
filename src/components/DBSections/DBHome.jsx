import React from "react";
import { Link } from "react-router-dom";
import './DBHome.styles.scss'

const DBHome = () => {
  return (
    <div className="home-container" data-theme="dark">
      <div className="home-row">
        <div className="home-column">
          <div className="hero-unit">
            <h1 className="hero-title">Welcome to the Admin Dashboard</h1>
            <p className="hero-description">
              Your one-stop place to manage orders, products, users, and more.
            </p>
            <hr className="divider" />
            <p className="hero-info">
              Stay in control, track performance, and make informed decisions.
            </p>
            <Link to="/admin/Orders" className="btn btn-explore-orders">
              Explore Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;
