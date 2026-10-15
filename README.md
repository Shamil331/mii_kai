# NutriDay — домашние задания МИИ (ДЗ1–ДЗ5)

Учебный репозиторий: AI-инструменты, ТЗ и fullstack-MVP **NutriDay**.

**Стек:** Vite + React + TypeScript + Tailwind · **Supabase** (Postgres + Auth + RLS) · Cursor  
**Репозиторий:** https://github.com/Shamil331/mii_kai  
**Деплой фронта:** https://frontend-psi-brown-83.vercel.app

## Структура

| Папка | ДЗ | Содержание |
|-------|-----|------------|
| [hw1/](hw1/) | ДЗ1 | Сравнение AI-агентов |
| [hw2/](hw2/) | ДЗ2 | Правила Cursor, RTCF, CoT |
| [hw3/](hw3/) | ДЗ3 | Продукт, stories, ТЗ, UI v0 |
| [frontend/](frontend/) | ДЗ4–5 | SPA + интеграция Supabase |
| [hw4/](hw4/) | ДЗ4 | `development_report.md` |
| [hw5/](hw5/) | ДЗ5 | `backend_documentation.md` |
| [supabase/migrations/](supabase/migrations/) | ДЗ5 | SQL-схема, RLS, seed |

## Быстрый старт

```bash
cd frontend
cp .env.example .env   # заполните URL + anon key
npm install
npm test
npm run dev
```

**Важно:** `VITE_SUPABASE_URL` = `https://<ref>.supabase.co`, не URL дашборда.

### Миграция БД (один раз)

1. [SQL Editor проекта](https://supabase.com/dashboard/project/smrcbkjchmdntfbhelff/sql/new)  
2. Вставить [`supabase/migrations/001_nutriday_init.sql`](supabase/migrations/001_nutriday_init.sql) → Run  

Документация API: [hw5/backend_documentation.md](hw5/backend_documentation.md).

## Сценарий проверки ДЗ5

1. Регистрация / вход (`/auth`)  
2. Каталог грузится из `meal_sets`  
3. Корзина → checkout → заказ в `orders` / `order_items`  
4. `/orders` показывает заказы текущего пользователя  
