import { Link, Navigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/catalog'
import { formatRuDate } from '@/lib/dates'

export function ConfirmationPage() {
  const { lastOrder } = useCart()

  if (!lastOrder) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-xs uppercase tracking-wide text-forest">Заказ подтверждён</p>
      <h1 className="mt-2 text-3xl font-semibold text-forest">Спасибо!</h1>
      <div className="mt-6 space-y-3 rounded-2xl border border-stone bg-white p-5 text-sm">
        <p>
          <span className="text-ink/55">Номер заказа:</span>{' '}
          <strong>{lastOrder.id}</strong>
        </p>
        <p>
          <span className="text-ink/55">Доставка:</span>{' '}
          {formatRuDate(lastOrder.deliveryDate)}
        </p>
        <p>
          <span className="text-ink/55">Адрес:</span> {lastOrder.address}
        </p>
        <p>
          <span className="text-ink/55">Сумма:</span>{' '}
          <strong>{formatPrice(lastOrder.totalRub)}</strong>
        </p>
        <ul className="mt-2 list-disc space-y-1 border-t border-stone pt-3 pl-5">
          {lastOrder.items.map((i) => (
            <li key={i.name}>
              {i.name} × {i.quantity} — {formatPrice(i.lineTotalRub)}
            </li>
          ))}
        </ul>
      </div>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm text-white"
      >
        Вернуться к наборам
      </Link>
    </div>
  )
}
