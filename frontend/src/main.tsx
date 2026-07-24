import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
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

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)