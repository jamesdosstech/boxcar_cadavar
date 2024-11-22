import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import Navigation from "./routes/navigation/navigation.component";
import Dashboard from "./routes/dashboard/Dashboard";
import Checkout from "./routes/checkout/checkout.component";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./utils/stripe/stripe.utils";
import { routes } from "./routes";
import { useIsAdmin } from "./hooks/useIsAdmin.hook";


const App = () => {
  const isAdmin = useIsAdmin();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigation />}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route
            path="admin/*"
            element={isAdmin ? <Dashboard /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;