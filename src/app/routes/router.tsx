import React from "react";

import { createBrowserRouter } from "react-router-dom";

import Showroom from "../../features/showroom/showroom.component";
import Authentication from "../../features/authentication/authentication.component";
import Checkout from "../../features/checkout/checkout.component";
import { splashMessage } from "../../constants";
import ProtectedGuard from "../../guard/ProtectedGuard";
import ProductLayout from "../../features/product/ProductLayout";
import ProductList from "../../features/product/ProductList";
import ProductNew from "../../features/product/ProductNew";
import ProductEdit from "../../features/product/ProductEdit";
import ProductDetails from "../../features/product/ProductDetails";

import BlogPage from "../../features/Blog/BlogPage";
//blog
import BlogPost from "../../features/Blog/BlogPost/BlogPost";
import MainBlogLayout from "../../features/Blog/MainBlogLayout";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess";
import DoosetrainStore from "../../features/store/DoosetrainStore";
import CartPage from "../../features/cart/CartPage";
import ResetPassword from "../../features/authentication/forgot-password/ResetPassword";
import Splash from "../../features/splash/splash.component";
import Home from "../../features/dashboard/pages/Home";
import Users from "../../features/dashboard/pages/Users";
import BlogLayout from "../../features/dashboard/pages/Blog/BlogLayout";
import BlogList from "../../features/dashboard/pages/Blog/BlogList/BlogList";
import BlogEntry from "../../features/dashboard/pages/Blog/BlogEntry/BlogEntry";
import BlogDetails from "../../features/dashboard/pages/Blog/BlogDetails/BlogDetails";
import BlogEdit from "../../features/dashboard/pages/Blog/BlogEdit/BlogEdit";
import Orders from "../../features/dashboard/pages/Orders";
import AdminLayout from "../../features/admin/AdminLayout";
import RootLayout from "../layout/root/RootLayout";
import ErrorPage from "../pages/error/ErrorPage";
import Gallery from "../../features/gallery/Gallery";
import ArtworkDetails from "../../features/artwork-details/ArtworkDetails";
import TermsOfService from "../../features/legal/TermsOfService";
import PrivacyPolicy from "../../features/legal/PrivacyPolicy";
import RefundPolicy from "../../features/legal/RefundPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Splash />,
      },
      {
        path: "blog",
        element: <MainBlogLayout />,
        children: [
          {
            index: true,
            element: <BlogPage />,
          },
          {
            path: ":postId",
            element: <BlogPost />,
          },
        ],
      },
      {
        path: "showroom",
        element: <Showroom />,
      },
      {
        path: "pass-reset",
        element: <ResetPassword />,
      },
      {
        path: "sign-in",
        element: <Authentication />,
      },
      {
        path: "shop",
        element: <DoosetrainStore />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "checkout/success",
        element: <CheckoutSuccess />,
      },
      {
        path: "gallery",
        element: <Gallery />,
      },
      {
        path: "gallery/:artworkId",
        element: <ArtworkDetails />,
      },
      {
        path: "terms",
        element: <TermsOfService />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "refund-policy",
        element: <RefundPolicy />,
      },
      {
        path: "admin",
        element: <ProtectedGuard />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Home /> },
              { path: "users", element: <Users /> },
              {
                path: "products",
                element: <ProductLayout />,
                children: [
                  { index: true, element: <ProductList /> },
                  { path: "new-product", element: <ProductNew /> },
                  { path: "edit/:productId", element: <ProductEdit /> },
                ],
              },
              {
                path: "blog",
                element: <BlogLayout />,
                children: [
                  { index: true, element: <BlogList /> },
                  { path: "new-post", element: <BlogEntry /> },
                  { path: ":postId", element: <BlogDetails /> },
                  { path: ":postId/edit", element: <BlogEdit /> },
                ],
              },
              { path: "orders", element: <Orders /> },
            ],
          },
        ],
      },
    ],
  },
]);
