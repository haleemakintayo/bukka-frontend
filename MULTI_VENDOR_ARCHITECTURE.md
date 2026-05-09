# Bukka AI Multi-Vendor Architecture

This document explains how the current multi-vendor backend is wired, what the production deployment is doing today, and where the known implementation gaps are.

Last reconciled with code and production: `2026-05-04`

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
- `/api/v1/vendors/{slug}`
- `/api/v1/vendors/{slug}/menu`
- `/api/v1/vendors/{slug}/qr`
- `/api/v1/orders`
- `/api/v1/orders/verify`
- `/api/v1/orders/{order_id}`
- `/api/v1/telegram/webhook`
- `/api/v1/webhook`
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
- `bank_details`
- `pairing_code`
- `is_active`
- `rating`
- `hours`
- `location`
- `image_url`
- `description`

Important note:

- the admin vendor detail response model expects `created_at`, but the ORM model does not currently define it

### `menu_items`

Current ORM fields:

- `id`
- `vendor_id`
- `name`
- `category`
- `price`
- `is_available`
- `stock_qty`
- `reorder_level`

Important note:

- the public menu response model expects `description`, but the ORM model does not currently define it

### `accounts`

Used for vendor-owner login and admin access.

### `orders`

Used for checkout, but the payment flow is still prototype-grade and should not yet be treated as a hardened commerce implementation.

## Vendor Lifecycle

### 1. Vendor onboarding

The admin onboarding route:

- creates the vendor record
- creates the owner account
- seeds menu items
- generates a `pairing_code`
- generates a QR entry URL and QR image

The route currently depends on environment-driven entry URL generation:

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

## Storefront Flow

### Public vendor details

Route: `GET /api/v1/vendors/{slug}`

Current state:

- implemented
- works live
- repository contract no longer exposes `pairing_code`
- production still leaked `pairing_code` on `2026-05-04` before redeploy

### Public vendor menu

Route: `GET /api/v1/vendors/{slug}/menu`

Current state:

- fixed in repository code with a matching `menu_items.description` field and migration
- production was broken live with `500` on `2026-05-04` before migration and redeploy

Frontend integration note:

- any frontend fallback to mock vendor/menu data can mask this backend failure and should not be used in production mode

### Public vendor QR

Route: `GET /api/v1/vendors/{slug}/qr`

Current state:

- implemented in code
- broken live because production is in Telegram mode without `TELEGRAM_BOT_USERNAME`

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

The order routes exist, but there are still important prototype constraints:

- `POST /api/v1/orders` uses a placeholder `user_id = 1`
- `delivery_address` and `notes` are returned but not persisted on the order model
- frontend-supplied `unit_price` is trusted
- `POST /api/v1/orders/verify` marks the first pending order as paid instead of resolving by stored transaction reference

This means the order flow is available for development integration, but it is not yet a production-safe payment implementation.

## Production Verification Snapshot

Verified on `2026-05-04` against `https://bukka-ai-backend-523632194f78.herokuapp.com`

| Route | Live result | Notes |
|------|-------------|-------|
| `POST /api/v1/admin/login` | Working | Requires form-urlencoded body |
| `GET /api/v1/admin/vendors` | Working | Returns current vendor directory |
| `GET /api/v1/admin/vendors/{id}` | `500` | Broken by `created_at` mismatch |
| `GET /api/v1/vendors/{slug}` | Working | Publicly leaks `pairing_code` |
| `GET /api/v1/vendors/{slug}/menu` | `500` | Broken by `description` mismatch |
| `GET /api/v1/vendors/{slug}/qr` | `500` | Broken by missing `TELEGRAM_BOT_USERNAME` |

## Required Environment Variables

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

## Gaps to Fix in Code

### Critical

- deploy the public `pairing_code` removal
- rotate any exposed live admin credentials and bot secrets

### High

- run the migration and deploy the `menu_items.description` fix
- run the migration and deploy the `vendors.created_at` fix
- fix production QR env config for the selected owner platform

### Medium

- harden order creation and payment verification
- stop trusting frontend-supplied `unit_price`
- persist delivery metadata if it is part of the intended order contract

## Documentation Maintenance Rule

When onboarding, pairing, public vendor, admin vendor, or order behavior changes, update both:

- `api.md`
- `MULTI_VENDOR_ARCHITECTURE.md`

in the same change set as the code.
