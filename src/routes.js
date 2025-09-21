import { createBrowserRouter } from "react-router-dom";

import Splash from "./routes/splash/splash.component";
import Showroom from "./routes/showroom/showroom.component";
import ResetPassword from "./routes/forgot-password/ResetPassword";
import Authentication from "./routes/authentication/authentication.component";
import DoosetrainStore from "./routes/store/DoosetrainStore";
import Checkout from "./routes/checkout/checkout.component";
import { splashMessage } from './constants'
import ErrorPage from "./routes/ErrorPage/ErrorPage";
import RootLayout from "./routes/Root/RootLayout";
import Home from "./routes/dashboard/pages/Home";
import Users from "./routes/dashboard/pages/Users";
// delete
import Orders from "./routes/dashboard/pages/Orders";
import ProtectedGuard from "./guard/ProtectedGuard";
import ProductLayout from "./routes/Product/ProductLayout";
import ProductList from "./routes/Product/ProductList";
import ProductNew from "./routes/Product/ProductNew";
import ProductEdit from "./routes/Product/ProductEdit";
import ProductDetails from "./routes/Product/ProductDetails";
import BlogPage from "./routes/Blog/BlogPage";
//blog
import BlogEntry from './routes/dashboard/pages/Blog/BlogEntry/BlogEntry'
import BlogLayout from "./routes/dashboard/pages/Blog/BlogLayout";
import BlogList from './routes/dashboard/pages/Blog/BlogList/BlogList';
import BlogPost from "./routes/Blog/BlogPost/BlogPost";
import MainBlogLayout from "./routes/Blog/MainBlogLayout";
import BlogDetails from "./routes/dashboard/pages/Blog/BlogDetails/BlogDetails";
import BlogEdit from "./routes/dashboard/pages/Blog/BlogEdit/BlogEdit";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Splash
                    data={splashMessage}
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
                path: 'product/:productId',
                element: <ProductDetails />
            },
            {
                path: 'checkout',
                element: <Checkout />
            },
            {
                path: 'admin',
                element: <ProtectedGuard />,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: 'users',
                        element: <Users />
                    },
                    {
                        path: 'products',
                        element: <ProductLayout />,
                        children: [
                            {
                                index: true,
                                element: <ProductList />
                            },
                            {
                                path: 'new-product',
                                element: <ProductNew />
                            },
                            {
                                path: 'edit/:productId',
                                element: <ProductEdit />
                            }
                        ]
                    },
                    {
                        path: 'blog',
                        element: <BlogLayout />,
                        children: [
                            {
                                index: true,
                                element: <BlogList />
                            },
                            {
                                path: 'new-post',
                                element: <BlogEntry />
                            },
                            {
                                path: ':postId',
                                element: <BlogDetails />
                            },
                            {
                                path: ':postId/edit',
                                element: <BlogEdit />
                            }
                        ]
                    },
                    {
                        path: 'orders',
                        element: <Orders />
                    },
                ]
            }
        ]
    }
])
