import "./App.scss"; // Updated to SCSS for better theming
import { Navigate, Route, RouterProvider, Routes } from "react-router-dom";

import Navigation from "./routes/navigation/navigation.component";
// import Dashboard from "./routes/dashboard/Dashboard";
import Checkout from "./routes/checkout/checkout.component";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./utils/stripe/stripe.utils";
import { router } from "./routes";
import { useIsAdmin } from "./hooks/useIsAdmin.hook";
import { VideoPlayerProvider } from "./context/VideoPlayer/VideoPlayerContext";

const App = () => {
  const isAdmin = useIsAdmin();

  return (
    <>
     {/* <VideoPlayerProvider> */}
      <RouterProvider router={router}/>
     {/* </VideoPlayerProvider> */}
    </>
    
  );
};

export default App;
