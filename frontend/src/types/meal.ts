export type DietType = 'balanced' | 'light' | 'protein'

export type MealDuration = 'day' | 'week'

export interface MealSet {
  id: string
  name: string
  dietType: DietType
  duration: MealDuration
  priceRub: number
  description: string
  dishes: string[]
  imageGradient: string
}

export interface CartItem {
  mealSetId: string
  quantity: number
}

export interface OrderDraft {
  deliveryDate: string
  address: string
}

export interface ConfirmedOrder {
  id: string
  deliveryDate: string
  address: string
  totalRub: number
  items: Array<{ name: string; quantity: number; lineTotalRub: number }>
}
