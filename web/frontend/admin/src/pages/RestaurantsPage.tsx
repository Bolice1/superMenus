import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { MaterialIcon } from '../components/MaterialIcon'

type Restaurant = {
  _id: string
  name: string
  emailAddress?: string
  phoneNumber?: string
  isActive?: boolean
  address?: string
}

export function RestaurantsPage() {
  const [rows, setRows] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api<{ restaurants: Restaurant[] }>('/restaurants/list?limit=50')
        if (!cancelled) setRows(res.restaurants ?? [])
      } catch {
        if (!cancelled) setRows([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function toggle(id: string) {
    await api(`/restaurants/${id}/status`, { method: 'PATCH' })
    const res = await api<{ restaurants: Restaurant[] }>('/restaurants/list?limit=50')
    setRows(res.restaurants ?? [])
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">Restaurants</h2>
          <p className="text-sm text-on-surface-variant">Venues connected to Super Menus.</p>
        </div>
        <Link
          to="/app/restaurants/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
        >
          <MaterialIcon name="add" />
          Add restaurant
        </Link>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <div
              key={r._id}
              className="flex flex-col rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-on-surface">{r.name}</h3>
                  <p className="text-sm text-on-surface-variant">{r.emailAddress}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{r.address}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                    r.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {r.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggle(r._id)}
                  className="rounded-lg border border-outline px-3 py-2 text-sm font-semibold text-on-surface hover:bg-slate-50"
                >
                  Toggle status
                </button>
                <Link
                  to={`/app/analytics?restaurantId=${r._id}`}
                  className="rounded-lg border border-outline px-3 py-2 text-sm font-semibold text-primary hover:bg-slate-50"
                >
                  Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && rows.length === 0 ? (
        <p className="text-on-surface-variant">No restaurants yet.</p>
      ) : null}
    </div>
  )
}
