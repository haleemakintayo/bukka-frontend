# Bukka AI Multi-Vendor Architecture

This document explains how the current multi-vendor backend is wired, what the production deployment is doing today, and where the known implementation gaps are.

Last reconciled with code and production: `2026-07-07`

> **See also:** `VENDOR_JOURNEY.md` for the vendor-facing end-to-end experience guide.

## Routing Overview

The FastAPI router stack is defined in `app/api/api.py`.

- `/api/v1/admin/login`
- `/api/v1/admin/refresh`
- `/api/v1/admin/register`
- `/api/v1/admin/vendors/onboard`
- `/api/v1/admin/vendors`
- `/api/v1/admin/vendors/{id}`
- `/api/v1/admin/vendors/{id}` with `PATCH`
- `/api/v1/admin/vendors/{id}` with `DELETE`
- `/api/v1/admin/catalog` — **new** Master Catalog CRUD (GET, POST, PATCH, DELETE)
- `/api/v1/vendors/{slug}`
- `/api/v1/vendors/{slug}/menu`
- `/api/v1/vendors/{slug}/qr`
- `/api/v1/vendors/me/menu-v2` — **new** VendorMenuItem CRUD (GET, POST, PATCH, DELETE)
- `/api/v1/orders`
- `/api/v1/orders/verify`
- `/api/v1/orders/{order_id}`
- `/api/v1/telegram/webhook`
- `/api/v1/webhook`
- `/api/v1/webhooks/paystack` *(Paystack payment events)*
- `/api/v1/demo/chats`
- `/api/v1/demo/reset`

## Core Entities

### `vendors`

Current ORM fields:

- `id`
- `vendor_id`
- `slug`
- `business_name`
- `owner_name`
- `whatsapp_number`
- `telegram_chat_id`
- `bank_details` (legacy free-text)
- `bank_code` — CBN 3-digit bank code, e.g. `"058"` for GTBank
- `account_number` — 10-digit NUBAN
- `account_name` — resolved account holder name
- `subaccount_code` — Paystack subaccount ID, e.g. `ACCT_xxxxxxxxxx`
- `pairing_code`
- `is_active`
- `rating`
- `hours`
- `location`
- `image_url`
- `description`

### `master_catalog` — *new, 2026-07-04*

Platform-wide canonical food items seeded and managed by admin. Vendors select from here (or create custom items) when building their menus.

ORM fields:

- `id`
- `name` — unique. E.g. `"Jollof Rice"`, `"Takeaway Pack"`
- `category` — E.g. `"Rice"`, `"Protein"`, `"Extras"` (nullable)
- `unit_type` — `"per_portion"` | `"per_piece"` | `"flat_fee"`
- `is_active` — soft-delete flag

Migration: `f8987c025e19`

### `vendor_menu_items` — *new, 2026-07-04*

A vendor's own pricing and availability layer on top of the master catalog. This is the primary table queried by the LLM menu injection and cart engine.

ORM fields:

- `id`
- `vendor_id` (FK → `vendors.id`)
- `catalog_item_id` (FK → `master_catalog.id`) — nullable; `null` means a fully custom item
- `name` — display name (vendor can override catalog name)
- `category` (nullable)
- `unit_type` — `"per_portion"` | `"per_piece"` | `"flat_fee"`
- `price` — vendor-set price in whole Naira
- `description` (nullable)
- `is_available` — controls whether item is shown in the live menu
- `is_compulsory` — if `true`, automatically injected into the cart at checkout (e.g. Takeaway Pack)
- `stock_qty` — `null` = untracked
- `reorder_level` — low-stock alert threshold

Constraint: `UNIQUE(vendor_id, name)`

Migration: `f8987c025e19`

### `menu_items` — legacy

The original menu table. Still used for:

- Legacy order history (`order_items` rows reference `menu_items.id`)
- Backward-compatible read-only fallback when `vendor_menu_items` is empty for a vendor

Vendor Telegram commands (`/add`, `/out`, `/in`, `/stock`) now write to `vendor_menu_items` first. `menu_items` is no longer the primary write target.

ORM fields:

- `id`
- `vendor_id`
- `name`
- `category`
- `price`
- `is_available`
- `stock_qty`
- `reorder_level`

### `accounts`

Used for vendor-owner login and admin access.

### `orders`

Payment fields added in migration `a1b2c3d4e5f6`:

- `payment_reference`
- `payment_status` — `PENDING` | `PAID` | `FAILED`

Delivery fields added in a prior migration:

- `order_type` — `"pickup"` | `"delivery"`
- `delivery_address`
- `delivery_note`
- `customer_phone`

### `services/menu_service.py` — *new, 2026-07-04*

Centralised module for all `VendorMenuItem` and `MasterCatalog` query/format logic. Key functions:

| Function | Purpose |
|---|---|
| `get_vendor_menu_items_v2(db, vendor_id)` | Returns live orderable items for a vendor |
| `get_compulsory_items(db, vendor_id)` | Returns all compulsory items (auto-injected at checkout) |
| `build_menu_text(items)` | Formats item list into LLM-injectable string |
| `get_live_menu_text_v2(db, vendor_id)` | Query + format in one call |
| `resolve_vendor_item(db, vendor_id, raw_name)` | Fuzzy-matches a free-text name to a `VendorMenuItem` row |
| `build_enriched_cart_string(db, vendor_id, cart_dict)` | Builds enriched cart string with line prices and total |

### `services/paystack_service.py`

Centralised Paystack API client. Two public functions:

**`create_subaccount(business_name, bank_code, account_number) -> str`**
- Calls `POST https://api.paystack.co/subaccount`
- Returns `subaccount_code` to be stored on `Vendor.subaccount_code`

**`initialize_checkout(email, amount_naira, subaccount_code, order_id, vendor_id) -> dict`**
- Calls `POST https://api.paystack.co/transaction/initialize`
- Converts Naira → Kobo internally (× 100)
- Applies a flat ₦50 platform fee (5000 kobo)
- Returns `{"authorization_url": ..., "reference": ...}`

## Vendor Lifecycle

### 1. Vendor onboarding

The admin onboarding route:

- creates the vendor record
- creates the owner account
- seeds legacy `menu_items` (for backward compat)
- generates a `pairing_code`
- generates a QR entry URL and QR image

For the **new dynamic menu**, the vendor then adds items via:
- Telegram bot commands: `/add <item> | <price> [| unit_type] [| stock] [| reorder] [| compulsory]`
- REST API: `POST /api/v1/vendors/me/menu-v2`

The route depends on environment-driven entry URL generation:

- Telegram mode requires `TELEGRAM_BOT_USERNAME`
- WhatsApp mode requires `OWNER_PHONE`

If those env values are missing, onboarding fails before commit.

### 2. Vendor device pairing

Pairing is implemented in the bot flow, not in the frontend.

Expected flow:

1. Admin receives `pairing_code` from onboarding.
2. Vendor sends `/link <pairing_code>` to the bot.
3. Backend looks up the vendor by `pairing_code`.
4. Backend stores `telegram_chat_id` or `whatsapp_number`.
5. Backend clears `pairing_code`.

Operational consequence:

- any public exposure of `pairing_code` is a security issue

### 3. Customer storefront entry

Customers enter the vendor flow by slug:

- Telegram deep-link: `/start <vendor-slug>`
- WhatsApp message ref: `[ref:<vendor-slug>]`

That slug then drives:

- public vendor details
- public menu retrieval
- QR generation
- order creation

**UX change (2026-07-04):** On slug entry, the backend immediately sends the full live menu to the customer before they have to ask. The welcome message format is:

```
👋 Welcome to *{business_name}*!

📋 *Today's Menu:*
- Jollof Rice: ₦300 per portion
- Chicken: ₦400 per piece
- Takeaway Pack: ₦200 (COMPULSORY — added automatically at checkout)

Reply with what you’d like to order and I’ll sort you out! 🍽️
```

## Storefront Flow

### Dynamic Menu Injection

Route: `GET /api/v1/vendors/me/menu-v2` and the LLM prompt

Current state:

- `menu_service.get_live_menu_text_v2(db, vendor_id)` queries `vendor_menu_items` and formats a menu string
- The chat manager injects this string into `{menu}` in the LLM system prompt
- The LLM system prompt now includes `{current_cart}` in enriched format:
  `[CURRENT CART: 2x Jollof Rice (₦600) | 1x Chicken (₦400) | TOTAL: ₦1,000]`
- If `vendor_menu_items` is empty for a vendor, falls back to legacy `menu_items`
- Compulsory items display as:
  `- Takeaway Pack: ₦200 (COMPULSORY — added automatically at checkout)`

### Compulsory Item Auto-Injection

At checkout trigger (`intent=checkout`):

1. Backend queries `get_compulsory_items(db, vendor_id)` for all `is_compulsory=True` items
2. Any compulsory item not already in the cart is injected with `qty=1`
3. Cart totals are recalculated
4. The LLM is instructed (Rule 10) to never extract compulsory items itself

### Checkout UX Summary

When `intent=checkout` is detected:

1. Compulsory items injected into cart
2. Customer sees a formatted order summary with line prices and total
3. Customer chooses `1` (Pickup) or `2` (Delivery)
4. If delivery: customer provides address then phone number
5. Payment link sent

### Public vendor details

Route: `GET /api/v1/vendors/{slug}`

Current state:

- implemented
- works live
- repository contract does not expose `pairing_code`

### Public vendor menu

Route: `GET /api/v1/vendors/{slug}/menu`

Current state:

- serves legacy `menu_items` for the public REST menu endpoint
- the WhatsApp/Telegram chat flow uses `vendor_menu_items` (V2) via `menu_service`

### Public vendor QR

Route: `GET /api/v1/vendors/{slug}/qr`

Current state:

- implemented in code
- requires `TELEGRAM_BOT_USERNAME` in env when running in Telegram mode

## Telegram Vendor Commands

Commands are parsed by `chat_manager.py` when a message arrives from a known `telegram_chat_id`.

All write commands target `vendor_menu_items` first. Legacy `menu_items` is a read-only fallback for `/out`, `/in`, `/stock` when no matching V2 item is found.

| Command | Syntax | Notes |
|---|---|---|
| `/pending` | `/pending` | **New 2026-07-07.** Lists today's paid orders with status `Pending` or `Paid` that have not yet been confirmed. Ordered oldest-first. |
| `/reject` | `/reject <order_id>` | **Updated 2026-07-23 (Opt-out fulfillment).** Reverses stock deduction via `reverse_sale_stock_deduction()`, sets `Order.status = "Rejected"`, and notifies customer. |
| `/add` | `/add <name> \| <price> [\| unit_type] [\| stock] [\| reorder] [\| compulsory]` | Creates/updates a `VendorMenuItem`. `unit_type`: `per_portion` (default) / `per_piece` / `flat_fee`. Append `compulsory` to set `is_compulsory=True`. |
| `/out` | `/out <name>` | Sets `is_available=False` on matching `VendorMenuItem` (or legacy `MenuItem`). |
| `/in` | `/in <name>` | Sets `is_available=True`. |
| `/stock` | `/stock` | Inventory snapshot for all `VendorMenuItem` rows. |
| `/stock add` | `/stock add <name> \| <qty>` | Increments `stock_qty`. Marks available if previously 0. |
| `/stock use` | `/stock use <name> \| <qty>` | Decrements `stock_qty`. Marks unavailable at 0. |
| `/stock set` | `/stock set <name> \| <qty>` | Sets `stock_qty` to exact value. |
| `/stock level` | `/stock level <name> \| <qty>` | Sets `reorder_level`. |
| `/stock waste` | `/stock waste <name> \| <qty> \| <reason>` | Logs waste, decrements stock. |
| `/menu` | `/menu` | Shows the live formatted menu (from `VendorMenuItem`, fallback to `menu_items`). |
| `/setpin` | `/setpin <4-digit-pin>` | Sets `vendors.hashed_pin` (bcrypt). Required for dashboard login. |
| `/link` | `/link <code>` | Pairs vendor to Telegram/WhatsApp. Single-use — code is cleared on success. Success message now includes PIN-setup reminder. |
| `/help` | `/help` | Full command list. |

Example — adding a compulsory Takeaway Pack:
```
/add Takeaway Pack | 200 | flat_fee | | | compulsory
```

### Vendor Payment Alert

When a `charge.success` webhook fires, `_notify_vendor()` in `webhooks.py` calls `_build_vendor_order_alert()` which produces a **full itemised receipt** and automatically deducts stock upon payment clearing (opt-out model). Includes:

- Customer name + phone number
- Order type (Pickup 🏪 / Delivery 🚚)
- Delivery address + notes (for delivery orders)
- Each item with quantity and line price
- Food subtotal, delivery fee, and total
- Paystack reference
- A `/reject <id>` prompt (to reject and trigger auto-restock if unable to fulfill)
- Stock deduction warnings (prominently displayed)

A plain-text fallback is sent if the enriched builder throws an exception.

## Admin Vendor Flow

### Vendor directory

Route: `GET /api/v1/admin/vendors`

Current state:

- implemented
- verified working live

### Vendor detail

Route: `GET /api/v1/admin/vendors/{id}`

Current state:

- fixed in repository code with a matching `vendors.created_at` field and migration
- production was broken live with `500` on `2026-05-04` before migration and redeploy

## Orders and Payment Flow

The split-payment engine is wired end-to-end:

1. **Vendor banking setup** — Admin supplies `bank_code` + `account_number` during onboarding or via `PATCH /admin/vendors/{id}`. The backend calls `paystack_service.resolve_account_number()` to verify NUBAN details, registers a Paystack subaccount (`create_subaccount`), and registers a Paystack transfer recipient (`create_transfer_recipient`), storing `subaccount_code` and `paystack_recipient_code` on the vendor record.
2. **Customer checkout** — When the AI detects `intent=checkout` in `chat_manager.py`, compulsory items are injected, a formatted order summary is shown, then `paystack_service.initialize_checkout()` is called and the `authorization_url` sent to the customer.
3. **Payment confirmation** — Paystack calls `POST /api/v1/webhooks/paystack` with `charge.success`. The handler verifies the HMAC-SHA512 signature, looks up the order by `payment_reference`, sets `payment_status → PAID`, deducts stock (`SELECT FOR UPDATE`), and alerts customer & vendor.
4. **Same-Day Disbursal (Transfers API)** — A daily Celery task (`run_daily_vendor_payouts` at 6:00 PM WAT) or manual admin trigger sums unpaid completed orders, calls Paystack Transfers API (`POST /transfer` or `POST /transfer/bulk`), and creates `VendorPayout` rows (`status="pending"`).
5. **Transfer Webhook Resolution** — Paystack calls `POST /api/v1/webhooks/paystack` with `transfer.success` or `transfer.failed`/`transfer.reversed`. The handler updates `VendorPayout.status` to `success` or `failed` idempotently.

> ⚠️ **MANDATORY PAYSTACK SETTING:** **OTP MUST BE DISABLED** on the Paystack Dashboard (**Settings $\rightarrow$ Transfers $\rightarrow$ Disable OTP requirement**) to permit API-driven disbursals.

Known limitations still in place:

- Placeholder `user_id = 1` is used in the REST `POST /orders` endpoint (chat flow uses real user records)
- `POST /api/v1/orders/verify` is still a stub (manual reference verification); the webhook is the production path

## Production Verification Snapshot

Verified on `2026-05-04` against `https://bukka-ai-backend-523632194f78.herokuapp.com`

| Route | Live result | Notes |
|------|-------------|-------|
| `POST /api/v1/admin/login` | Working | Requires form-urlencoded body |
| `GET /api/v1/admin/vendors` | Working | Returns current vendor directory |
| `GET /api/v1/admin/vendors/{id}` | Working | Fixed after `created_at` migration |
| `GET /api/v1/vendors/{slug}` | Working | `pairing_code` not exposed |
| `GET /api/v1/vendors/{slug}/menu` | Working | Fixed after `description` migration |
| `GET /api/v1/admin/catalog` | Pending deploy | New 2026-07-04 |
| `GET /api/v1/vendors/me/menu-v2` | Pending deploy | New 2026-07-04 |

## Required Environment Variables

### Payment (Paystack)

- `PAYSTACK_SECRET_KEY` — live key (`sk_live_...`) or test key (`sk_test_...`) from the Paystack dashboard

### Core

- `DATABASE_URL`
- `JWT_SECRET`
- `REFRESH_JWT_SECRET`

### Admin

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

### Telegram mode

- `OWNER_PLATFORM=telegram`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_BOT_USERNAME`

### WhatsApp mode

- `OWNER_PLATFORM=whatsapp`
- `OWNER_PHONE`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_PHONE_ID`
- `META_API_TOKEN`

## Gaps to Fix

### High

- Deploy migration `f8987c025e19` (`master_catalog` + `vendor_menu_items` tables) to production
- Seed the `master_catalog` table with initial items once the vendor's list is ready
- Wire `StockMovement` logging for `VendorMenuItem` (currently skipped in stock commands; `StockMovement.menu_item_id` FK references legacy `menu_items.id`)
- Implement a real superadmin JWT guard on `admin_catalog.get_current_admin` (currently a stub returning `"admin"`)

### Medium

- Update `GET /api/v1/vendors/{slug}/menu` to serve from `vendor_menu_items` V2 (currently serves legacy `menu_items`)
- Vendor dashboard analytics: count top items from `vendor_menu_items` prices instead of legacy `order_items.unit_price`
- Harden order creation: stop trusting frontend-supplied `unit_price`

## Documentation Maintenance Rule

When onboarding, pairing, public vendor, admin vendor, menu, or order behavior changes, update both:

- `api.md`
- `MULTI_VENDOR_ARCHITECTURE.md`

in the same change set as the code.
