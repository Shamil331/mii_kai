# Промпты для v0.dev — NutriDay (ДЗ3)

> **Язык промптов:** английский (лучше воспринимается v0.dev).  
> Каждый промпт ниже — готовый текст для вставки «как есть».  
> Продукт: **NutriDay** — responsive web app для заказа готовых наборов здорового питания (день/неделя), корзина, оплата, доставка. Без глубокой кастомизации и AI.

---

## Concept 1 — Minimalist clean food app  
**Layout focus:** Home + Menu catalog  
**Title for orchestrator:** `Concept 1: Minimalist Clean Food — Home + Menu`

```
Design a full-screen responsive web UI for NutriDay, a healthy meal-kit ordering app (day or week sets, cart, checkout, delivery). Mobile-first, then desktop.

Concept: minimalist clean food app — lots of white space, soft sage green and warm stone neutrals, thin sans-serif typography, photography of real plated meals with gentle shadows. No purple gradients, no neon, no glassmorphism clutter.

Layout (HOME + MENU):
- Top bar: NutriDay wordmark left, cart icon with badge right.
- Hero band (full width, not a card): one short headline about ready healthy sets, one supporting line, primary CTA “Browse meal sets”.
- Below: horizontal filter chips for diet types (Balanced, Light, Protein) — simple text chips, not pill overload.
- Main grid: meal-set cards with photo, name, “1 day” or “7 days” label, price, and “Add to cart” button.
- Sticky bottom summary on mobile when cart has items: item count + total + “Go to cart”.

Include a visible selected meal-set detail panel or second section showing dish list for one set (breakfast/lunch/dinner), calorie note if present, and delivery note: “Delivery from day +2”.

States to show in the mock: default catalog with 4–6 sets; one set visually selected. Empty decorative icons only if needed. Russian UI labels are OK (Наборы, Корзина, Добавить) mixed with English brand name NutriDay.

Output one polished full-page screen suitable for a product concept screenshot. High contrast text, accessible tap targets, calm lifestyle mood.
```

---

## Concept 2 — Bright energetic lifestyle  
**Layout focus:** Cart-focused shopping flow  
**Title for orchestrator:** `Concept 2: Bright Energetic Lifestyle — Cart-Focused`

```
Design a full-screen responsive web UI for NutriDay, a healthy meal-kit ordering web app (ready day/week meal sets, payment, delivery). Mobile-first.

Concept: bright energetic lifestyle — sunny citrus yellow and coral accents on fresh white/cream, bold rounded display headlines, high-energy lifestyle food photography, playful but readable. Avoid purple themes and dark mode. Feel like a fitness-brunch brand, not a corporate hospital.

Layout (CART-FOCUSED):
- Compact top: NutriDay logo + “Continue shopping” link.
- Page title: “Your cart” with subtitle “Healthy sets ready to order”.
- Cart list as the hero of the screen: each line has meal-set photo thumbnail, name, duration (Day / Week), unit price, quantity stepper (− / +), line total, remove control.
- Strong running total block: subtotal, delivery fee line (or “Delivery calculated at checkout”), grand total in large type.
- Primary full-width CTA: “Checkout — choose delivery date”.
- Secondary: “Add another set” linking back to menu (show as text button).
- Side or bottom tip (not a floating badge overlay on photos): “Earliest delivery: 2 days from today”.

Show 2 cart items with different quantities so the steppers and totals feel real. Desktop: split view with cart list left and sticky summary right. Mobile: stacked list then sticky CTA.

UI copy can be English or Russian; brand name NutriDay. Full screen, production-quality mock for a concept comparison slide.
```

---

## Concept 3 — Corporate trustworthy wellness brand  
**Layout focus:** Onboarding + Menu entry  
**Title for orchestrator:** `Concept 3: Corporate Trustworthy Wellness — Onboarding + Menu`

```
Design a full-screen responsive web UI for NutriDay, a trustworthy healthy meal-kit ordering product (day/week ready sets, cart, pay, delivery). Responsive web, not a native-only frame.

Concept: corporate trustworthy wellness brand — deep forest green, soft blue-gray secondary, clean white panels, restrained serif for headlines and geometric sans for UI, subtle paper texture or soft gradient background (not flat gray). Professional, calm, clinic-meets-kitchen — no neon glow, no emoji, no purple AI aesthetic.

Layout (ONBOARDING + MENU ENTRY):
- Left or top onboarding panel (desktop: left 40%; mobile: top section):
  - NutriDay brand as the strongest visual signal.
  - Headline: value prop about ready healthy meal sets without complex customization.
  - Three short steps: 1) Choose diet type 2) Pick a day or week set 3) Pay — delivery in 2+ days.
  - Primary CTA: “Start with meal sets”.
  - Trust row: “Transparent prices”, “Fixed menus”, “No AI upsell” as simple text, not badge stickers on photos.
- Right or below: menu entry preview — three diet-type tiles (Balanced / Light / Protein) leading into sample meal-set thumbnails and prices.
- Footer microcopy: delivery window rule and support email placeholder.

Show one coherent full viewport composition: onboarding + first menu touch in a single screen. High clarity, institutional trust, still appetizing food imagery. Labels may be Russian with NutriDay brand in Latin.

Deliver one complete UI screen ready to screenshot for stakeholder review.
```
