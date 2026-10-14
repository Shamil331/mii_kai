# Шаблоны промптов RTCF для NutriDay (Cursor)

Формат каждого шаблона: **Role / Task / Context / Format** + пример использования.  
Стек: Next.js App Router + TypeScript + Tailwind. Агент: Cursor.

---

## 1. Генерация компонента / функции

### RTCF

**Role:** Ты senior React/Next.js разработчик NutriDay.  
**Task:** Сгенерируй [компонент|функцию] `[имя]` для [назначение].  
**Context:** App Router + TS strict + Tailwind. Домен: рационы / корзина / checkout. Дата доставки ≥ today+2. Без `any`, без deprecated-библиотек. Логику выноси в `lib/`, UI — в `components/`.  
**Format:** 1) краткое описание; 2) код с путём файла; 3) типы props/сигнатура; 4) пример использования; 5) список файлов.

### Пример использования

```text
Role: Ты senior React/Next.js разработчик NutriDay.
Task: Сгенерируй компонент MealPlanCard для карточки рациона в каталоге.
Context: App Router + TS strict + Tailwind. Поля: id, title, caloriesPerDay, pricePerDay, mealsPerDay. Кнопка «В корзину» вызывает onAdd(planId). Без any.
Format: описание → код components/MealPlanCard.tsx → типы → пример в каталоге → список файлов.
```

---

## 2. Рефакторинг

### RTCF

**Role:** Ты инженер, специализирующийся на рефакторинге React/TS без изменения поведения.  
**Task:** Отрефактори `[файл/фрагмент]`: улучши читаемость, вынеси бизнес-логику, сохрани публичный API.  
**Context:** NutriDay MVP. Правила: без `any`, Tailwind only, Server Components по умолчанию. Не меняй UX и контракты props без явного указания.  
**Format:** 1) что не так сейчас; 2) план рефакторинга; 3) новый код; 4) что не изменилось (поведение).

### Пример использования

```text
Role: Ты инженер по рефакторингу React/TS без смены поведения.
Task: Отрефактори компонент CheckoutForm: вынеси расчёт minDeliveryDate и валидацию адреса в lib/checkout.ts.
Context: NutriDay, дата доставки ≥+2 дня, TypeScript strict, без any.
Format: проблемы → план → код lib/checkout.ts + обновлённый CheckoutForm → список инвариантов поведения.
```

---

## 3. Написание тестов

### RTCF

**Role:** Ты QA-oriented разработчик: пишешь тесты на Vitest/Jest + Testing Library.  
**Task:** Напиши тесты для `[модуль/компонент]` на сценарии: [happy path + edge cases].  
**Context:** NutriDay. Критично: корзина (сумма, qty), min delivery date = today+2, отклонение невалидного заказа. Мокай сеть/время при необходимости.  
**Format:** 1) список кейсов; 2) код тестов с путём; 3) что мокается; 4) команда запуска.

### Пример использования

```text
Role: Ты QA-oriented разработчик на Vitest.
Task: Напиши тесты для lib/delivery.ts: getMinDeliveryDate и isValidDeliveryDate.
Context: NutriDay. Минимум = сегодня + 2 календарных дня. Зафиксируй «сегодня» через мок Date.
Format: кейсы → код delivery.test.ts → моки → команда npx vitest run.
```

---

## 4. Исправление багов

### RTCF

**Role:** Ты debugger по Next.js/TypeScript.  
**Task:** Найди причину бага «[симптом]» и предложи минимальный фикс.  
**Context:** NutriDay [страница/флоу]. Ожидаемое vs фактическое поведение. Стек: App Router, TS, Tailwind. Не рефакторь всё подряд.  
**Format:** 1) гипотезы; 2) корневая причина; 3) патч (diff или файл); 4) как воспроизвести и проверить.

### Пример использования

```text
Role: Ты debugger по Next.js/TypeScript.
Task: Баг: в checkout можно выбрать завтрашнюю дату, хотя минимум +2 дня.
Context: NutriDay, компонент DatePicker + Server Action createOrder. Клиент пускает, сервер иногда тоже.
Format: гипотезы → причина → минимальный фикс клиента и сервера → шаги проверки.
```

---

## 5. Декомпозиция сложной задачи

### RTCF

**Role:** Ты tech lead MVP NutriDay: дробишь фичи на безопасные шаги.  
**Task:** Разложи задачу «[большая фича]» на подзадачи для Cursor (порядок, зависимости, Definition of Done).  
**Context:** MVP only: каталог, корзина, checkout. Стек Next.js App Router + TS + Tailwind. Без логистики и AI.  
**Format:** 1) цель одной фразой; 2) нумерованный план (шаг = один промпт); 3) артефакты каждого шага; 4) риски/вне скоупа.

### Пример использования

```text
Role: Ты tech lead MVP NutriDay.
Task: Разложи «корзина + выбор даты доставки + оформление заказа» на шаги для Cursor.
Context: App Router, TS strict, Tailwind. Дата ≥+2 дня. Оплата — заглушка статуса paid/pending.
Format: цель → шаги 1..N с DoD → файлы → что НЕ делаем (логистика, кастомизация блюд).
```

---

## Итого

**Шаблонов RTCF: 5** (≥5): генерация, рефакторинг, тесты, баги, декомпозиция.
