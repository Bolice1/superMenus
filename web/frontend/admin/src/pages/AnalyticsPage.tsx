import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { MaterialIcon } from '../components/MaterialIcon'

type Restaurant = { _id: string; name: string }

type Dashboard = {
  dashboard: {
    restaurantName: string
    lastThirtyDays: {
      totalRevenue: number
      totalOrders: number
      completedOrders: number
      cancelledOrders: number
      averageOrderValue: number
      successRate: number
    }
  }
}

export function AnalyticsPage() {
  const [params, setParams] = useSearchParams()
  const restaurantId = params.get('restaurantId') || ''
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [data, setData] = useState<Dashboard['dashboard'] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api<{ restaurants: Restaurant[] }>('/restaurants/list?limit=100')
        if (!cancelled) setRestaurants(res.restaurants ?? [])
      } catch {
        if (!cancelled) setRestaurants([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!restaurantId) {
      setData(null)
      return
    }
    let cancelled = false
    ;(async () => {
      setError(null)
      try {
        const res = await api<Dashboard>(`/analytics/restaurant/${restaurantId}/dashboard`)
        if (!cancelled) setData(res.dashboard)
      } catch (e) {
        if (!cancelled) {
          setData(null)
          setError(e instanceof Error ? e.message : 'Failed to load')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [restaurantId])

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 lg:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">Restaurant analytics</h2>
          <p className="text-sm text-on-surface-variant">
            Select a venue to load `/analytics/restaurant/:id/dashboard`.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="storefront" className="text-on-surface-variant" />
          <select
            className="min-w-[220px] rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
            value={restaurantId}
            onChange={(e) => {
              const v = e.target.value
              setParams(v ? { restaurantId: v } : {})
            }}
          >
            <option value="">Choose restaurant…</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <p className="text-error">{error}</p> : null}

      {data ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              30d revenue
            </p>
            <p className="mt-2 text-3xl font-bold text-on-surface">
              ${data.lastThirtyDays.totalRevenue.toFixed(0)}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">{data.restaurantName}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              30d orders
            </p>
            <p className="mt-2 text-3xl font-bold text-on-surface">{data.lastThirtyDays.totalOrders}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Success rate
            </p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {data.lastThirtyDays.successRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              AOV ${data.lastThirtyDays.averageOrderValue.toFixed(2)}
            </p>
          </div>
        </div>
      ) : !restaurantId ? (
        <p className="text-on-surface-variant">Pick a restaurant to see dashboard metrics.</p>
      ) : (
        <p className="text-on-surface-variant">Loading analytics…</p>
      )}
    </div>
  )
}
