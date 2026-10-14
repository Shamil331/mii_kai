import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from '@/components/Header'
import { CartProvider } from '@/context/CartContext'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'
import { HomePage } from '@/pages/HomePage'

export default function App() {
  return (
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
            </Routes>
          </main>
          <footer className="border-t border-stone px-4 py-6 text-center text-xs text-ink/50">
            NutriDay · Учебный MVP ДЗ4 · Готовые наборы без кастомизации и AI
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}
