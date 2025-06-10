import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const DBHeader = lazy(() => import("./DBHeader"));
const DBOrders = lazy(() => import("./DBOrders"));
const DBItems = lazy(() => import("./DBItems"));
const DBNewItems = lazy(() => import("./DBNewItems"));
const DBUsers = lazy(() => import("./DBUsers"));
const DBHome = lazy(() => import("./DBHome"));
const ProductEdit = lazy(() => import("../../routes/ProductEdit/OldProductEdit"));

const DBRightSection = () => {
  return (
    <div className="admin-dashboard">
      <DBHeader />
      <div className="admin-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
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

export default DBRightSection;
