import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { durationLabel, findMealSet, formatPrice } from '@/lib/catalog'
import { mealImageUrl } from '@/lib/mealImages'

export function CartPage() {
  const { items, totalRub, changeQty } = useCart()
  const { meals } = useCatalog()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-forest">Корзина пуста</h1>
        <p className="mt-2 text-ink/65">
          Добавьте готовый набор на день или неделю — и вернитесь оформить доставку.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm text-white"
        >
          К наборам
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <h1 className="text-3xl font-semibold text-forest">Ваша корзина</h1>
        <p className="mt-1 text-sm text-ink/60">Готовые наборы к заказу</p>
        <ul className="mt-6 space-y-4">
          {items.map((item) => {
            const meal = findMealSet(meals, item.mealSetId)
            if (!meal) return null
            const line = meal.priceRub * item.quantity
            const imageUrl = mealImageUrl(meal.id)
            return (
              <li
                key={item.mealSetId}
                className="flex flex-col gap-4 rounded-2xl border border-stone bg-white p-4 sm:flex-row sm:items-center"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-20 w-full rounded-xl object-cover sm:w-24"
                  />
                ) : (
                  <div
                    className={`h-20 w-full rounded-xl bg-gradient-to-br sm:w-24 ${meal.imageGradient}`}
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold">{meal.name}</h2>
                  <p className="text-sm text-ink/60">
                    {durationLabel(meal.duration)} · {formatPrice(meal.priceRub)} / набор
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-stone">
                    <button
                      type="button"
                      className="min-h-11 min-w-11 text-lg"
                      aria-label="Уменьшить"
                      onClick={() => changeQty(item.mealSetId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="min-h-11 min-w-11 text-lg"
                      aria-label="Увеличить"
                      onClick={() => changeQty(item.mealSetId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="min-w-24 text-right font-semibold">{formatPrice(line)}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <Link to="/" className="mt-4 inline-block text-sm text-forest underline">
          + Добавить ещё набор
        </Link>
      </div>

      <aside className="h-fit rounded-2xl bg-stone/50 p-5 lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-wide text-ink/50">Итого</p>
        <p className="mt-2 text-3xl font-semibold text-forest">{formatPrice(totalRub)}</p>
        <p className="mt-2 text-xs text-ink/60">
          Для оформления нужен вход в аккаунт. Заказ сохранится в Supabase.
        </p>
        <Link
          to="/checkout"
          className="mt-5 flex min-h-11 items-center justify-center rounded-full bg-forest text-sm text-white hover:bg-forest-dark"
        >
          Оформить — выбрать дату доставки
        </Link>
      </aside>
    </div>
  )
}
