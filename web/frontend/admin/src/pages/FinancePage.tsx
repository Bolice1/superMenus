import { useEffect, useState } from 'react'
import { api } from '../api/client'

type RecordRow = {
  _id: string
  paid?: number
  remaining?: number
  deadline?: string
  restaurantId?: { name?: string }
  restaurantAdminId?: { firstName?: string; lastName?: string; email?: string }
}

export function FinancePage() {
  const [rows, setRows] = useState<RecordRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api<{ records: RecordRow[] }>('/finance/list')
        if (!cancelled) setRows(res.records ?? [])
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

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-on-surface">Finance</h2>
        <p className="text-sm text-on-surface-variant">Subscription and payout records by restaurant.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Paid</th>
                <th className="px-6 py-4">Remaining</th>
                <th className="px-6 py-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No finance records.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-on-surface">
                      {typeof r.restaurantId === 'object' && r.restaurantId?.name
                        ? r.restaurantId.name
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {typeof r.restaurantAdminId === 'object' && r.restaurantAdminId
                        ? `${r.restaurantAdminId.firstName ?? ''} ${r.restaurantAdminId.lastName ?? ''}`.trim() ||
                          r.restaurantAdminId.email
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">{r.paid ?? 0}</td>
                    <td className="px-6 py-4 text-sm">{r.remaining ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {r.deadline ? new Date(r.deadline).toLocaleDateString() : '—'}
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
