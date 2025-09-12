import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../navigation/navigation.component";
import StreamContainer from "../showroom/stream-container/stream-container.component";
import './RootLayout.styles.scss'
function RootLayout() {
    const location = useLocation();
    const hideOnRoutes = ['/sign-in', '/pass-reset', '/checkout', '/admin']
    const showPlayer = !hideOnRoutes.some((path) =>
        location.pathname.startsWith(path)
    )
    
    return (
        <div className="app-container">
            <Navigation />
            
            {/* {showPlayer && <StreamContainer />} */}
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default RootLayout