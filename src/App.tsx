import {BrowserRouter, useRoutes} from "react-router-dom";
import routes from "@/router/Router.tsx";

function RouterView() {
    return useRoutes(routes);
}

function App() {

    return (
        <BrowserRouter>
            <RouterView/>
        </BrowserRouter>
    )
}

export default App
