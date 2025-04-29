import { createBrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

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
import Products from "./routes/dashboard/pages/Products";
import Orders from "./routes/dashboard/pages/Orders";
import ProtectedGuard from "./guard/ProtectedGuard";
import DBUsers from "./components/DBSections/DBUsers";
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
                element: <DoosetrainStore />
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
                        element: <Products />
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
