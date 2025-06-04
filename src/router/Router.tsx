import {lazy, Suspense} from "react";
import {Navigate} from "react-router-dom";
import {PATH} from "@/constant/path.js";

const Home = lazy(() => import("@/pages/Home"))
const Music = lazy(() => import("@/pages/Music"))

const routes = [
    {
        path: "/",
        element: (
            <>
                <Navigate to={PATH.HOME}/>
            </>
        )
    },
    {
        path: PATH.HOME,
        element: (
            <>
                <Suspense fallback={<div>加载中...</div>}>
                    <Home/>
                </Suspense>
            </>
        )
    },
    {
        path: PATH.MUSIC,
        element: (
            <>
                <Suspense fallback={<div>加载中...</div>}>
                    <Music/>
                </Suspense>
            </>
        )
    }
]

export default routes;