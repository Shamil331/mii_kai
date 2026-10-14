# Методология промптинга: сложная задача NutriDay (Chain-of-Thought)

## Сложная задача

Реализовать связку **корзина → выбор даты доставки (≥ today+2) → оформление заказа** в NutriDay на Next.js App Router + TypeScript + Tailwind.

Цель: пользователь добавляет набор в корзину, меняет количество, видит итог; на checkout выбирает валидную дату доставки и адрес; заказ создаётся только при валидных данных.

Ниже — **Chain-of-Thought ≥3 шага**: каждый шаг — отдельный промпт к Cursor, с зафиксированным процессом и (симулированным) результатом.

---

## Шаг 1 — Доменная модель и правила даты

### Промпт

```text
Role: Senior TS-разработчик NutriDay.
Task: Создай типы CartItem, Cart, OrderDraft и функции getMinDeliveryDate(today), isValidDeliveryDate(date, today), calcCartTotal(items) в lib/.
Context: Next.js App Router, TypeScript strict, без any. Дата доставки ≥ today + 2 календарных дня. Цена — целые рубли.
Format: файлы types/order.ts и lib/cart.ts, lib/delivery.ts + краткие JSDoc. Список экспортов в конце.
```

### Процесс

1. Зафиксировали инварианты даты и суммы до UI.
2. Cursor создал чистые функции — их можно покрыть тестами отдельно от React.

### Симулированный результат AI

```ts
// types/order.ts
export interface CartItem {
  planId: string;
  title: string;
  pricePerDay: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface OrderDraft {
  items: CartItem[];
  deliveryDate: string; // YYYY-MM-DD
  address: string;
}

// lib/delivery.ts
export function getMinDeliveryDate(today: Date): Date {
  const d = new Date(today);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 2);
  return d;
}

export function isValidDeliveryDate(date: Date, today: Date): boolean {
  const min = getMinDeliveryDate(today);
  const x = new Date(date);
  x.setHours(0, 0, 0, 0);
  return x.getTime() >= min.getTime();
}

// lib/cart.ts
export function calcCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.pricePerDay * i.quantity, 0);
}
```

**Файлы:** `types/order.ts`, `lib/delivery.ts`, `lib/cart.ts`.

---

## Шаг 2 — UI корзины и привязка к расчёту

### Промпт

```text
Role: Senior React/Next.js разработчик NutriDay.
Task: Сделай клиентский CartProvider + компоненты CartSummary и QtyStepper. Изменение qty обновляет итог через calcCartTotal.
Context: Используй типы и calcCartTotal из шага 1. Tailwind only. 'use client' только в provider/интерактиве. Без any.
Format: код с путями → как подключить в layout → ручная проверка (добавить 2 позиции, изменить qty).
```

### Процесс

1. Состояние корзины — один источник правды.
2. UI не дублирует формулу суммы.

### Симулированный результат AI

- `components/cart/CartProvider.tsx` — context: `items`, `addItem`, `setQuantity`, `total`.
- `components/cart/CartSummary.tsx` — список позиций + итог.
- `components/cart/QtyStepper.tsx` — кнопки ± с минимумом 1.
- Подключение: обернуть `app/(shop)/layout.tsx` в `CartProvider`.

**Проверка:** два набора → qty 2 и 1 → итог = сумма `pricePerDay * qty`.

---

## Шаг 3 — Checkout: дата, адрес, серверная валидация

### Промпт

```text
Role: Senior Next.js разработчик NutriDay.
Task: Страница app/checkout/page.tsx + Server Action createOrder. Поля: deliveryDate, address. Клиент и сервер отклоняют дату < minDeliveryDate. Пустой адрес — ошибка.
Context: lib/delivery.ts, корзина из CartProvider. Оплата — статус pending (заглушка). Без deprecated libs, без any.
Format: page + actions/createOrder.ts + типы ошибок → сценарии OK / дата+1день / пустой адрес.
```

### Процесс

1. Клиентский UX (min на input) + серверный отказ — двойная защита.
2. Заказ не создаётся при невалидных данных.

### Симулированный результат AI

```ts
// app/checkout/actions.ts (фрагмент)
"use server";

export async function createOrder(input: {
  items: CartItem[];
  deliveryDate: string;
  address: string;
}) {
  const today = new Date();
  const delivery = new Date(input.deliveryDate);
  if (!isValidDeliveryDate(delivery, today)) {
    return { ok: false as const, error: "INVALID_DELIVERY_DATE" };
  }
  if (!input.address.trim()) {
    return { ok: false as const, error: "EMPTY_ADDRESS" };
  }
  if (input.items.length === 0) {
    return { ok: false as const, error: "EMPTY_CART" };
  }
  // persist stub...
  return { ok: true as const, orderId: "ord_demo_1", status: "pending" };
}
```

UI: `<input type="date" min={minIso} />`, сообщение об ошибке с сервера, кнопка «Оформить».

**Сценарии:**  
- OK: дата = today+2, адрес заполнен → `orderId`.  
- Дата tomorrow → `INVALID_DELIVERY_DATE`.  
- Пустой адрес → `EMPTY_ADDRESS`.

---

## Итог методологии

| Шаг | Фокус | Артефакт |
|-----|--------|----------|
| 1 | Домен + дата + сумма | `lib/*`, `types/*` |
| 2 | Корзина UI | Provider + Summary + Stepper |
| 3 | Checkout + Server Action | page + валидация |

**Chain-of-Thought:** 3 последовательных промпта; каждый опирается на результат предыдущего; сложная фича собрана без «одного гигантского промпта».
