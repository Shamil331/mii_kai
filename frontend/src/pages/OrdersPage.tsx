import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { fetchMyOrders } from '@/lib/api'
import { formatPrice } from '@/lib/catalog'
import { formatRuDate } from '@/lib/dates'
import type { ConfirmedOrder } from '@/types/meal'

export function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<ConfirmedOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    fetchMyOrders().then((res) => {
      if (cancelled) return
      if (res.ok) {
        setOrders(res.data)
        setError(null)
      } else {
        setError(res.error)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  if (authLoading) {
    return <p className="p-8 text-center text-ink/60">Загрузка…</p>
  }
  if (!user) {
    return <Navigate to="/auth" state={{ from: '/orders' }} replace />
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-forest">Мои заказы</h1>
      <p className="mt-1 text-sm text-ink/60">{user.email}</p>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-stone/50" />
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-ink/65">Заказов пока нет.</p>
          <Link to="/" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm text-white">
            К наборам
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-stone bg-white p-4 text-sm">
              <p className="font-semibold text-forest">{o.id}</p>
              <p className="mt-1 text-ink/70">
                Доставка: {formatRuDate(o.deliveryDate)} · {formatPrice(o.totalRub)}
              </p>
              <p className="text-ink/60">{o.address}</p>
              <ul className="mt-2 list-disc pl-5 text-ink/80">
                {o.items.map((i) => (
                  <li key={`${o.id}-${i.name}`}>
                    {i.name} × {i.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
