import { createBrowserRouter } from "react-router-dom";

import Splash from "./routes/splash/splash.component";
import Showroom from "./routes/showroom/showroom.component";
import ResetPassword from "./routes/forgot-password/ResetPassword";
import Authentication from "./routes/authentication/authentication.component";
import DoosetrainStore from "./routes/store/DoosetrainStore";
import Checkout from "./routes/checkout/checkout.component";
import { splashMessage, trainList } from './constants'
import { getNextFridayAt6PM } from "./utils/dateUtils";
import ErrorPage from "./routes/ErrorPage/ErrorPage";
import RootLayout from "./routes/Root/RootLayout";
import Home from "./routes/dashboard/pages/Home";
import Users from "./routes/dashboard/pages/Users";
// delete
import Products from "./routes/dashboard/pages/Products";
import Orders from "./routes/dashboard/pages/Orders";
import ProtectedGuard from "./guard/ProtectedGuard";
//delete
import DBUsers from "./components/DBSections/DBUsers";
import DBItems from "./components/DBSections/DBItems";
import ProductLayout from "./routes/Product/ProductLayout";
import ProductList from "./routes/Product/ProductList";
import ProductNew from "./routes/Product/ProductNew";
import ProductEdit from "./routes/Product/ProductEdit";
import ProductDetails from "./routes/Product/ProductDetails";
const dayAndHourOfShow = getNextFridayAt6PM();

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
                    trainList={trainList}
                    targetDate={dayAndHourOfShow}
                />
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
                        path: 'orders',
                        element: <Orders />
                    },
                ]
            }
        ]
    }
])
