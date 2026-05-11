import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './layouts/AdminLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AddRestaurantPage } from './pages/AddRestaurantPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CustomersPage } from './pages/CustomersPage'
import { FinancePage } from './pages/FinancePage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { MenuItemsPage } from './pages/MenuItemsPage'
import { OrdersPage } from './pages/OrdersPage'
import { OverviewPage } from './pages/OverviewPage'
import { PlatformManagersPage } from './pages/PlatformManagersPage'
import { RestaurantAdminsPage } from './pages/RestaurantAdminsPage'
import { RestaurantsPage } from './pages/RestaurantsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/new" element={<AddRestaurantPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="menu-items" element={<MenuItemsPage />} />
        <Route path="platform-managers" element={<PlatformManagersPage />} />
        <Route path="restaurant-admins" element={<RestaurantAdminsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
