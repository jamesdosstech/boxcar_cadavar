import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.scss";
import { router } from "./app/routes/router";
import { deleteAllChats } from "./utils/dateUtils";

function scheduleDailyAtNoon(task: () => void) {
  const now = new Date();

  const nextNoon = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    12, 0, 0, 0
  );

  if (now >= nextNoon) nextNoon.setDate(nextNoon.getDate() + 1);

  const msUntilNextNoon = nextNoon.getTime() - now.getTime();

  let intervalId: number | undefined;

  const timeoutId = window.setTimeout(() => {
    task();
    intervalId = window.setInterval(task, 24 * 60 * 60 * 1000);
  }, msUntilNextNoon);

  return () => {
    window.clearTimeout(timeoutId);
    if (intervalId) window.clearInterval(intervalId);
  };
}

export default function App() {
  useEffect(() => {
    return scheduleDailyAtNoon(deleteAllChats);
  }, []);

  return <RouterProvider router={router} />;
}
