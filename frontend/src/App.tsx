import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { CatalogProvider } from '@/context/CatalogContext'
import { AuthPage } from '@/pages/AuthPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'
import { HomePage } from '@/pages/HomePage'
import { OrdersPage } from '@/pages/OrdersPage'

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-cream">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                </Routes>
              </main>
              <footer className="border-t border-stone px-4 py-6 text-center text-xs text-ink/50">
                NutriDay · ДЗ4–ДЗ5 · Vite + React + Supabase
              </footer>
            </div>
          </BrowserRouter>
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  )
}
