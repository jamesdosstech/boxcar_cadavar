import React from "react";

import { createBrowserRouter } from "react-router-dom";

import Splash from "../../routes/splash/splash.component";
import Showroom from "../../features/showroom/showroom.component";
import Authentication from "../../features/authentication/authentication.component";
import Checkout from "../../features/checkout/checkout.component";
import { splashMessage } from '../../constants'
import ErrorPage from "../../routes/ErrorPage/ErrorPage";
import RootLayout from "../../routes/Root/RootLayout";
import Home from "../../routes/dashboard/pages/Home";
import Users from "../../routes/dashboard/pages/Users";
// delete
import Orders from "../../routes/dashboard/pages/Orders";
import ProtectedGuard from "../../guard/ProtectedGuard";
import ProductLayout from "../../features/product/ProductLayout";
import ProductList from "../../features/product/ProductList";
import ProductNew from "../../features/product/ProductNew";
import ProductEdit from "../../features/product/ProductEdit";
import ProductDetails from "../../features/product/ProductDetails";

import BlogPage from "../../features/Blog/BlogPage";
//blog
import BlogEntry from '../../routes/dashboard/pages/Blog/BlogEntry/BlogEntry'
import BlogLayout from "../../routes/dashboard/pages/Blog/BlogLayout";
import BlogList from '../../routes/dashboard/pages/Blog/BlogList/BlogList';
import BlogPost from "../../features/Blog/BlogPost/BlogPost";
import MainBlogLayout from "../../features/Blog/MainBlogLayout";
import BlogDetails from "../../routes/dashboard/pages/Blog/BlogDetails/BlogDetails";
import BlogEdit from "../../routes/dashboard/pages/Blog/BlogEdit/BlogEdit";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess";
import AdminLayout from "../../routes/Admin/AdminLayout";
import DoosetrainStore from "../../features/store/DoosetrainStore";
import CartPage from "../../features/cart/CartPage";
import ResetPassword from "../../features/authentication/forgot-password/ResetPassword";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Splash
                />
            },
            {
                path: 'blog',
                element: <MainBlogLayout />,
                children: [
                    {
                        index: true,
                        element: <BlogPage />
                    },
                    {
                        path: ':postId',
                        element: <BlogPost />
                    }
                ]
            },
            {
                path: 'showroom',
                element: <Showroom />
            },
            {
                path: 'pass-reset',
                element: <ResetPassword />
            },
            {
                path: 'sign-in',
                element: <Authentication />
            },
            {
                path: 'shop',
                element: <DoosetrainStore />,
            },
            {
                path: 'cart',
                element: <CartPage />
            },
            {
                path: 'product/:productId',
                element: <ProductDetails />
            },
            {
                path: 'checkout',
                element: <Checkout />
            },
            {
                path: 'checkout/success',
                element: <CheckoutSuccess />
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
            }
        ]
    }
])
