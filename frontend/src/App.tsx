import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
 
import RequireAuth from "./auth/RequireAuth"
import AppLayout from "./components/AppLayout"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Sales from "./pages/Sales"
 
function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
        Coming soon
      </p>
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="text-slate-600">
        This page is still a placeholder, but it is now protected behind login.
      </p>
    </section>
  )
}
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes: users can visit these before signing in. */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
 
        {/* Protected routes: RequireAuth decides whether AppLayout may render. */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<Sales />} />
            <Route path="expenses" element={<PlaceholderPage title="Expenses" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          </Route>
        </Route>
 
        {/* Unknown addresses go back to the protected dashboard route. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
