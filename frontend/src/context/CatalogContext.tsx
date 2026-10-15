import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchMealSets } from '@/lib/api'
import { MEAL_SETS } from '@/lib/catalog'
import type { MealSet } from '@/types/meal'

interface CatalogContextValue {
  meals: MealSet[]
  loading: boolean
  error: string | null
  usingFallback: boolean
  reload: () => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<MealSet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMealSets().then((res) => {
      if (cancelled) return
      if (res.ok && res.data.length > 0) {
        setMeals(res.data)
        setError(null)
        setUsingFallback(false)
      } else {
        setMeals(MEAL_SETS)
        setUsingFallback(true)
        setError(
          res.ok
            ? 'Каталог в БД пуст — показаны локальные данные'
            : `${res.error} (показан локальный каталог)`,
        )
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [tick])

  const value = useMemo(
    () => ({
      meals,
      loading,
      error,
      usingFallback,
      reload: () => setTick((t) => t + 1),
    }),
    [meals, loading, error, usingFallback],
  )

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
