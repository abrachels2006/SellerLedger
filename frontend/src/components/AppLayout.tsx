import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  WalletCards,
} from "lucide-react"
 
import { useAuth } from "../auth/AuthContext"
 
const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Inventory", path: "/inventory", icon: Package },
  { label: "Sales", path: "/sales", icon: Receipt },
  { label: "Expenses", path: "/expenses", icon: WalletCards },
  { label: "Reports", path: "/reports", icon: BarChart3 },
]
 
export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
 
  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }
 
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="space-y-2 border-b border-slate-200 px-5 py-5">
            <p className="text-lg font-bold leading-tight text-slate-900">
              SellerLedger
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Seller Dashboard
            </p>
          </div>
 
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
 
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
 
          <div className="border-t border-slate-200 px-4 py-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Signed in as
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {user?.name ?? "Unknown user"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
 
              <button
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                type="button"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>
 
        <main className="min-w-0 flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
