import { useEffect, useMemo, useState } from 'react'
import { MealCard } from '@/components/MealCard'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import {
  DIET_LABELS,
  durationLabel,
  filterMealSets,
  findMealSet,
  formatPrice,
} from '@/lib/catalog'
import { HERO_IMAGE, mealImageUrl } from '@/lib/mealImages'
import type { DietType } from '@/types/meal'

type Filter = DietType | 'all'

export function HomePage() {
  const { addMeal } = useCart()
  const { meals, loading, error, usingFallback, reload } = useCatalog()
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('nutriday-onboarding-done') !== '1'
  })

  useEffect(() => {
    if (!selectedId && meals[0]) {
      setSelectedId(meals[0].id)
    }
  }, [meals, selectedId])

  const visible = useMemo(() => filterMealSets(meals, filter), [meals, filter])
  const selected = selectedId ? findMealSet(meals, selectedId) : undefined
  const selectedImage = selected ? mealImageUrl(selected.id) : undefined

  function dismissOnboarding() {
    localStorage.setItem('nutriday-onboarding-done', '1')
    setShowOnboarding(false)
  }

  function handleAdd(id: string) {
    addMeal(id)
    const meal = findMealSet(meals, id)
    setToast(meal ? `«${meal.name}» добавлен в корзину` : 'Добавлено в корзину')
    window.setTimeout(() => setToast(null), 2200)
  }

  return (
    <div>
      {showOnboarding ? (
        <section className="border-b border-stone bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/50">
                Как работает NutriDay
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink/80">
                <li>Выберите тип рациона и набор на день или неделю</li>
                <li>Соберите корзину и укажите адрес</li>
                <li>Войдите и оплатите — доставка не раньше чем через 2 дня</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <a
                href="#catalog"
                className="min-h-11 rounded-full bg-forest px-4 py-2 text-sm text-white"
                onClick={dismissOnboarding}
              >
                К наборам
              </a>
              <button
                type="button"
                className="min-h-11 rounded-full border border-stone px-4 py-2 text-sm"
                onClick={dismissOnboarding}
              >
                Пропустить
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {error ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950">
          {error}{' '}
          <button type="button" className="underline" onClick={reload}>
            Обновить
          </button>
          {usingFallback ? ' · после применения SQL-миграции данные придут из Supabase' : null}
        </div>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-0 px-4 py-8 md:grid-cols-2 md:items-stretch">
        <div className="flex flex-col justify-center rounded-l-3xl bg-stone/40 p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
            Вкусно. Просто. По делу.
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-forest md:text-5xl">
            Хороший день начинается с заботы.
          </h1>
          <p className="mt-4 max-w-md text-ink/70">
            Готовые наборы полезных блюд на день или неделю. Уже приготовили —
            осталось только выбрать.
          </p>
          <a
            href="#catalog"
            className="mt-6 inline-flex min-h-11 w-fit items-center rounded-full bg-forest px-5 py-2 text-sm text-white hover:bg-forest-dark"
          >
            Выбрать наборы →
          </a>
          <p className="mt-3 text-xs text-ink/50">Каталог загружается из Supabase</p>
        </div>
        <div
          className="relative min-h-64 overflow-hidden rounded-r-3xl md:min-h-[22rem]"
          aria-hidden
        >
          <img
            src={HERO_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/25 to-transparent" />
          <div className="relative flex h-full min-h-64 flex-col justify-between p-6 text-white md:min-h-[22rem]">
            <p className="text-sm uppercase tracking-wide text-white/90">
              Еда, которая заботится
            </p>
            <p className="text-lg">
              Фиксированное меню · Без сложной кастомизации · Без AI-upsell
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 pb-4">
        <h2 className="text-xl font-semibold text-forest">Наборы на ваш ритм</h2>
        <p className="mt-1 text-sm text-ink/60">
          Выберите то, что подходит именно сегодня.
        </p>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(DIET_LABELS) as Filter[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`min-h-11 rounded-full px-4 text-sm ${
                filter === key
                  ? 'bg-forest text-white'
                  : 'border border-stone bg-white text-ink/80'
              }`}
              onClick={() => setFilter(key)}
            >
              {DIET_LABELS[key]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-stone/60" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border border-stone bg-white p-8 text-center text-ink/70">
            Наборы временно недоступны. Обновите страницу позже.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {visible.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  selected={meal.id === selectedId}
                  onSelect={setSelectedId}
                  onAdd={handleAdd}
                />
              ))}
            </div>
            <aside className="h-fit rounded-2xl border border-stone bg-white p-5 shadow-sm lg:sticky lg:top-24">
              {selected ? (
                <>
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt=""
                      className="mb-4 h-36 w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <p className="text-xs uppercase tracking-wide text-ink/50">
                    Состав набора
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">{selected.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    {durationLabel(selected.duration)} · {formatPrice(selected.priceRub)}
                  </p>
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink/80">
                    {selected.dishes.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-ink/50">
                    Доставка не раньше чем через 2 дня после заказа.
                  </p>
                  <button
                    type="button"
                    className="mt-4 min-h-11 w-full rounded-full bg-forest text-sm text-white hover:bg-forest-dark"
                    onClick={() => handleAdd(selected.id)}
                  >
                    Добавить в корзину
                  </button>
                </>
              ) : (
                <p className="text-sm text-ink/60">Выберите набор, чтобы увидеть состав.</p>
              )}
            </aside>
          </div>
        )}
      </section>

      {toast ? (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-forest px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  )
}
