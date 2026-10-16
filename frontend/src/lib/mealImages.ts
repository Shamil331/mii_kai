import dayBalance from '@/assets/meals/day-balance.jpg'
import dayLight from '@/assets/meals/day-light.jpg'
import dayProtein from '@/assets/meals/day-protein.jpg'
import weekBalance from '@/assets/meals/week-balance.jpg'
import weekLight from '@/assets/meals/week-light.jpg'
import weekProtein from '@/assets/meals/week-protein.jpg'
import hero from '@/assets/meals/hero.jpg'

/** Локальные фото наборов — только для UI, без загрузки в Storage */
export const MEAL_IMAGES: Record<string, string> = {
  'day-balance': dayBalance,
  'day-light': dayLight,
  'day-protein': dayProtein,
  'week-balance': weekBalance,
  'week-light': weekLight,
  'week-protein': weekProtein,
}

export const HERO_IMAGE = hero

export function mealImageUrl(id: string): string | undefined {
  return MEAL_IMAGES[id]
}
