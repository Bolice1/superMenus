import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, api } from '../api/client'
import { MaterialIcon } from '../components/MaterialIcon'

export function AddRestaurantPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNumber, setPhone] = useState('')
  const [emailAddress, setEmail] = useState('')
  const [website, setWebsite] = useState('https://')
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState('https://placehold.co/128x128/png')
  const [banner, setBanner] = useState('https://placehold.co/1200x400/png')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await api('/restaurants/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          address,
          phoneNumber,
          emailAddress,
          website,
          description,
          logo,
          banner,
        }),
      })
      navigate('/app/restaurants')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create restaurant')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-4 md:px-8">
      <header className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link to="/app/restaurants" className="text-on-surface-variant hover:text-primary">
            <MaterialIcon name="arrow_back" />
          </Link>
          <h1 className="text-xl font-black text-orange-600 dark:text-orange-500">Super Menus</h1>
        </div>
      </header>

      <nav className="mb-12">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-1/2 left-0 z-0 h-0.5 w-full -translate-y-1/2 bg-secondary-container" />
          <div className="absolute top-1/2 left-0 z-0 h-0.5 w-1/3 -translate-y-1/2 bg-primary" />
          {['Basic info', 'Menu', 'Delivery'].map((label, i) => (
            <div key={label} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  i === 0
                    ? 'bg-primary text-on-primary shadow-[0_0_0_4px_rgba(160,65,0,0.2)]'
                    : 'bg-secondary-container text-on-secondary-container'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  i === 0 ? 'text-primary' : 'text-secondary'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </nav>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_12px_rgba(26,28,30,0.06)]">
        <div className="border-b border-slate-100 bg-slate-50/50 p-8">
          <h2 className="text-2xl font-semibold text-on-background">Create restaurant profile</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Provide the details required by the API. Logo and banner can be placeholder URLs for now.
          </p>
        </div>
        <form className="space-y-8 p-8" onSubmit={onSubmit}>
          {error ? (
            <p className="rounded-lg bg-error-container px-3 py-2 text-sm text-error">{error}</p>
          ) : null}
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            <div className="space-y-xs">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Restaurant name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary"
                placeholder="The Golden Bistro"
              />
            </div>
            <div className="space-y-xs">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Phone
              </label>
              <input
                required
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            <div className="space-y-xs">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Email
              </label>
              <input
                required
                type="email"
                value={emailAddress}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-xs">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Website
              </label>
              <input
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-xs">
            <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Address
            </label>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-xs">
            <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            <div className="space-y-xs">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Logo URL
              </label>
              <input
                required
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 font-mono text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-xs">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Banner URL
              </label>
              <input
                required
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-surface-container-low px-4 py-3 font-mono text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Link
              to="/app/restaurants"
              className="rounded-lg border border-outline px-6 py-3 text-sm font-semibold text-on-surface hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-primary-container px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
