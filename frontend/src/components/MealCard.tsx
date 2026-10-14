import type { MealSet } from '@/types/meal'
import { durationLabel, formatPrice } from '@/lib/catalog'

interface MealCardProps {
  meal: MealSet
  selected?: boolean
  onSelect: (id: string) => void
  onAdd: (id: string) => void
}

export function MealCard({ meal, selected, onSelect, onAdd }: MealCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        selected ? 'border-forest ring-2 ring-forest/30' : 'border-stone'
      }`}
    >
      <button
        type="button"
        className={`relative flex h-40 w-full items-end bg-gradient-to-br p-3 text-left text-white ${meal.imageGradient}`}
        onClick={() => onSelect(meal.id)}
        aria-label={`Подробнее: ${meal.name}`}
      >
        <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-forest">
          {durationLabel(meal.duration)}
        </span>
        {selected ? (
          <span className="absolute right-3 top-3 rounded-full bg-forest px-2 py-1 text-xs">
            Выбран
          </span>
        ) : null}
      </button>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">{meal.name}</h3>
          <p className="mt-1 text-sm text-ink/65">{meal.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-forest">
            {formatPrice(meal.priceRub)}
          </p>
          <button
            type="button"
            className="min-h-11 rounded-full bg-forest px-4 text-sm text-white hover:bg-forest-dark"
            onClick={() => onAdd(meal.id)}
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  )
}
