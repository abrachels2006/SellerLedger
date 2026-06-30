import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import AppLayout from "./components/AppLayout"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Sales from "./pages/Sales"
import Expenses from "./pages/Expenses"
import Reports from "./pages/Reports"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "sales", element: <Sales /> },
      { path: "expenses", element: <Expenses /> },
      { path: "reports", element: <Reports /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)