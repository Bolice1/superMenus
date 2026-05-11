import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { MaterialIcon } from '../components/MaterialIcon'

type Customer = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  userName?: string
  createdAt?: string
}

export function CustomersPage() {
  const [rows, setRows] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const q = search ? `?search=${encodeURIComponent(search)}&limit=50` : '?limit=50'
        const res = await api<{ customers: Customer[] }>(`/customers/list${q}`)
        if (!cancelled) setRows(res.customers ?? [])
      } catch {
        if (!cancelled) setRows([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [search])

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">Customer management</h2>
          <p className="text-sm text-on-surface-variant">
            View and manage diner accounts across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
          <MaterialIcon name="search" className="text-sm text-slate-400" />
          <input
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 border-none bg-transparent text-sm outline-none md:w-64"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                    No customers found.
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-on-surface">
                      {[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{c.email ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{c.userName ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
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
