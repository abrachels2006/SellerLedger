import { Navigate, Outlet } from "react-router-dom"
 
import { useAuth } from "./AuthContext"
 
export default function RequireAuth() {
  const { status } = useAuth()
 
  if (status === "checking") {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
        <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            SellerLedger
          </p>
          <h1 className="mt-2 text-2xl font-bold">Checking sign-in...</h1>
          <p className="mt-2 text-sm text-slate-600">
            Asking the backend whether the saved token is still valid.
          </p>
        </section>
      </main>
    )
  }
 
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />
  }
 
  // Outlet means: render the protected child routes here.
  return <Outlet />
}
