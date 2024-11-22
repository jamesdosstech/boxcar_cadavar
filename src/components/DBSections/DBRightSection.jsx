import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const DBHeader = lazy(() => import("./DBHeader"));
const DBOrders = lazy(() => import("./DBOrders"));
const DBItems = lazy(() => import("./DBItems"));
const DBNewItems = lazy(() => import("./DBNewItems"));
const DBUsers = lazy(() => import("./DBUsers"));
const DBHome = lazy(() => import("./DBHome"));
const ProductEdit = lazy(() => import("../../routes/ProductEdit/ProductEdit"));

const DBRightSection = () => {
  return (
    <div className="container-fluid">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route index element={<DBHome />} />
          <Route path="/Orders" element={<DBOrders />} />
          <Route path="/Products" element={<DBItems />} />
          <Route path="/NewProducts" element={<DBNewItems />} />
          <Route path="/Users" element={<DBUsers />} />
          <Route path="/Products/:id" element={<ProductEdit />} />
          <Route path="" element={<DBHome />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default DBRightSection;
