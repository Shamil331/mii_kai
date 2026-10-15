import { mapSupabaseError, supabase } from '@/lib/supabase'
import type { CartItem, ConfirmedOrder, MealSet } from '@/types/meal'

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number }

function rowToMeal(row: {
  id: string
  name: string
  diet_type: MealSet['dietType']
  duration: MealSet['duration']
  price_rub: number
  description: string
  dishes: string[]
  image_gradient: string
}): MealSet {
  return {
    id: row.id,
    name: row.name,
    dietType: row.diet_type,
    duration: row.duration,
    priceRub: row.price_rub,
    description: row.description,
    dishes: row.dishes ?? [],
    imageGradient: row.image_gradient,
  }
}

/** READ — каталог наборов (anon/authenticated) */
export async function fetchMealSets(): Promise<ApiResult<MealSet[]>> {
  const { data, error } = await supabase
    .from('meal_sets')
    .select('*')
    .order('price_rub', { ascending: true })

  if (error) {
    const status = error.code === 'PGRST205' ? 500 : 500
    return { ok: false, error: mapSupabaseError(error), status }
  }
  return { ok: true, data: (data ?? []).map(rowToMeal) }
}

/** CREATE — заказ + позиции (authenticated) */
export async function createOrder(input: {
  deliveryDate: string
  address: string
  items: CartItem[]
  catalog: MealSet[]
}): Promise<ApiResult<ConfirmedOrder>> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      ok: false,
      error: 'Требуется вход (401). Зарегистрируйтесь или войдите перед оплатой.',
      status: 401,
    }
  }

  const lines = input.items
    .map((item) => {
      const meal = input.catalog.find((m) => m.id === item.mealSetId)
      if (!meal) return null
      return {
        meal_set_id: meal.id,
        name: meal.name,
        quantity: item.quantity,
        unit_price_rub: meal.priceRub,
        line_total_rub: meal.priceRub * item.quantity,
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  if (lines.length === 0) {
    return { ok: false, error: 'Корзина пуста или наборы не найдены', status: 400 }
  }

  const totalRub = lines.reduce((s, l) => s + l.line_total_rub, 0)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'confirmed',
      delivery_date: input.deliveryDate,
      address: input.address.trim(),
      total_rub: totalRub,
    })
    .select('*')
    .single()

  if (orderError || !order) {
    const msg = mapSupabaseError(orderError)
    const status =
      msg.includes('401') || msg.includes('вход')
        ? 401
        : msg.includes('403') || msg.includes('доступа')
          ? 403
          : 500
    return { ok: false, error: msg, status }
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    lines.map((l) => ({
      order_id: order.id,
      meal_set_id: l.meal_set_id,
      name: l.name,
      quantity: l.quantity,
      unit_price_rub: l.unit_price_rub,
      line_total_rub: l.line_total_rub,
    })),
  )

  if (itemsError) {
    return { ok: false, error: mapSupabaseError(itemsError), status: 500 }
  }

  return {
    ok: true,
    data: {
      id: order.id,
      deliveryDate: order.delivery_date,
      address: order.address,
      totalRub: order.total_rub,
      items: lines.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        lineTotalRub: l.line_total_rub,
      })),
    },
  }
}

/** READ — заказы текущего пользователя */
export async function fetchMyOrders(): Promise<ApiResult<ConfirmedOrder[]>> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Требуется вход (401)', status: 401 }
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, delivery_date, address, total_rub, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { ok: false, error: mapSupabaseError(error), status: 500 }
  }

  const mapped: ConfirmedOrder[] = []
  for (const o of orders ?? []) {
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('name, quantity, line_total_rub')
      .eq('order_id', o.id)

    if (itemsError) {
      return { ok: false, error: mapSupabaseError(itemsError), status: 500 }
    }

    mapped.push({
      id: o.id,
      deliveryDate: o.delivery_date,
      address: o.address,
      totalRub: o.total_rub,
      items: (items ?? []).map((i) => ({
        name: i.name,
        quantity: i.quantity,
        lineTotalRub: i.line_total_rub,
      })),
    })
  }

  return { ok: true, data: mapped }
}
