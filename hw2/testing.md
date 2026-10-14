# Тестирование: одна задача БЕЗ правил vs С правилами

## Задача (одинаковая в обоих прогонах)

> Напиши функцию и небольшой React-компонент для NutriDay: расчёт минимальной даты доставки и поле выбора даты на checkout. Стек — Next.js + TypeScript + Tailwind.

---

## A) Ответ БЕЗ правил (сырой / типичный «свободный» стиль)

**Промпт:** `Сделай выбор даты доставки для NutriDay.`

**Ответ модели (симуляция, почти дословно):**

```jsx
// DeliveryDate.jsx — без TS, смешанный стек
import moment from 'moment';
import styled from 'styled-components';

const Wrap = styled.div`margin: 8px;`;

export default function DeliveryDate({ onChange }) {
  const min = moment().add(1, 'days').format('YYYY-MM-DD'); // «завтра хватит»
  return (
    <Wrap>
      <input
        type="date"
        style={{ padding: 10 }}
        onChange={(e) => onChange(e.target.value)}
      />
      <small>min roughly: {min}</small>
    </Wrap>
  );
}

export function checkDate(d) {
  // any-like: нет типов
  return moment(d).isAfter(moment());
}
```

Проблемы: Moment + styled-components; дата +1 день вместо +2; нет TypeScript; inline styles; нет серверной проверки; файл `.jsx`.

---

## B) Ответ С правилами из `rules.md` / `.cursorrules`

**Промпт:** тот же + «следуй правилам проекта NutriDay (Cursor rules)».

**Ответ модели (симуляция):**

Кратко: добавлю чистую функцию min-даты (today+2) и клиентский input с `min`, без `any` и без deprecated-библиотек.

```tsx
// lib/delivery.ts
export function getMinDeliveryDate(today: Date = new Date()): Date {
  const d = new Date(today);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 2);
  return d;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isValidDeliveryDate(date: Date, today: Date = new Date()): boolean {
  const min = getMinDeliveryDate(today);
  const x = new Date(date);
  x.setHours(0, 0, 0, 0);
  return x.getTime() >= min.getTime();
}
```

```tsx
// components/checkout/DeliveryDateField.tsx
"use client";

import { getMinDeliveryDate, toISODate } from "@/lib/delivery";

export interface DeliveryDateFieldProps {
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
}

export function DeliveryDateField({ value, onChange, error }: DeliveryDateFieldProps) {
  const min = toISODate(getMinDeliveryDate());

  return (
    <label className="flex flex-col gap-1 text-sm text-slate-800">
      <span>Дата доставки</span>
      <input
        type="date"
        className="rounded border border-slate-300 px-3 py-2"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <span className="text-red-600">{error}</span> : null}
    </label>
  );
}
```

Файлы: `lib/delivery.ts`, `components/checkout/DeliveryDateField.tsx`.  
Проверка: `min` на input = сегодня+2; тип props явный; только Tailwind.

---

## Вывод

Без правил модель тяготеет к удобным, но **неподходящим** зависимостям (Moment, styled-components), слабой типизации и **неверной** бизнес-логике (дата +1 вместо +2). С правилами Cursor ответ совпал со стеком (TS + Tailwind + App Router-friendly), выполнил инвариант доставки, разделил `lib/` и UI и избежал запрещённых практик (`any`, deprecated libs). Для MVP NutriDay правила заметно повышают **предсказуемость, безопасность домена и пригодность кода к вставке в репозиторий** с первого ответа.
