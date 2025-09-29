import "./App.scss"; // Updated to SCSS for better theming
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useIsAdmin } from "./hooks/useIsAdmin.hook";

const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
};

export default App;
