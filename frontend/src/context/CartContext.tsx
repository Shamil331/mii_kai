import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { addToCart, cartItemsCount, cartTotalRub, setQuantity } from '@/lib/cart'
import { MEAL_SETS } from '@/lib/catalog'
import type { CartItem, ConfirmedOrder } from '@/types/meal'

const STORAGE_KEY = 'nutriday-cart-v1'

interface CartContextValue {
  items: CartItem[]
  count: number
  totalRub: number
  addMeal: (mealSetId: string) => void
  changeQty: (mealSetId: string, quantity: number) => void
  clear: () => void
  lastOrder: ConfirmedOrder | null
  setLastOrder: (order: ConfirmedOrder | null) => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === 'object' &&
        i !== null &&
        'mealSetId' in i &&
        'quantity' in i &&
        typeof (i as CartItem).mealSetId === 'string' &&
        typeof (i as CartItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredItems())
  const [lastOrder, setLastOrder] = useState<ConfirmedOrder | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addMeal = useCallback((mealSetId: string) => {
    setItems((prev) => addToCart(prev, mealSetId))
  }, [])

  const changeQty = useCallback((mealSetId: string, quantity: number) => {
    setItems((prev) => setQuantity(prev, mealSetId, quantity))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: cartItemsCount(items),
      totalRub: cartTotalRub(items, MEAL_SETS),
      addMeal,
      changeQty,
      clear,
      lastOrder,
      setLastOrder,
    }),
    [items, addMeal, changeQty, clear, lastOrder],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
