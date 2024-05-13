import React from "react";
import "bootstrap-icons/font/bootstrap-icons.json";
import { Link } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../../assets/train-icon.svg";

const DBLeftSection = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary ">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <HomeIcon
              style={{
                width: "30%",
                height: "30%",
                paddingRight: "5px",
                // paddingTop: "10px",
                // paddingLeft: "10px",
              }}
            />
            Admin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarAdminAltMarkup"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarAdminAltMarkup"
          >
            <div className="navbar-nav">
              <div>
                <Link to={"/admin/Home"} className="nav-item nav-link">
                  Home
                </Link>
              </div>
            </div>
            <div className="navbar-nav">
              <div>
                <Link to={"/admin/Orders"} className="nav-item nav-link">
                  Orders
                </Link>
              </div>
            </div>
            <div className="navbar-nav">
              <div>
                <Link to={"/admin/Products"} className="nav-item nav-link">
                  Products
                </Link>
              </div>
            </div>
            <div className="navbar-nav">
              <div>
                <Link to={"/admin/NewProducts"} className="nav-item nav-link">
                  Add Prod
                </Link>
              </div>
            </div>
            <div className="navbar-nav">
              <div>
                <Link to={"/admin/Users"} className="nav-item nav-link">
                  Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
    // <div className='bg-white sidebar'>
    //   <div className='m-2'>
    //     <i className="bi bi-bootstrap-fill me-2 fs-4"></i>
    //     <span className="brand-name fs-4">Doosetrain</span>
    //   </div>
    //   <hr className="text-dark" />
    //   <div className="list-group list-group-flush">
    //     <Link className="list-group-item py-2" to={'/admin/Home'}>
    //       <i className="bi bi-speedometer2 fs-5 me-2"></i>
    //       <span className="fs-5">Home</span>
    //     </Link>
    //     <Link className="list-group-item py-2" to={'/admin/Orders'}>
    //       <i className="bi bi-house fs-5 me-2"></i>
    //       <span className="fs-5">Orders</span>
    //     </Link>
    //     <Link className="list-group-item py-2" to={'/admin/Products'}>
    //       <i className="bi bi-house fs-5 me-2"></i>
    //       <span className="fs-5">Products</span>
    //     </Link>
    //     <Link className="list-group-item py-2" to={'/admin/NewProducts'}>
    //       <i className="bi bi-house fs-5 me-2"></i>
    //       <span className="fs-5">Add Prod</span>
    //     </Link>
    //     <Link className="list-group-item py-2" to={'/admin/Users'}>
    //       <i className="bi bi-house fs-5 me-2"></i>
    //       <span className="fs-5">Users</span>
    //     </Link>
    //   </div>
    // </div>
  );
};

export default DBLeftSection;
