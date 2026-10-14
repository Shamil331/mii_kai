# NutriDay — домашние задания МИИ (ДЗ1–ДЗ3)

Учебный репозиторий курса: сравнительный анализ AI-агентов, система правил/промптов и продуктовое ТЗ для MVP **NutriDay** (заказ готовых наборов здорового питания).

**Стек (контекст):** Next.js App Router + TypeScript + Tailwind CSS · AI-агент: Cursor  
**Репозиторий:** https://github.com/Shamil331/mii_kai

## Структура

| Папка | ДЗ | Содержание |
|-------|-----|------------|
| [hw1/](hw1/) | ДЗ1 | Сравнительная таблица Cloud vs IDE агентов, отчёт, место под скриншоты |
| [hw2/](hw2/) | ДЗ2 | Правила Cursor, RTCF-шаблоны, Chain-of-Thought, тест до/после правил |
| [hw3/](hw3/) | ДЗ3 | Описание продукта, User Stories, ТЗ, промпты v0 и описания UI-концепций |

Краткий бриф продукта: [SHARED_BRIEF.md](SHARED_BRIEF.md).

## ДЗ1 — быстрые ссылки

- [hw1/comparison_table.md](hw1/comparison_table.md)
- [hw1/report.md](hw1/report.md)
- [hw1/screenshots/](hw1/screenshots/) — сюда можно положить скрины Cursor

## ДЗ2 — быстрые ссылки

- [hw2/hw_ai_rules.md](hw2/hw_ai_rules.md)
- [hw2/rules.md](hw2/rules.md) · [hw2/.cursorrules](hw2/.cursorrules)
- [hw2/prompt_templates.md](hw2/prompt_templates.md)
- [hw2/prompt_methodology.md](hw2/prompt_methodology.md)
- [hw2/testing.md](hw2/testing.md)

## ДЗ3 — быстрые ссылки

- [hw3/project_description.md](hw3/project_description.md)
- [hw3/user_stories.md](hw3/user_stories.md)
- [hw3/technical_specification.md](hw3/technical_specification.md)
- [hw3/ui_concepts/v0_prompts.md](hw3/ui_concepts/v0_prompts.md) — **вставить в v0.dev**
- [hw3/ui_concepts/ui_description.md](hw3/ui_concepts/ui_description.md)

### Вариант A (UI): что сделать вручную

1. Открыть [v0.dev](https://v0.dev).
2. По очереди вставить три промпта из `hw3/ui_concepts/v0_prompts.md`.
3. Сохранить скриншоты в `hw3/ui_concepts/`. **Одному концепту можно несколько файлов** (если экран не влезает в один кадр или есть mobile/desktop):

   ```
   concept-1-01.png   concept-1-02.png   ...
   concept-2-01.png   concept-2-02.png   ...
   concept-3-01.png   concept-3-02.png   ...
   ```

   Достаточно **минимум 1 скрин на концепт**. Формат PNG или JPG. Подписи в имени опционально: `concept-1-01-home.png`, `concept-1-02-mobile.png`.
4. Написать оркестратору — вшьём все кадры в `ui_description.md`, допишем обоснование выбора и сделаем push.

## Вне скоупа этого коммита

ДЗ4–ДЗ6 (frontend-приложение, backend, CI/CD) — следующие этапы.
