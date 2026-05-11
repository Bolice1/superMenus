import { Link } from 'react-router-dom'
import { MaterialIcon } from '../components/MaterialIcon'

const HERO_KITCHEN =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuADeKmMRYK31nBC0VSjuBQdTxqUb2llBQ8EZj-mS9-tlHGlXUeXDKu_pFJ8Z9OPzvfT5krs_zJ2XRh0AacnibGzQ83-uVOzUJloeQVGRVDrbam8IqdiFhmQyHANfW22e1CNaKl_ycTvW7hU4HeaAW7fHPD_HEvs1C6QMITg6nIoj5Ht-HM4lRkjyG9jyMN_r3OHh7g1TGhV5jRrUK3vjKIEEDgbx-qx2mMAVOAyBVjT6mDza-Iutv1gHQU2Ovb56lqdcacD7wpawRXb'

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-background font-sans text-on-surface">
      <header className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-slate-100 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <MaterialIcon name="menu" className="text-orange-600" />
          <h1 className="text-xl font-black text-orange-600">Super Menus</h1>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/app" className="text-sm font-semibold text-orange-600">
            Overview
          </Link>
          <span className="text-sm font-semibold text-slate-500">Orders</span>
          <span className="text-sm font-semibold text-slate-500">Customers</span>
          <span className="text-sm font-semibold text-slate-500">Restaurants</span>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-on-primary transition-all active:opacity-80"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative flex min-h-[640px] items-center overflow-hidden bg-surface lg:min-h-[795px]">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-tertiary blur-[100px]" />
          </div>
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-4 py-1.5">
                <MaterialIcon name="auto_awesome" className="text-sm text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-on-primary-fixed">
                  Next generation platform
                </span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight text-on-background md:text-7xl">
                Empowering Modern <span className="text-primary">Hospitality</span>
              </h2>
              <p className="max-w-lg text-xl leading-relaxed text-on-surface-variant">
                The definitive operating system for high-volume restaurants. Manage menus, track
                real-time orders, and scale your operations with data-driven precision.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/login"
                  className="rounded-xl bg-primary-container px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
                >
                  Get started
                </Link>
                <button
                  type="button"
                  className="rounded-xl border-2 border-outline px-8 py-4 text-lg font-semibold text-on-surface transition-colors hover:bg-surface-container"
                >
                  Watch demo
                </button>
              </div>
            </div>
            <div className="relative flex items-center justify-center lg:h-[600px]">
              <div className="group relative h-[380px] w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl lg:h-[450px]">
                <img
                  src={HERO_KITCHEN}
                  alt="Modern restaurant kitchen"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="glass-card absolute bottom-6 left-6 right-6 rounded-2xl border border-white/40 p-6 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Live kitchen performance</span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">42</div>
                      <div className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Orders
                      </div>
                    </div>
                    <div className="border-x border-slate-200">
                      <div className="text-2xl font-bold text-primary">12m</div>
                      <div className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Avg. wait
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-[10px] font-bold uppercase text-on-surface-variant">
                        Quality
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 space-y-4 text-center">
            <h3 className="text-4xl font-bold text-on-surface">Intelligent infrastructure</h3>
            <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
              Every feature is designed to reduce friction and increase your bottom line, powered by
              our analytics engine.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-12">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low p-10 md:col-span-8">
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg">
                  <MaterialIcon name="monitoring" className="text-3xl" />
                </div>
                <h4 className="mb-4 text-3xl font-bold">Real-time analytics</h4>
                <p className="max-w-md text-lg leading-relaxed text-on-surface-variant">
                  Monitor every transaction and labor metric as it happens. Alerts surface trends
                  before they impact your kitchen.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-3 shadow-sm">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm font-bold">Revenue tracking</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-3 shadow-sm">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-bold">Operations</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-outline-variant/30 bg-surface-container p-8 md:col-span-4">
              <MaterialIcon name="storefront" className="text-4xl text-primary" />
              <div>
                <h4 className="mt-6 text-2xl font-bold">Multi-site control</h4>
                <p className="mt-2 text-on-surface-variant">
                  One console for platform managers and restaurant teams.
                </p>
              </div>
              <Link to="/login" className="mt-8 text-sm font-semibold text-primary hover:underline">
                Open admin portal →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
