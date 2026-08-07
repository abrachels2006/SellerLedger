import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
 
import { useAuth } from "../auth/AuthContext"
 
const inputClasses =
  "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
 
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong"
}
 
export default function Login() {
  const navigate = useNavigate()
  const { login, status } = useAuth()
  const [email, setEmail] = useState("seller@example.com")
  const [password, setPassword] = useState("supersecret123")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
 
    try {
      // login comes from AuthContext. It calls the backend, stores the token,
      // and updates the current user when the password is correct.
      await login({ email, password })
      navigate("/", { replace: true })
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    } finally {
      setIsSubmitting(false)
    }
  }
 
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          SellerLedger
        </p>
 
        <h1 className="mt-2 text-3xl font-bold">Sign in</h1>
 
        <p className="mt-2 text-sm text-slate-600">
          Use the account created in Week 4 Project 1 or register a new one.
        </p>
 
        {status === "checking" ? (
          <p className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Checking existing sign-in...
          </p>
        ) : null}
 
        {error ? (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}
 
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              className={inputClasses}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
 
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              className={inputClasses}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
 
          <button
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
 
        <p className="mt-6 text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link className="font-semibold text-blue-700 hover:text-blue-800" to="/register">
            Register here
          </Link>
        </p>
      </section>
    </main>
  )
}
