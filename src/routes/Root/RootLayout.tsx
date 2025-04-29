import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../navigation/navigation.component";
import StreamContainer from "../showroom/stream-container/stream-container.component";

function RootLayout() {
    const location = useLocation();
    const hideOnRoutes = ['/sign-in', '/pass-reset', '/checkout', '/admin']
    const showPlayer = !hideOnRoutes.some((path) =>
        location.pathname.startsWith(path)
    )
    
    return (
        <>
            <Navigation />
            
            {/* {showPlayer && <StreamContainer />} */}
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default RootLayout