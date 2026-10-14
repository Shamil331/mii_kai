import { Link, NavLink } from 'react-router-dom'
import { useCart } from '@/context/CartContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm ${isActive ? 'text-forest font-semibold' : 'text-ink/70 hover:text-forest'}`

export function Header() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-20 border-b border-stone/80 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-forest">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/30 text-sm">
            ◆
          </span>
          <span className="text-lg font-semibold tracking-tight">NutriDay</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkClass} end>
            Наборы
          </NavLink>
          <a href="#how" className="text-sm text-ink/70 hover:text-forest">
            Как это работает
          </a>
        </nav>
        <Link
          to="/cart"
          className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm text-white hover:bg-forest-dark"
        >
          Корзина
          {count > 0 ? (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span>
          ) : null}
        </Link>
      </div>
    </header>
  )
}
