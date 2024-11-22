import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Splash from "./routes/splash/splash.component";
import Showroom from "./routes/showroom/showroom.component";
import ResetPassword from "./routes/forgot-password/ResetPassword";
import Authentication from "./routes/authentication/authentication.component";
import DoosetrainStore from "./routes/store/DoosetrainStore";
import Checkout from "./routes/checkout/checkout.component";
import Dashboard from "./routes/dashboard/Dashboard";
import { splashMessage, trainList } from './constants'
import { getNextFridayAt6PM } from "./utils/dateUtils";
const dayAndHourOfShow = getNextFridayAt6PM();



// {/* <Route path="/" element={<Navigation />}>
//     <Route
//         index
//         element={
//             <Splash
//                 data={splashMessage}
//                 trainList={trainList}
//                 targetDate={dayAndHourOfShow}
//             />
//         }
//     />
//     <Route path="/showroom" element={<Showroom />} />
//     <Route path="/pass-reset" element={<ResetPassword />} />
//     <Route path="sign-in" element={<Authentication />} />
//     <Route path="shop" element={<DoosetrainStore />} />
//     <Route
//         path="admin/*"
//         element={
//             currentUser && currentUser.email === "doosetrain@gmail.com" ? (
//                 <Dashboard />
//             ) : (
//                 <Navigate to="/sign-in" />
//             )
//         }
//     />

//     {/* <Route path='admin/*' element={currentUser && currentUser.email === process.env.REACT_APP_ADMIN_EMAIL ? <Dashboard /> : <Navigate to='/sign-in' />} /> */}
//     <Route path="checkout" element={<Elements stripe={stripePromise} ><Checkout /></Elements>} />
// </Route> */}

export const routes = [
    {
        path: "/", element: <Splash
            data={splashMessage}
            trainList={trainList}
            targetDate={dayAndHourOfShow}
        />
    },
    { path: "/showroom", element: <Showroom /> },
    { path: "/pass-reset", element: <ResetPassword /> },
    { path: "/sign-in", element: <Authentication /> },
    { path: "/shop", element: <DoosetrainStore /> },
    { path: "/checkout", element: <Checkout /> },
];
