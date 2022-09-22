import React from "react"
import ReactDOM from "react-dom"
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom"
import Homepage from "./components/pages/Homepage/Homepage"
import ErrorPage from "./components/pages/ErrorPage/ErrorPage"

const router = createBrowserRouter([
    // This array is to add new routes to the app.
    {
        path: "/",
        element: <Homepage />,
        errorElement: <ErrorPage />,
    },
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
