import "./App.scss"; // Updated to SCSS for better theming
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useIsAdmin } from "./hooks/useIsAdmin.hook";
import { useEffect } from "react";
import { deleteAllChats } from "./utils/dateUtils";

const App = () => {
  useEffect(() => {
    const scheduleNextDeletion = () => {
      const now = new Date();
      let nextNoon = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        12, 0, 0
      );

      // If it's past noon today, schedule for tomorrow
      if (now >= nextNoon) {
        nextNoon.setDate(nextNoon.getDate() + 1);
      }

      const msUntilNextNoon: number = nextNoon.getTime() - now.getTime();

      // Schedule deletion at next noon
      const timeoutId = setTimeout(() => {
        deleteAllChats();

        // After first deletion, schedule recurring deletion every 24 hours
        setInterval(deleteAllChats, 24 * 60 * 60 * 1000);
      }, msUntilNextNoon);

      return () => clearTimeout(timeoutId);
    };

    const cleanup = scheduleNextDeletion();

    return cleanup;
  }, [])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
};

export default App;
