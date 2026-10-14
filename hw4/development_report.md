# Отчёт о разработке — ДЗ4 (NutriDay Frontend)

## 1. Задача и стек

Реализован frontend MVP **NutriDay** по ТЗ из ДЗ3 и UI Concept 1.

| Параметр | Выбор |
|----------|--------|
| Сборщик | **Vite** |
| UI | React 19 + TypeScript |
| Стили | Tailwind CSS v4 |
| Роутинг | react-router-dom |
| Тесты | Vitest + Testing Library |
| AI-агент | Cursor (правила в `frontend/.cursorrules`, адаптированы с ДЗ2 под Vite) |

Почему Vite, а не Next.js: для ДЗ4 достаточно SPA с локальным запуском; Vite быстрее в учебном цикле. Логика дат/корзины вынесена в `lib/` — готова к подключению Backend в ДЗ5.

## 2. Реализованные функции (MVP)

1. **Каталог** — фильтры рационов, карточки день/неделя, детальный состав, loading-скелетон.  
2. **Корзина** — добавление, +/−, удаление при 0, итог, пустое состояние, `localStorage`.  
3. **Checkout** — дата ≥ сегодня+2, валидация адреса, демо-оплата, экран подтверждения.

Дополнительно: краткий онбординг (можно пропустить), адаптив от ~360px, русские тексты ошибок.

## 3. Работа с AI-агентом

### Примеры промптов

1. «Собери Vite+React+TS+Tailwind SPA NutriDay по ТЗ hw3: каталог, корзина, checkout с min delivery +2 дня, без `any`.»  
2. «Вынеси пересчёт корзины и правило даты в чистые функции `lib/` и покрой Vitest.»  
3. «Стилизуй home/cart в духе Concept 1: cream background, forest green `#2E4635`, русский UI.»

### Итерации

- 1-я: каркас роутов и mock-каталог.  
- 2-я: контекст корзины + persisted storage.  
- 3-я: валидации checkout и confirmation.  
- 4-я: тесты и правки `tsconfig`/Vite alias `@/`.

### Сложности

| Проблема | Решение |
|----------|---------|
| `baseUrl` deprecated в TS 6 | `ignoreDeprecations: "6.0"` в `tsconfig.app.json` |
| Согласование Next.js-правил ДЗ2 с Vite | Отдельный `frontend/.cursorrules` под Vite SPA |
| Демо-оплата без провайдера | Mock с задержкой; отказ при адресе, содержащем `fail` |

## 4. Тестирование и отладка

Запуск: `cd frontend && npm test` — **7 тестов / 3 файла**, все зелёные:

1. `dates.test.ts` — min date = today+2; отклонение более ранней даты.  
2. `cart.test.ts` — add/increment, удаление при 0, total, адрес.  
3. `MealCard.test.tsx` — рендер и клик «В корзину».

Ручная проверка: desktop и узкая ширина (~375px) — каталог, корзина, checkout.

## 5. Адаптив и рефакторинг

- Mobile: колонка hero, крупные tap-targets (≥44px), sticky header.  
- Desktop: сетка карточек + боковая панель состава; summary корзины справа.  
- Рефакторинг: единый `cartTotalRub` для корзины и checkout (как в оптимизации ТЗ).

## 6. Выводы

- Cursor эффективен на связке «ТЗ + UI-концепт → каркас → тесты lib».  
- Чистые функции в `lib/` упрощают тесты и будущее API (ДЗ5).  
- Для сдачи достаточно `npm run dev`; production: `npm run build` / Vercel.

## 7. Как воспроизвести

```bash
cd frontend
npm install
npm test
npm run dev
```
