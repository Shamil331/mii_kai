import { describe, expect, it } from 'vitest'
import { addToCart, cartTotalRub, isAddressValid, setQuantity } from './cart'
import type { MealSet } from '@/types/meal'

const catalog: MealSet[] = [
  {
    id: 'a',
    name: 'A',
    dietType: 'balanced',
    duration: 'day',
    priceRub: 1000,
    description: '',
    dishes: [],
    imageGradient: '',
  },
]

describe('cart helpers', () => {
  it('adds new line or increments quantity', () => {
    const once = addToCart([], 'a')
    expect(once).toEqual([{ mealSetId: 'a', quantity: 1 }])
    const twice = addToCart(once, 'a')
    expect(twice).toEqual([{ mealSetId: 'a', quantity: 2 }])
  })

  it('removes line when quantity reaches zero', () => {
    const items = [{ mealSetId: 'a', quantity: 1 }]
    expect(setQuantity(items, 'a', 0)).toEqual([])
  })

  it('computes total from catalog prices', () => {
    const items = [{ mealSetId: 'a', quantity: 3 }]
    expect(cartTotalRub(items, catalog)).toBe(3000)
  })

  it('validates address length', () => {
    expect(isAddressValid('short')).toBe(false)
    expect(isAddressValid('Москва, Тверская 1')).toBe(true)
  })
})
