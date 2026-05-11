import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { MaterialIcon } from '../components/MaterialIcon'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) navigate(params.get('redirect') || '/app', { replace: true })
  }, [token, navigate, params])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate(params.get('redirect') || '/app', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed')
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-surface p-gutter text-on-surface">
      <main className="z-10 w-full max-w-[440px]">
        <div className="mb-xl flex flex-col items-center">
          <div className="mb-md flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container shadow-lg">
            <MaterialIcon name="restaurant" className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-on-background">Super Menus</h1>
          <p className="mt-xs text-on-surface-variant">Hospitality admin portal</p>
        </div>
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-xl shadow-[0_12px_40px_-12px_rgba(26,28,30,0.08)]">
          <h2 className="mb-xl text-2xl font-semibold text-on-surface">Sign in</h2>
          {error ? (
            <p className="mb-4 rounded-lg bg-error-container px-3 py-2 text-sm text-error">{error}</p>
          ) : null}
          <form className="space-y-lg" onSubmit={onSubmit}>
            <div className="space-y-xs">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
              >
                Email address
              </label>
              <div className="relative">
                <MaterialIcon
                  name="mail"
                  className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@supermenus.com"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-3 pl-12 pr-md font-sans text-base outline-none transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                />
              </div>
            </div>
            <div className="space-y-xs">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
                >
                  Password
                </label>
                <span className="text-sm text-primary">Forgot password?</span>
              </div>
              <div className="relative">
                <MaterialIcon
                  name="lock"
                  className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-3 pl-12 pr-md font-sans text-base outline-none transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-md w-full rounded-lg bg-primary-container py-3.5 text-lg font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Sign in
            </button>
          </form>
          <div className="relative my-xl">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50" />
            </div>
            <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wide">
              <span className="bg-surface-container-lowest px-4 text-on-surface-variant">Or</span>
            </div>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant py-3 font-sans text-base text-on-surface transition-all hover:bg-surface-container-low active:scale-[0.98]"
          >
            <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
        <div className="mt-xl text-center">
          <p className="text-sm text-on-surface-variant">
            Need a manager account?{' '}
            <span className="font-semibold text-primary">Request access from your administrator</span>
          </p>
        </div>
      </main>
      <footer className="mt-auto flex w-full max-w-7xl flex-col justify-between gap-6 border-t border-slate-200 px-8 py-12 md:flex-row dark:border-slate-800">
        <div>
          <p className="font-bold text-slate-900 dark:text-white">Super Menus</p>
          <p className="text-sm text-slate-500">© Super Menus Hospitality. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-md">
          <span className="text-sm text-slate-500">Privacy Policy</span>
          <span className="text-sm text-slate-500">Terms of Service</span>
          <span className="text-sm text-slate-500">Contact Support</span>
        </div>
      </footer>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-40">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[40%] rounded-full bg-orange-100 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[30%] rounded-full bg-orange-50 blur-[100px]" />
      </div>
    </div>
  )
}
