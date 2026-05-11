import { useEffect, useState, type FormEvent } from 'react'
import { ApiError, api } from '../api/client'

type Manager = {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: string
}

export function PlatformManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'manager',
    password: '',
  })
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      const res = await api<{ managers: Manager[] }>('/system-management/list?limit=100')
      setManagers(res.managers ?? [])
    } catch {
      setManagers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    setMsg(null)
    try {
      await api('/system-management/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setMsg('Manager created.')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'manager',
        password: '',
      })
      refresh()
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Create failed')
    }
  }

  async function updateRole(id: string, role: string) {
    setErr(null)
    try {
      await api(`/system-management/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      })
      refresh()
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Update failed')
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this system manager?')) return
    setErr(null)
    try {
      await api(`/system-management/${id}`, { method: 'DELETE' })
      refresh()
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Delete failed')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-6 lg:px-12">
      <div>
        <h2 className="text-2xl font-semibold text-on-surface">Platform managers</h2>
        <p className="text-sm text-on-surface-variant">
          System accounts backed by `/api/system-management`.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="grid gap-4 rounded-2xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm md:grid-cols-2 lg:grid-cols-3"
      >
        <h3 className="md:col-span-2 lg:col-span-3 text-lg font-semibold text-on-surface">
          Register manager
        </h3>
        {msg ? <p className="text-sm text-emerald-700 md:col-span-2 lg:col-span-3">{msg}</p> : null}
        {err ? <p className="text-sm text-error md:col-span-2 lg:col-span-3">{err}</p> : null}
        <input
          required
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          required
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          required
          placeholder="Phone"
          value={form.phoneNumber}
          onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        >
          <option value="admin">admin</option>
          <option value="manager">manager</option>
          <option value="support">support</option>
        </select>
        <input
          required
          type="password"
          placeholder="Temporary password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary-container px-4 py-2 font-semibold text-white md:col-span-2 lg:col-span-1"
        >
          Create
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : (
                managers.map((m) => (
                  <tr key={m._id}>
                    <td className="px-6 py-4 font-semibold">
                      {m.firstName} {m.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{m.email}</td>
                    <td className="px-6 py-4">
                      <select
                        defaultValue={m.role}
                        onChange={(e) => updateRole(m._id, e.target.value)}
                        className="rounded border border-slate-200 px-2 py-1 text-sm"
                      >
                        <option value="admin">admin</option>
                        <option value="manager">manager</option>
                        <option value="support">support</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => remove(m._id)}
                        className="text-sm font-semibold text-error hover:underline"
                      >
                        Delete
                      </button>
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
