import { useEffect, useState } from 'react'
import { api } from '../api/client'

type Admin = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  restaurantId?: { name?: string }
}

export function RestaurantAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api<{ admins: Admin[] }>('/restaurant-admins/list/all?limit=100')
        if (!cancelled) setAdmins(res.admins ?? [])
      } catch {
        if (!cancelled) setAdmins([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-on-surface">Restaurant admins</h2>
        <p className="text-sm text-on-surface-variant">
          Venue operators from `/api/restaurant-admins/list/all`.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Restaurant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">
                    No restaurant admins.
                  </td>
                </tr>
              ) : (
                admins.map((a) => (
                  <tr key={a._id}>
                    <td className="px-6 py-4 font-semibold">
                      {[a.firstName, a.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{a.email ?? '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      {typeof a.restaurantId === 'object' && a.restaurantId?.name
                        ? a.restaurantId.name
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
