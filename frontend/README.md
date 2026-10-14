# NutriDay — Frontend (ДЗ4)

Vite + React + TypeScript + Tailwind. Учебный MVP: каталог наборов, корзина, оформление с датой доставки ≥+2 дня.

## Запуск

```bash
cd frontend
npm install
npm run dev
```

Откройте http://localhost:5173

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | локальный сервер |
| `npm run build` | production-сборка в `dist/` |
| `npm run preview` | превью сборки |
| `npm test` | Vitest (≥3 теста) |

## Основные экраны

- `/` — каталог + онбординг + детальный состав набора  
- `/cart` — корзина / пустое состояние  
- `/checkout` — дата доставки, адрес, демо-оплата  
- `/confirmation` — подтверждение заказа  

Mock-данные в `src/lib/catalog.ts`. Корзина в `localStorage`.

## Дизайн

Concept 1 (minimalist): крем + forest green, русский UI — см. `../hw3/ui_concepts/`.

## Отчёт по разработке

См. [../hw4/development_report.md](../hw4/development_report.md).
