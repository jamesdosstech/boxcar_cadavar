import { Outlet, useLocation } from "react-router-dom";
import Navigation from '../../features/navigation/navigation.component';
import StreamContainer from "../../features/showroom/stream-container/stream-container.component";
import "./RootLayout.styles.scss";

const HIDE_PLAYER_PREFIXES = ["/sign-in", "/pass-reset", "/checkout", "/admin"] as const;

export default function RootLayout() {
  const { pathname } = useLocation();

  const showPlayer = !HIDE_PLAYER_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  return (
    <div className="ds-app-shell">
      <Navigation />

      {/* Keep this commented until you want it back */}
      {/* {showPlayer && <StreamContainer />} */}

      <main className="ds-app-main" role="main">
        <Outlet />
      </main>
    </div>
  );
}