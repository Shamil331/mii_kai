import type { MealSet } from '@/types/meal'
import { durationLabel, formatPrice } from '@/lib/catalog'
import { mealImageUrl } from '@/lib/mealImages'

interface MealCardProps {
  meal: MealSet
  selected?: boolean
  onSelect: (id: string) => void
  onAdd: (id: string) => void
}

export function MealCard({ meal, selected, onSelect, onAdd }: MealCardProps) {
  const imageUrl = mealImageUrl(meal.id)

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        selected ? 'border-forest ring-2 ring-forest/30' : 'border-stone'
      }`}
    >
      <button
        type="button"
        className={`relative flex h-40 w-full items-end overflow-hidden p-3 text-left text-white ${
          imageUrl ? 'bg-stone' : `bg-gradient-to-br ${meal.imageGradient}`
        }`}
        onClick={() => onSelect(meal.id)}
        aria-label={`Подробнее: ${meal.name}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <span className="relative rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-forest">
          {durationLabel(meal.duration)}
        </span>
        {selected ? (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-forest px-2 py-1 text-xs">
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
