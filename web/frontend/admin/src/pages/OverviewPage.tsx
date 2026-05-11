import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { MaterialIcon } from '../components/MaterialIcon'

type Stats = { stats: { total: number; active: number; inactive: number } }

export function OverviewPage() {
  const [restaurantStats, setRestaurantStats] = useState<Stats['stats'] | null>(null)
  const [customerTotal, setCustomerTotal] = useState<number | null>(null)
  const [orderTotal, setOrderTotal] = useState<number | null>(null)
  const [topRestaurants, setTopRestaurants] = useState<
    { _id: string; name: string; isActive?: boolean }[]
  >([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [s, cust, ord, rests] = await Promise.all([
          api<Stats>('/restaurants/stats'),
          api<{ pagination: { total: number } }>('/customers/list?limit=1'),
          api<{ total: number }>('/orders/list?limit=1'),
          api<{ restaurants: { _id: string; name: string; isActive?: boolean }[] }>(
            '/restaurants/list?limit=5',
          ),
        ])
        if (cancelled) return
        setRestaurantStats(s.stats)
        setCustomerTotal(cust.pagination?.total ?? 0)
        setOrderTotal(ord.total ?? 0)
        setTopRestaurants(rests.restaurants ?? [])
      } catch {
        if (!cancelled) {
          setRestaurantStats(null)
          setCustomerTotal(null)
          setOrderTotal(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 lg:px-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-on-surface">Overview analytics</h2>
          <p className="mt-1 font-sans text-on-surface-variant">
            Real-time performance tracking for all hospitality units.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
          >
            Export report
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90"
            onClick={() => window.location.reload()}
          >
            Refresh data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              <MaterialIcon name="payments" />
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
              Live
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Restaurants
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-on-surface">
              {restaurantStats?.total ?? '—'}
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              {restaurantStats ? `${restaurantStats.active} active` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <MaterialIcon name="shopping_bag" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Orders (total)
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-on-surface">{orderTotal ?? '—'}</h3>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <MaterialIcon name="person_add" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Customers
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-on-surface">{customerTotal ?? '—'}</h3>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-surface-container-lowest p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-on-surface">Revenue over time</h4>
            <p className="text-sm text-on-surface-variant">
              Connect restaurants and open Analytics for per-venue charts.
            </p>
          </div>
          <select className="rounded-lg border-none bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-primary">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="relative h-[260px] w-full md:h-[300px]">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 300">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#ff6b00" stopOpacity="0.2" />
                <stop offset="95%" stopColor="#ff6b00" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[50, 125, 200, 275].map((y) => (
              <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            ))}
            <path
              d="M0,275 L100,220 L200,240 L300,180 L400,200 L500,120 L600,150 L700,80 L800,100 L800,300 L0,300 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M0,275 L100,220 L200,240 L300,180 L400,200 L500,120 L600,150 L700,80 L800,100"
              fill="none"
              stroke="#ff6b00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className="mt-4 flex justify-between text-sm font-medium text-slate-400">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-6">
          <h4 className="text-lg font-semibold text-on-surface">Recent restaurants</h4>
          <Link to="/app/restaurants" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topRestaurants.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-on-surface">{r.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        r.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {topRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-on-surface-variant">
                    No restaurants yet. Add one from Restaurants.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
