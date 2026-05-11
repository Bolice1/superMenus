import { useState, type FormEvent } from 'react'
import { ApiError, api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function SettingsPage() {
  const { manager } = useAuth()
  const [oldPassword, setOld] = useState('')
  const [newPassword, setNew] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  if (!manager) return null

  async function onChangePassword(e: FormEvent) {
    e.preventDefault()
    if (!manager) return
    setErr(null)
    setMsg(null)
    try {
      await api(`/system-management/profile/${manager.id}/change-password`, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      })
      setMsg('Password updated.')
      setOld('')
      setNew('')
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed')
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 lg:px-12">
      <h2 className="text-2xl font-semibold text-on-surface">Settings</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Signed in as {manager.email} ({manager.role})
      </p>

      <form
        onSubmit={onChangePassword}
        className="mt-8 space-y-4 rounded-xl border border-slate-100 bg-surface-container-lowest p-6 shadow-sm"
      >
        <h3 className="font-semibold text-on-surface">Change password</h3>
        {msg ? <p className="text-sm text-emerald-700">{msg}</p> : null}
        {err ? <p className="text-sm text-error">{err}</p> : null}
        <input
          type="password"
          required
          placeholder="Current password"
          value={oldPassword}
          onChange={(e) => setOld(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-primary-container py-2 font-semibold text-white"
        >
          Update password
        </button>
      </form>
    </div>
  )
}
