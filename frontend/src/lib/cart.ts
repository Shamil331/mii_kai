import type { CartItem, MealSet } from '@/types/meal'

export function addToCart(items: CartItem[], mealSetId: string): CartItem[] {
  const existing = items.find((i) => i.mealSetId === mealSetId)
  if (existing) {
    return items.map((i) =>
      i.mealSetId === mealSetId ? { ...i, quantity: i.quantity + 1 } : i,
    )
  }
  return [...items, { mealSetId, quantity: 1 }]
}

export function setQuantity(
  items: CartItem[],
  mealSetId: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) {
    return items.filter((i) => i.mealSetId !== mealSetId)
  }
  return items.map((i) =>
    i.mealSetId === mealSetId ? { ...i, quantity } : i,
  )
}

export function cartTotalRub(
  items: CartItem[],
  catalog: MealSet[],
): number {
  return items.reduce((sum, item) => {
    const meal = catalog.find((m) => m.id === item.mealSetId)
    if (!meal) return sum
    return sum + meal.priceRub * item.quantity
  }, 0)
}

export function cartItemsCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0)
}

export function isAddressValid(address: string): boolean {
  return address.trim().length >= 8
}
