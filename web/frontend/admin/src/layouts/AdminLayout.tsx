import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { MaterialIcon } from '../components/MaterialIcon'
import { useAuth } from '../context/AuthContext'

type NavItem = {
  to: string
  label: string
  icon: string
  end?: boolean
}

const NAV: NavItem[] = [
  { to: '/app', label: 'Overview', icon: 'dashboard', end: true },
  { to: '/app/orders', label: 'Orders', icon: 'receipt_long' },
  { to: '/app/customers', label: 'Customers', icon: 'group' },
  { to: '/app/restaurants', label: 'Restaurants', icon: 'storefront' },
  { to: '/app/analytics', label: 'Analytics', icon: 'monitoring' },
  { to: '/app/finance', label: 'Finance', icon: 'payments' },
  { to: '/app/menu-items', label: 'Menu items', icon: 'restaurant_menu' },
  { to: '/app/platform-managers', label: 'Platform managers', icon: 'shield_person' },
  { to: '/app/restaurant-admins', label: 'Restaurant admins', icon: 'badge' },
  { to: '/app/settings', label: 'Settings', icon: 'settings' },
]

const PROFILE_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDT0oj4WvEKJmHRrxjkAV0gUjg9z9uAa5mTF0_cn4FqgiKu7J9VLJv9-FBmeLaXBEem3gYs9lQqAYHAspx38cWgKQrbbbFMQ5chDo40Zn-qdx0I_TsiZL7eZwx-JyDM_7PQBMQev61uEZGa7rPb9h0wJ2R2mR6VqVwCCRUMUDoGfDQIZku-dNcrlzNeCRMLNlASskiBLTs0Wxy_qtH7Y-zLGicNr3bDsRoBULBA2OK0eE15l0gMBNb_vDsifpP7VxkULPN3pVkCTAX9'

function navClassName({ isActive }: { isActive: boolean }) {
  const base =
    'flex items-center gap-3 px-4 py-3 transition-colors active:scale-95 duration-150 rounded-r-lg'
  if (isActive) {
    return `${base} text-white border-l-4 border-orange-500 bg-slate-900`
  }
  return `${base} text-slate-400 hover:text-white hover:bg-slate-900 border-l-4 border-transparent`
}

export function AdminLayout() {
  const { manager, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const initials = manager
    ? `${manager.firstName?.[0] ?? ''}${manager.lastName?.[0] ?? ''}`.toUpperCase() || 'SM'
    : 'SM'

  return (
    <div className="min-h-dvh bg-background text-on-background">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-800 bg-slate-950 text-orange-500 shadow-xl transition-transform lg:translate-x-0 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-8">
          <span className="text-xl font-bold text-orange-500">Super Menus</span>
          <p className="mt-1 text-xs text-slate-500">Hospitality Admin</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800">
              <img alt="" className="h-full w-full object-cover" src={PROFILE_IMG} />
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-white">
                {manager ? `${manager.firstName} ${manager.lastName}` : 'Super Menus'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {manager?.role ? manager.role : 'Signed in'}
              </p>
            </div>
          </div>
        </div>
        <nav className="mt-4 flex-1 space-y-0.5 px-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navClassName}
              onClick={() => setDrawerOpen(false)}
            >
              <MaterialIcon name={item.icon} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            <MaterialIcon name="logout" className="text-base" />
            Sign out
          </button>
        </div>
      </aside>

      {drawerOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <header className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-slate-100 bg-white px-6 py-4 shadow-sm lg:ml-64 lg:w-[calc(100%-16rem)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-slate-600 lg:hidden"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <MaterialIcon name="menu" />
          </button>
          <h1 className="text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-500">
            Super Menus Console
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-slate-500 sm:flex dark:border-slate-700 dark:bg-slate-800">
            <MaterialIcon name="calendar_today" className="text-sm" />
            <span className="text-xs font-medium">
              {new Date().toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-xs font-bold text-orange-600 ring-2 ring-white dark:ring-slate-900">
            {initials}
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-surface pb-24 pt-24 lg:ml-64 lg:pb-12">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:hidden dark:border-slate-800 dark:bg-slate-900">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex flex-col items-center rounded-xl px-3 py-1 text-[11px] font-medium transition-transform ${
              isActive
                ? 'scale-110 bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500'
                : 'text-slate-400'
            }`
          }
        >
          <MaterialIcon name="home" />
          Home
        </NavLink>
        <NavLink
          to="/app/orders"
          className={({ isActive }) =>
            `flex flex-col items-center rounded-xl px-3 py-1 text-[11px] font-medium ${
              isActive
                ? 'scale-110 bg-orange-50 text-orange-600 dark:bg-orange-950/30'
                : 'text-slate-400'
            }`
          }
        >
          <MaterialIcon name="list_alt" />
          Orders
        </NavLink>
        <NavLink
          to="/app/customers"
          className={({ isActive }) =>
            `flex flex-col items-center rounded-xl px-3 py-1 text-[11px] font-medium ${
              isActive
                ? 'scale-110 bg-orange-50 text-orange-600 dark:bg-orange-950/30'
                : 'text-slate-400'
            }`
          }
        >
          <MaterialIcon name="person" />
          Users
        </NavLink>
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex flex-col items-center rounded-xl px-3 py-1 text-[11px] font-medium ${
              isActive
                ? 'scale-110 bg-orange-50 text-orange-600 dark:bg-orange-950/30'
                : 'text-slate-400'
            }`
          }
        >
          <MaterialIcon name="more_horiz" />
          More
        </NavLink>
      </nav>

      <footer className="hidden border-t border-slate-200 bg-slate-50 py-10 lg:ml-64 lg:block lg:w-[calc(100%-16rem)] dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 md:flex-row">
          <div className="text-center md:text-left">
            <span className="mb-2 block font-bold text-slate-900 dark:text-white">Super Menus</span>
            <p className="text-sm text-slate-500">© Super Menus Hospitality. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <span className="text-sm text-slate-500">Privacy Policy</span>
            <span className="text-sm text-slate-500">Terms of Service</span>
            <span className="text-sm text-slate-500">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
