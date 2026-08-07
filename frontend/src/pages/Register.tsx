import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
 
import { useAuth } from "../auth/AuthContext"
 
const inputClasses =
  "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
 
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong"
}
 
export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState("Test Seller")
  const [email, setEmail] = useState("seller2@example.com")
  const [password, setPassword] = useState("supersecret123")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
 
    try {
      // register comes from AuthContext. It calls the backend register route,
      // stores the returned token, and saves the current user in React state.
      await register({ name, email, password })
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
 
        <h1 className="mt-2 text-3xl font-bold">Create account</h1>
 
        <p className="mt-2 text-sm text-slate-600">
          Create a local learning-project account for testing authentication.
        </p>
 
        {error ? (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}
 
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              className={inputClasses}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </label>
 
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
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
 
          <button
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
 
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-blue-700 hover:text-blue-800" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
