import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { MaterialIcon } from '../components/MaterialIcon'

type Populated = { _id?: string; name?: string; firstName?: string; lastName?: string }
type OrderRow = {
  _id: string
  totalAmount: number
  orderStatus: string
  createdAt: string
  restaurantId?: Populated | string
  userId?: Populated | string
  orderItems?: Populated[]
}

function restaurantName(o: OrderRow) {
  const r = o.restaurantId
  if (r && typeof r === 'object' && 'name' in r) return r.name || 'Restaurant'
  return 'Restaurant'
}

function customerLabel(o: OrderRow) {
  const u = o.userId
  if (u && typeof u === 'object') {
    const n = [u.firstName, u.lastName].filter(Boolean).join(' ')
    if (n) return n
  }
  return 'Customer'
}

function itemsSummary(o: OrderRow) {
  const items = o.orderItems
  if (!Array.isArray(items) || items.length === 0) return '—'
  const names = items.map((i) => (typeof i === 'object' && i?.name ? i.name : 'Item')).slice(0, 3)
  return names.join(', ')
}

export function OrdersPage() {
  const [tab, setTab] = useState<'active' | 'delivered' | 'cancelled'>('active')
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const status =
        tab === 'active' ? undefined : tab === 'delivered' ? 'delivered' : 'cancelled'
      const q = status ? `?orderStatus=${status}&limit=50` : '?limit=50'
      const res = await api<{ orders: OrderRow[] }>(`/orders/list${q}`)
      let list = res.orders ?? []
      if (tab === 'active') {
        list = list.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed')
      }
      setOrders(list)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(() => {
    const active = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed')
      .length
    return { active }
  }, [orders])

  async function setStatus(orderId: string, orderStatus: string) {
    await api('/orders/status', {
      method: 'PATCH',
      body: JSON.stringify({ orderId, orderStatus }),
    })
    load()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mb-6">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Order management</h2>
            <p className="text-sm text-on-surface-variant">
              Manage incoming and historical orders across all restaurants.
            </p>
          </div>
        </div>
        <div className="flex gap-8 overflow-x-auto border-b border-outline-variant/30">
          {(
            [
              ['active', 'New'],
              ['delivered', 'Delivered'],
              ['cancelled', 'Rejected'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                tab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-on-surface'
              }`}
            >
              {label}
              {key === 'active' ? (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-white">
                  {counts.active}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Loading orders…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((o) => (
            <div
              key={o._id}
              className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between border-b border-slate-50 p-5">
                <div>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary">
                    #{String(o._id).slice(-6)}
                  </span>
                  <h3 className="text-lg font-semibold text-on-surface">{restaurantName(o)}</h3>
                </div>
                <span className="rounded-full border border-orange-100 bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700 uppercase">
                  {o.orderStatus}
                </span>
              </div>
              <div className="bg-[#F8F9FA]/50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <MaterialIcon name="lunch_dining" className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">{itemsSummary(o)}</p>
                    <p className="text-xs text-slate-400">
                      {customerLabel(o)} · {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Total</span>
                  <span className="text-xl font-semibold text-primary">
                    ${Number(o.totalAmount).toFixed(2)}
                  </span>
                </div>
                {tab === 'active' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="rounded-lg border border-outline py-2.5 text-sm font-semibold text-on-surface transition-transform hover:bg-slate-50 active:scale-95"
                      onClick={() => setStatus(o._id, 'cancelled')}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-primary-container py-2.5 text-sm font-semibold text-white transition-transform hover:opacity-90 active:scale-95"
                      onClick={() =>
                        setStatus(o._id, o.orderStatus === 'pending' ? 'confirmed' : 'delivered')
                      }
                    >
                      {o.orderStatus === 'pending' ? 'Accept' : 'Mark delivered'}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 ? (
        <p className="text-on-surface-variant">No orders in this tab.</p>
      ) : null}
    </div>
  )
}
