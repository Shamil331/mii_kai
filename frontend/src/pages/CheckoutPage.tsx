import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { createOrder } from '@/lib/api'
import { isAddressValid } from '@/lib/cart'
import { formatPrice } from '@/lib/catalog'
import { formatRuDate, getMinDeliveryDate, isDeliveryDateAllowed } from '@/lib/dates'

export function CheckoutPage() {
  const { items, totalRub, clear, setLastOrder } = useCart()
  const { meals } = useCatalog()
  const { user } = useAuth()
  const navigate = useNavigate()
  const minDate = useMemo(() => getMinDeliveryDate(), [])
  const [deliveryDate, setDeliveryDate] = useState(minDate)
  const [address, setAddress] = useState('')
  const [addressError, setAddressError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [payError, setPayError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: '/checkout' }} />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setPayError(null)

    if (!isDeliveryDateAllowed(deliveryDate)) {
      setDateError('Доставка не ранее чем через 2 дня')
      return
    }
    setDateError(null)

    if (!isAddressValid(address)) {
      setAddressError('Укажите адрес доставки (не короче 8 символов)')
      return
    }
    setAddressError(null)

    if (address.toLowerCase().includes('fail')) {
      setPayError('Оплата отклонена (демо). Корзина сохранена — попробуйте снова.')
      return
    }

    setSubmitting(true)
    const result = await createOrder({
      deliveryDate,
      address: address.trim(),
      items,
      catalog: meals,
    })
    setSubmitting(false)

    if (!result.ok) {
      setPayError(result.error)
      return
    }

    setLastOrder(result.data)
    clear()
    navigate('/confirmation')
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link to="/cart" className="text-sm text-forest underline">
        ← Назад в корзину
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-forest">Оформление</h1>
      <p className="mt-1 text-sm text-ink/60">
        Сумма заказа: <strong>{formatPrice(totalRub)}</strong>
        <br />
        Аккаунт: {user.email}
      </p>

      <form className="mt-8 space-y-5 rounded-2xl border border-stone bg-white p-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="deliveryDate" className="block text-sm font-medium">
            Дата доставки
          </label>
          <input
            id="deliveryDate"
            type="date"
            min={minDate}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border border-stone px-3"
          />
          <p className="mt-1 text-xs text-ink/55">
            Не раньше {formatRuDate(minDate)} (сегодня + 2 дня)
          </p>
          {dateError ? <p className="mt-1 text-sm text-red-700">{dateError}</p> : null}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium">
            Адрес доставки
          </label>
          <textarea
            id="address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Город, улица, дом, квартира"
            className={`mt-1 w-full rounded-xl border px-3 py-2 ${
              addressError ? 'border-red-500' : 'border-stone'
            }`}
          />
          {addressError ? <p className="mt-1 text-sm text-red-700">{addressError}</p> : null}
        </div>

        {payError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {payError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-11 w-full items-center justify-center rounded-full bg-forest text-sm text-white hover:bg-forest-dark disabled:opacity-60"
        >
          {submitting ? 'Сохранение заказа…' : 'Оплатить и сохранить в Supabase'}
        </button>
        <p className="text-xs text-ink/50">
          Демо-оплата: заказ пишется в таблицы orders / order_items. Отказ — если в адресе есть
          «fail».
        </p>
      </form>
    </div>
  )
}
