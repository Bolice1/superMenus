import { useEffect, useState, type FormEvent } from 'react'
import { ApiError, api } from '../api/client'

type Restaurant = { _id: string; name: string }

type Item = {
  _id: string
  name?: string
  price?: number
  status?: string
  category?: string
}

export function MenuItemsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restaurantId, setRestaurantId] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    status: 'available',
    category: 'general',
    image: 'https://placehold.co/400x300/png',
  })

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
      setItems([])
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await api<{ items: Item[] }>(`/items/restaurant/${restaurantId}`)
        if (!cancelled) setItems(res.items ?? [])
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [restaurantId])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!restaurantId) {
      setError('Select a restaurant first.')
      return
    }
    try {
      await api('/items/create', {
        method: 'POST',
        body: JSON.stringify({
          item: {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            status: form.status,
            category: form.category,
            image: form.image,
            restaurantId,
          },
        }),
      })
      const res = await api<{ items: Item[] }>(`/items/restaurant/${restaurantId}`)
      setItems(res.items ?? [])
      setForm({
        name: '',
        description: '',
        price: '',
        status: 'available',
        category: 'general',
        image: 'https://placehold.co/400x300/png',
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create item')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 lg:px-12">
      <div>
        <h2 className="text-2xl font-semibold text-on-surface">Menu items</h2>
        <p className="text-sm text-on-surface-variant">
          List via `GET /items/restaurant/:restaurantId`, create via `POST /items/create`.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-on-surface-variant">Restaurant</label>
        <select
          className="min-w-[240px] rounded-lg border border-slate-200 px-3 py-2"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
        >
          <option value="">Select…</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-xl border border-slate-100 bg-surface-container-lowest p-6 md:grid-cols-2"
      >
        <h3 className="text-lg font-semibold md:col-span-2">Add menu item</h3>
        {error ? <p className="text-sm text-error md:col-span-2">{error}</p> : null}
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          required
          placeholder="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary-container px-4 py-2 font-semibold text-white md:col-span-2"
        >
          Create item
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-on-surface-variant">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-on-surface-variant">
                  No items for this restaurant.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it._id}>
                  <td className="px-4 py-3 font-medium">{it.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{it.category}</td>
                  <td className="px-4 py-3">${Number(it.price ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{it.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
