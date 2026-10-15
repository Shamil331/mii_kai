-- NutriDay MVP schema (ДЗ5)
-- Meal catalog (public read) + orders (owner-only via RLS)

create extension if not exists "pgcrypto";

-- Catalog
create table if not exists public.meal_sets (
  id text primary key,
  name text not null,
  diet_type text not null check (diet_type in ('balanced', 'light', 'protein')),
  duration text not null check (duration in ('day', 'week')),
  price_rub integer not null check (price_rub > 0),
  description text not null default '',
  dishes text[] not null default '{}',
  image_gradient text not null default '',
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'confirmed'
    check (status in ('pending', 'confirmed', 'cancelled', 'failed')),
  delivery_date date not null,
  address text not null check (char_length(trim(address)) >= 8),
  total_rub integer not null check (total_rub >= 0),
  created_at timestamptz not null default now(),
  -- +2 дня валидируется на клиенте; в БД — не раньше сегодня (UTC)
  constraint delivery_not_past check (delivery_date >= current_date)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  meal_set_id text not null references public.meal_sets (id),
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_rub integer not null check (unit_price_rub >= 0),
  line_total_rub integer not null check (line_total_rub >= 0)
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- RLS
alter table public.meal_sets enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- meal_sets: public read
drop policy if exists "meal_sets_select_all" on public.meal_sets;
create policy "meal_sets_select_all"
  on public.meal_sets for select
  to anon, authenticated
  using (true);

-- orders: owner CRUD-ish
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "orders_update_own" on public.orders;
create policy "orders_update_own"
  on public.orders for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- order_items: via parent order ownership
drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own"
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Seed catalog (idempotent)
insert into public.meal_sets (id, name, diet_type, duration, price_rub, description, dishes, image_gradient)
values
  (
    'day-balance',
    'День в балансе',
    'balanced',
    'day',
    1490,
    'Пять готовых блюд на один день — без готовки вечером.',
    array['Овсянка с ягодами','Курица с гречкой','Лосось и овощи','Салат зелёный','Творожный десерт'],
    'from-emerald-800/80 to-stone-400/60'
  ),
  (
    'week-light',
    'Лёгкая неделя',
    'light',
    'week',
    6850,
    'Овощной акцент на 7 дней, фиксированное меню.',
    array['Боул с киноа','Индейка и салат','Рыба на пару','Овощной суп','Фруктовый перекус'],
    'from-lime-700/70 to-amber-200/50'
  ),
  (
    'day-protein',
    'Сила белка',
    'protein',
    'day',
    1690,
    'Сытный день с упором на белок — без кастомизации блюд.',
    array['Омлет с сыром','Говядина и рис','Куриный боул','Творог','Протеиновый смузи'],
    'from-stone-700/80 to-orange-300/40'
  ),
  (
    'week-balance',
    'Неделя баланса',
    'balanced',
    'week',
    7490,
    'Готовый ритм на неделю: завтрак, обед, ужин.',
    array['Разнообразное меню на 7 дней','Фиксированный состав','Прозрачная цена'],
    'from-teal-800/70 to-stone-300/50'
  ),
  (
    'day-light',
    'Лёгкий день',
    'light',
    'day',
    1390,
    'Больше овощей, меньше тяжести — один день.',
    array['Смузи-боул','Куриный салат','Рыба и брокколи','Йогурт'],
    'from-green-600/60 to-yellow-100/50'
  ),
  (
    'week-protein',
    'Белковая неделя',
    'protein',
    'week',
    8290,
    'Недельный набор для тех, кому нужно сытнее.',
    array['Высокобелковые приёмы пищи','Фиксированное меню','Без AI-рекомендаций'],
    'from-neutral-800/80 to-rose-200/40'
  )
on conflict (id) do update set
  name = excluded.name,
  diet_type = excluded.diet_type,
  duration = excluded.duration,
  price_rub = excluded.price_rub,
  description = excluded.description,
  dishes = excluded.dishes,
  image_gradient = excluded.image_gradient;
