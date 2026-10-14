import type { DietType, MealSet } from '@/types/meal'

export const DIET_LABELS: Record<DietType | 'all', string> = {
  all: 'Все наборы',
  balanced: 'Balanced',
  light: 'Light',
  protein: 'Protein',
}

export const MEAL_SETS: MealSet[] = [
  {
    id: 'day-balance',
    name: 'День в балансе',
    dietType: 'balanced',
    duration: 'day',
    priceRub: 1490,
    description: 'Пять готовых блюд на один день — без готовки вечером.',
    dishes: ['Овсянка с ягодами', 'Курица с гречкой', 'Лосось и овощи', 'Салат зелёный', 'Творожный десерт'],
    imageGradient: 'from-emerald-800/80 to-stone-400/60',
  },
  {
    id: 'week-light',
    name: 'Лёгкая неделя',
    dietType: 'light',
    duration: 'week',
    priceRub: 6850,
    description: 'Овощной акцент на 7 дней, фиксированное меню.',
    dishes: ['Боул с киноа', 'Индейка и салат', 'Рыба на пару', 'Овощной суп', 'Фруктовый перекус'],
    imageGradient: 'from-lime-700/70 to-amber-200/50',
  },
  {
    id: 'day-protein',
    name: 'Сила белка',
    dietType: 'protein',
    duration: 'day',
    priceRub: 1690,
    description: 'Сытный день с упором на белок — без кастомизации блюд.',
    dishes: ['Омлет с сыром', 'Говядина и рис', 'Куриный боул', 'Творог', 'Протеиновый смузи'],
    imageGradient: 'from-stone-700/80 to-orange-300/40',
  },
  {
    id: 'week-balance',
    name: 'Неделя баланса',
    dietType: 'balanced',
    duration: 'week',
    priceRub: 7490,
    description: 'Готовый ритм на неделю: завтрак, обед, ужин.',
    dishes: ['Разнообразное меню на 7 дней', 'Фиксированный состав', 'Прозрачная цена'],
    imageGradient: 'from-teal-800/70 to-stone-300/50',
  },
  {
    id: 'day-light',
    name: 'Лёгкий день',
    dietType: 'light',
    duration: 'day',
    priceRub: 1390,
    description: 'Больше овощей, меньше тяжести — один день.',
    dishes: ['Смузи-боул', 'Куриный салат', 'Рыба и брокколи', 'Йогурт'],
    imageGradient: 'from-green-600/60 to-yellow-100/50',
  },
  {
    id: 'week-protein',
    name: 'Белковая неделя',
    dietType: 'protein',
    duration: 'week',
    priceRub: 8290,
    description: 'Недельный набор для тех, кому нужно сытнее.',
    dishes: ['Высокобелковые приёмы пищи', 'Фиксированное меню', 'Без AI-рекомендаций'],
    imageGradient: 'from-neutral-800/80 to-rose-200/40',
  },
]

export function filterMealSets(
  sets: MealSet[],
  diet: DietType | 'all',
): MealSet[] {
  if (diet === 'all') return sets
  return sets.filter((s) => s.dietType === diet)
}

export function findMealSet(
  sets: MealSet[],
  id: string,
): MealSet | undefined {
  return sets.find((s) => s.id === id)
}

export function durationLabel(duration: MealSet['duration']): string {
  return duration === 'day' ? '1 день' : '7 дней'
}

export function formatPrice(rub: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(rub)
}
