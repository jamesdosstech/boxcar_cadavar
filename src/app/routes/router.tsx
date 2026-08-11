import React, { Suspense, lazy } from "react";

import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root/RootLayout";
import ErrorPage from "../pages/error/ErrorPage";
import ProtectedGuard from "../../guard/ProtectedGuard";

const Showroom = lazy(
  () => import("../../features/showroom/showroom.component")
);
const Authentication = lazy(
  () => import("../../features/authentication/authentication.component")
);
const Checkout = lazy(
  () => import("../../features/checkout/checkout.component")
);
const ProductLayout = lazy(
  () => import("../../features/product/ProductLayout")
);
const ProductList = lazy(() => import("../../features/product/ProductList"));
const ProductNew = lazy(() => import("../../features/product/ProductNew"));
const ProductEdit = lazy(() => import("../../features/product/ProductEdit"));
const ProductDetails = lazy(
  () => import("../../features/product/ProductDetails")
);
const BlogPage = lazy(() => import("../../features/Blog/BlogPage"));
const BlogPost = lazy(() => import("../../features/Blog/BlogPost/BlogPost"));
const MainBlogLayout = lazy(() => import("../../features/Blog/MainBlogLayout"));
const CheckoutSuccess = lazy(
  () => import("../../features/checkout/CheckoutSuccess")
);
const DoosetrainStore = lazy(
  () => import("../../features/store/DoosetrainStore")
);
const CartPage = lazy(() => import("../../features/cart/CartPage"));
const ResetPassword = lazy(
  () => import("../../features/authentication/forgot-password/ResetPassword")
);
const Splash = lazy(() => import("../../features/splash/splash.component"));
const Home = lazy(() => import("../../features/dashboard/pages/Home"));
const Users = lazy(() => import("../../features/dashboard/pages/Users"));
const BlogLayout = lazy(
  () => import("../../features/dashboard/pages/Blog/BlogLayout")
);
const BlogList = lazy(
  () => import("../../features/dashboard/pages/Blog/BlogList/BlogList")
);
const BlogEntry = lazy(
  () => import("../../features/dashboard/pages/Blog/BlogEntry/BlogEntry")
);
const BlogDetails = lazy(
  () => import("../../features/dashboard/pages/Blog/BlogDetails/BlogDetails")
);
const BlogEdit = lazy(
  () => import("../../features/dashboard/pages/Blog/BlogEdit/BlogEdit")
);
const Orders = lazy(() => import("../../features/dashboard/pages/Orders"));
const AdminLayout = lazy(() => import("../../features/admin/AdminLayout"));
const Gallery = lazy(() => import("../../features/gallery/Gallery"));
const ArtworkDetails = lazy(
  () => import("../../features/artwork-details/ArtworkDetails")
);
const TermsOfService = lazy(
  () => import("../../features/legal/TermsOfService")
);
const PrivacyPolicy = lazy(() => import("../../features/legal/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("../../features/legal/RefundPolicy"));

// Small wrapper so every route gets a loading fallback without repeating
// <Suspense> around each one individually below.
const withSuspense = (element: React.ReactNode) => (
  <Suspense
    fallback={
      <div style={{ padding: "3rem", textAlign: "center", color: "white" }}>
        Loading…
      </div>
    }
  >
    {element}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<RootLayout />),
    errorElement: withSuspense(<ErrorPage />),
    children: [
      {
        index: true,
        element: withSuspense(<Splash />),
      },
      {
        path: "blog",
        element: withSuspense(<MainBlogLayout />),
        children: [
          {
            index: true,
            element: withSuspense(<BlogPage />),
          },
          {
            path: ":postId",
            element: withSuspense(<BlogPost />),
          },
        ],
      },
      {
        path: "showroom",
        element: withSuspense(<Showroom />),
      },
      {
        path: "pass-reset",
        element: withSuspense(<ResetPassword />),
      },
      {
        path: "sign-in",
        element: withSuspense(<Authentication />),
      },
      {
        path: "shop",
        element: withSuspense(<DoosetrainStore />),
      },
      {
        path: "cart",
        element: withSuspense(<CartPage />),
      },
      {
        path: "product/:productId",
        element: withSuspense(<ProductDetails />),
      },
      {
        path: "checkout",
        element: withSuspense(<Checkout />),
      },
      {
        path: "checkout/success",
        element: withSuspense(<CheckoutSuccess />),
      },
      {
        path: "gallery",
        element: withSuspense(<Gallery />),
      },
      {
        path: "gallery/:artworkId",
        element: withSuspense(<ArtworkDetails />),
      },
      {
        path: "terms",
        element: withSuspense(<TermsOfService />),
      },
      {
        path: "privacy",
        element: withSuspense(<PrivacyPolicy />),
      },
      {
        path: "refund-policy",
        element: withSuspense(<RefundPolicy />),
      },
      {
        path: "admin",
        element: withSuspense(<ProtectedGuard />),
        children: [
          {
            element: withSuspense(<AdminLayout />),
            children: [
              { index: true, element: withSuspense(<Home />) },
              { path: "users", element: withSuspense(<Users />) },
              {
                path: "products",
                element: withSuspense(<ProductLayout />),
                children: [
                  { index: true, element: withSuspense(<ProductList />) },
                  {
                    path: "new-product",
                    element: withSuspense(<ProductNew />),
                  },
                  {
                    path: "edit/:productId",
                    element: withSuspense(<ProductEdit />),
                  },
                ],
              },
              {
                path: "blog",
                element: withSuspense(<BlogLayout />),
                children: [
                  { index: true, element: withSuspense(<BlogList />) },
                  { path: "new-post", element: withSuspense(<BlogEntry />) },
                  { path: ":postId", element: withSuspense(<BlogDetails />) },
                  { path: ":postId/edit", element: withSuspense(<BlogEdit />) },
                ],
              },
              { path: "orders", element: withSuspense(<Orders />) },
            ],
          },
        ],
      },
    ],
  },
]);
