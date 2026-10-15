# Backend documentation — ДЗ5 (NutriDay + Supabase)

## 1. Архитектура

| Слой | Решение |
|------|---------|
| BaaS | **Supabase** (PostgreSQL + Auth + PostgREST + RLS) |
| Frontend | Vite + React + TypeScript (`frontend/`) |
| Клиент | `@supabase/supabase-js` |
| Секреты | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` в `frontend/.env` (не в git) |

Вариант A из задания: Backend as a Service. Self-hosted VPS не использовался.

```text
Browser → Vite SPA → Supabase REST/Auth
                      ├─ meal_sets (public SELECT)
                      ├─ orders (RLS: own rows)
                      └─ order_items (RLS: via order owner)
```

## 2. Схема БД

Миграция: [`supabase/migrations/001_nutriday_init.sql`](../supabase/migrations/001_nutriday_init.sql)

### Таблицы

**meal_sets** — каталог наборов  
`id`, `name`, `diet_type`, `duration`, `price_rub`, `description`, `dishes[]`, `image_gradient`

**orders** — заказы пользователя  
`id (uuid)`, `user_id → auth.users`, `status`, `delivery_date`, `address`, `total_rub`, `created_at`

**order_items** — позиции заказа  
`order_id → orders`, `meal_set_id → meal_sets`, `name`, `quantity`, `unit_price_rub`, `line_total_rub`

### RLS (политики)

- `meal_sets`: SELECT для `anon` и `authenticated`
- `orders`: SELECT/INSERT/UPDATE только если `auth.uid() = user_id`
- `order_items`: SELECT/INSERT только если родительский заказ принадлежит `auth.uid()`

## 3. Применение миграции

1. Откройте [SQL Editor](https://supabase.com/dashboard/project/smrcbkjchmdntfbhelff/sql/new)
2. Вставьте содержимое `supabase/migrations/001_nutriday_init.sql`
3. Run

Либо (если известен DB password):

```bash
# в frontend/.env добавьте SUPABASE_DB_PASSWORD=...
node --env-file=frontend/.env scripts/apply-migration.mjs
```

После миграции в Auth → Providers оставьте Email. Для учебного MVP удобно отключить **Confirm email** (Authentication → Providers → Email), чтобы сразу входить после регистрации.

## 4. API endpoints (Supabase REST)

База: `https://<project-ref>.supabase.co/rest/v1`

| Операция | Метод | Путь | Кто |
|----------|-------|------|-----|
| Список наборов | GET | `/meal_sets?select=*` | anon / auth |
| Создать заказ | POST | `/orders` | authenticated |
| Позиции заказа | POST | `/order_items` | authenticated |
| Мои заказы | GET | `/orders?user_id=eq.<uid>` | authenticated |
| Позиции | GET | `/order_items?order_id=eq.<id>` | authenticated |

Auth:

| Операция | Endpoint |
|----------|----------|
| Регистрация | `POST /auth/v1/signup` |
| Вход | `POST /auth/v1/token?grant_type=password` |
| Сессия | клиент `supabase.auth.getSession()` |

### Пример: чтение каталога

```http
GET /rest/v1/meal_sets?select=*&order=price_rub.asc
apikey: <ANON_KEY>
Authorization: Bearer <ANON_KEY>
```

### Пример: создание заказа (после login)

```http
POST /rest/v1/orders
apikey: <ANON_KEY>
Authorization: Bearer <USER_JWT>
Content-Type: application/json

{
  "user_id": "<uid>",
  "status": "confirmed",
  "delivery_date": "2026-10-20",
  "address": "Москва, Тверская 1",
  "total_rub": 2980
}
```

На фронте это обёрнуто в `src/lib/api.ts` (`fetchMealSets`, `createOrder`, `fetchMyOrders`).

## 5. Безопасность

- Anon key только в Vite env (`VITE_*`) — ожидаемо для SPA
- Service role / DB password **не** попадают во фронт и git
- RLS закрывает чужие заказы
- CORS настраивает Supabase для браузерных origin (localhost + Vercel)
- Валидация адреса и даты (+2 дня) на клиенте; в БД — `delivery_date >= current_date`

## 6. Обработка ошибок (UX)

| Код / ситуация | Поведение UI |
|----------------|--------------|
| 401 не авторизован | Редирект на `/auth`, сообщение |
| 403 RLS | Текст «Нет доступа» |
| Сеть | «Сеть недоступна…» |
| Каталог недоступен | Fallback на локальный mock + баннер |
| Демо-отказ оплаты | Адрес содержит `fail` |

## 7. Процесс с AI

- Схема и RLS сгенерированы/сверены с ТЗ ДЗ3  
- Интеграция клиента через Cursor: AuthContext, CatalogContext, api.ts  
- Отладка: проверка REST 404 до миграции → применение SQL → повторный GET

## 8. Запуск end-to-end

```bash
cd frontend
npm install
# убедитесь что .env содержит правильный URL *.supabase.co
npm run dev
```

Сценарий: регистрация → каталог из БД → корзина → checkout → заказ в Supabase → страница «Мои заказы».
