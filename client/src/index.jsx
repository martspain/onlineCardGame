import React from "react"
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom"
import { createRoot } from "react-dom/client"
import Homepage from "./components/pages/Homepage/Homepage"
import ErrorPage from "./components/pages/ErrorPage/ErrorPage"
import AboutUs from "./components/pages/AboutUs/AboutUs"
import Credits from "./components/pages/Credits/credits"
import Instructions from "./components/pages/Instructions/Instructions"
import CreateSession from "./components/pages/CreateSession/CreateSession"
import Game from "./components/pages/Game/Game"
import '../connection/connection'

const router = createBrowserRouter([
    // This array is to add new routes to the app.
    {
        path: "/",
        element: <Homepage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/play",
        element: <CreateSession />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/play/:sessionid/:alias",
        element: <Game />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/instructions",
        element: <Instructions />,
        errorElement: <ErrorPage />
    },
    {
        path: "/credits",
        element: <Credits />,
        errorElement: <ErrorPage />
    },
    {
        path: "/about",
        element: <AboutUs />,
        errorElement: <ErrorPage />
    }
])

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
