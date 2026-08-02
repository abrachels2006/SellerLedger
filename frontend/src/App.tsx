import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Sales from "./pages/Sales"
 
function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">This page is coming soon.</p>
    </section>
  )
}
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="sales" element={<Sales />} />
          <Route path="expenses" element={<PlaceholderPage title="Expenses" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
