# Bukka AI API Contract and Deployment Status

This document is the current source of truth for the Bukka AI backend API.

It intentionally separates:

- the route contract implemented in code
- the live production behavior verified against `https://bukka-ai-backend-523632194f78.herokuapp.com`
- the known gaps that still need backend fixes

Last verified against production: `2026-05-12`

## Base URLs

- Local development: `http://localhost:8000`
- Production: `https://bukka-ai-backend-523632194f78.herokuapp.com`

All API routes below are rooted at `/api/v1`.

## Authentication and Secrets

- Admin auth uses Bearer JWTs issued by `POST /api/v1/admin/login`.
- Admin login expects `application/x-www-form-urlencoded`, not JSON.
- Telegram webhook calls must include `X-Telegram-Bot-Api-Secret-Token`.
- WhatsApp webhook calls must include `X-Hub-Signature-256`.
- Demo reset calls must include `X-Admin-Reset-Token`.

## Current Production Summary

Last verified against production: `2026-05-10`.

### ✅ All endpoints working live

**Auth**
- `POST /api/v1/admin/login`
- `POST /api/v1/admin/refresh`

**Admin — Vendor Management**
- `POST /api/v1/admin/vendors/onboard`
- `GET /api/v1/admin/vendors`
- `GET /api/v1/admin/vendors/{id}`
- `PATCH /api/v1/admin/vendors/{id}`
- `DELETE /api/v1/admin/vendors/{id}`
- `PATCH /api/v1/admin/vendors/{id}/activate`
- `POST /api/v1/admin/vendors/{id}/regenerate-pairing`

**Admin — Menu Management**
- `GET /api/v1/admin/vendors/{id}/menu`
- `POST /api/v1/admin/vendors/{id}/menu`
- `PATCH /api/v1/admin/vendors/{id}/menu/{item_id}`
- `DELETE /api/v1/admin/vendors/{id}/menu/{item_id}`

**Public — Vendor Self-Registration**
- `POST /api/v1/vendors/register`

**Public — Storefront**
- `GET /api/v1/vendors/{slug}`
- `GET /api/v1/vendors/{slug}/menu`
- `GET /api/v1/vendors/{slug}/qr`

**Webhooks & Misc**
- `POST /api/v1/telegram/webhook`
- `POST /api/v1/webhook`
- `GET /api/v1/webhook`
- `POST /api/v1/webhooks/paystack` *(new — Paystack payment events)*
- `GET /`

---

## Admin Authentication

### `POST /api/v1/admin/login`

Returns access and refresh tokens for a superadmin or vendor owner account.

Request:

- Content-Type: `application/x-www-form-urlencoded`
- Fields:
  - `username`
  - `password`

Example request body:

```text
username=<admin-email-or-username>&password=<password>
```

Success response:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer"
}
```

Status:

- Implemented in `app/api/endpoints/auth.py`
- Verified working in production on `2026-05-04`

### `POST /api/v1/admin/refresh`

Refreshes an access token.

Request body:

```json
{
  "refresh_token": "<jwt>"
}
```

Success response:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer"
}
```

### `POST /api/v1/admin/register`

Creates a vendor-owner account directly (admin utility).

Request body:

```json
{
  "email": "owner@example.com",
  "password": "VendorPass123!",
  "role": "vendor_owner",
  "vendor_id": 1
}
```

---

## Admin Vendor Management

All routes in this section require `Authorization: Bearer <access_token>` from a superadmin.

### `POST /api/v1/admin/vendors/onboard`

Creates a vendor immediately (`is_active=True`), creates the vendor owner account, seeds menu items, generates a pairing code, and generates a QR code entry link.

Request body:

```json
{
  "business_name": "Mama Sade Kitchen",
  "owner_name": "Sade Afolabi",
  "slug": "mama-sade-kitchen",
  "whatsapp_number": "2348012345678",
  "telegram_chat_id": "7001002003",
  "bank_details": "GTBank 0123456789 - Sade Afolabi",
  "bank_code": "058",
  "account_number": "0123456789",
  "account_name": "Sade Afolabi",
  "email": "sade.vendor@example.com",
  "password": "VendorPass123!",
  "menu_items": [
    {
      "name": "Jollof Rice",
      "price": 1500,
      "category": "Rice"
    }
  ]
}
```

Field notes:

- Required: `business_name`, `owner_name`, `bank_details`, `email`, `password`, `menu_items`
- Optional: `slug` (auto-generated if omitted), `whatsapp_number`, `telegram_chat_id`
- Optional Paystack fields: `bank_code`, `account_number`, `account_name` — supply these to auto-register a Paystack subaccount during onboarding
- `pairing_code` is generated server-side

Success response:

```json
{
  "vendor_id": "VEN-4821",
  "slug": "mama-sade-kitchen",
  "message": "Vendor successfully onboarded.",
  "qr_image_url": "/static/qr_codes/mama-sade-kitchen.png",
  "pairing_code": "8f3a9b21"
}
```

Status:

- Implemented in `app/api/endpoints/vendors.py`
- Requires `TELEGRAM_BOT_USERNAME` in env when `OWNER_PLATFORM=telegram`

### `GET /api/v1/admin/vendors`

Returns the vendor directory with active menu counts.

Query params:

- `skip` default `0`
- `limit` default `100`
- `is_active` optional boolean — filter by status. Use `false` to see pending self-registered vendors.

Success response:

```json
[
  {
    "vendor_id": "VEN-4821",
    "slug": "mama-sade-kitchen",
    "business_name": "Mama Sade Kitchen",
    "owner_name": "Sade Afolabi",
    "is_active": true,
    "active_menu_items_count": 4
  }
]
```

Status:

- Implemented and verified working in production

### `GET /api/v1/admin/vendors/{id}`

Returns vendor detail by external `vendor_id` such as `VEN-4821`. Internal numeric IDs are also accepted.

Success response:

```json
{
  "id": 1,
  "vendor_id": "VEN-4821",
  "slug": "mama-sade-kitchen",
  "business_name": "Mama Sade Kitchen",
  "owner_name": "Sade Afolabi",
  "whatsapp_number": "2348012345678",
  "telegram_chat_id": "7001002003",
  "bank_details": "GTBank 0123456789 - Sade Afolabi",
  "bank_code": "058",
  "account_number": "0123456789",
  "account_name": "Sade Afolabi",
  "subaccount_code": "ACCT_xxxxxxxxxx",
  "pairing_code": "8f3a9b21",
  "is_active": true,
  "active_menu_items_count": 4,
  "created_at": "2026-05-01T10:00:00",
  "rating": 5,
  "hours": "9am-9pm",
  "location": "Yaba",
  "image_url": "https://example.com/vendor.jpg",
  "description": "Homestyle Nigerian meals"
}
```

### `PATCH /api/v1/admin/vendors/{id}`

Updates vendor profile fields (any subset).

Request body (all fields optional):

```json
{
  "business_name": "Mama Sade Kitchen",
  "owner_name": "Sade Afolabi",
  "whatsapp_number": "2348012345678",
  "telegram_chat_id": "7001002003",
  "bank_details": "GTBank 0123456789 - Sade Afolabi",
  "bank_code": "058",
  "account_number": "0123456789",
  "account_name": "Sade Afolabi",
  "subaccount_code": "ACCT_xxxxxxxxxx",
  "is_active": true,
  "rating": 5,
  "hours": "9am-9pm",
  "location": "Yaba",
  "image_url": "https://example.com/vendor.jpg",
  "description": "Homestyle Nigerian meals"
}
```

Success response:

```json
{
  "vendor_id": "VEN-4821",
  "slug": "mama-sade-kitchen",
  "message": "Vendor updated successfully"
}
```

### `PATCH /api/v1/admin/vendors/{id}/activate`

Activate or deactivate a vendor. Primary use is to approve self-registered vendors.

Request body:

```json
{
  "is_active": true
}
```

Success response:

```json
{
  "vendor_id": "VEN-4821",
  "is_active": true,
  "message": "Vendor activated successfully."
}
```

### `POST /api/v1/admin/vendors/{id}/regenerate-pairing`

Generates a new pairing code for a vendor (e.g. if the vendor lost theirs or it expired after partial linking).

No request body required.

Success response:

```json
{
  "vendor_id": "VEN-4821",
  "pairing_code": "a1b2c3d4",
  "message": "New pairing code generated. Share this with the vendor to complete Telegram linking."
}
```

### `DELETE /api/v1/admin/vendors/{id}`

Soft-deletes a vendor by setting `is_active=false`.

Success response:

```json
{
  "message": "Vendor removed successfully",
  "vendor_id": "VEN-4821"
}
```

---

## Admin Menu Management

All routes require `Authorization: Bearer <access_token>` from a superadmin.

### `GET /api/v1/admin/vendors/{id}/menu`

Returns all menu items for a vendor including unavailable items (admin view).

Success response:

```json
[
  {
    "id": 1,
    "name": "Jollof Rice",
    "price": 1500,
    "category": "Rice",
    "description": null,
    "is_available": true,
    "stock_qty": 20,
    "reorder_level": 5
  }
]
```

### `POST /api/v1/admin/vendors/{id}/menu`

Adds a new menu item to a vendor after onboarding.

Request body:

```json
{
  "name": "Egusi Soup",
  "price": 1800,
  "category": "Soup"
}
```

Success response `201`:

```json
{
  "id": 5,
  "name": "Egusi Soup",
  "price": 1800,
  "category": "Soup",
  "description": null,
  "is_available": true,
  "stock_qty": null,
  "reorder_level": null
}
```

Error: `400` if an item with the same name already exists for this vendor.

### `PATCH /api/v1/admin/vendors/{id}/menu/{item_id}`

Updates any fields on a specific menu item.

Request body (all fields optional):

```json
{
  "price": 2000,
  "is_available": false,
  "stock_qty": 10,
  "reorder_level": 3
}
```

Success response: updated `MenuItemAdminResponse` object.

### `DELETE /api/v1/admin/vendors/{id}/menu/{item_id}`

Permanently removes a menu item.

Success response:

```json
{
  "message": "Menu item 'Egusi Soup' removed.",
  "item_id": 5
}
```

---

## Public Vendor Self-Registration

### `POST /api/v1/vendors/register`

Allows a vendor to register themselves without admin involvement.

- No authentication required
- Vendor is created with `is_active=False` (pending admin approval)
- Admin approves via `PATCH /api/v1/admin/vendors/{id}/activate`
- A `pairing_code` is issued immediately — vendor can complete Telegram linking once activated

Request body (same fields as admin onboard):

```json
{
  "business_name": "Mama Sade Kitchen",
  "owner_name": "Sade Afolabi",
  "slug": "mama-sade-kitchen",
  "telegram_chat_id": "7001002003",
  "bank_details": "GTBank 0123456789 - Sade Afolabi",
  "email": "sade.vendor@example.com",
  "password": "VendorPass123!",
  "menu_items": [
    {
      "name": "Jollof Rice",
      "price": 1500,
      "category": "Rice"
    }
  ]
}
```

Success response `201`:

```json
{
  "vendor_id": "VEN-4821",
  "slug": "mama-sade-kitchen",
  "status": "pending_activation",
  "message": "Registration successful. Your store is pending admin review before going live. Save your pairing code — you will need it to link your Telegram account once activated.",
  "pairing_code": "8f3a9b21",
  "qr_image_url": "/static/qr_codes/mama-sade-kitchen.png"
}
```

Field notes:

- `qr_image_url` may be `null` if `TELEGRAM_BOT_USERNAME` is not configured (QR is best-effort for self-registration)
- `status` is always `"pending_activation"` until admin activates the vendor

Error responses:

- `400` — email already registered
- `400` — Telegram chat ID already linked to another vendor
- `400` — `menu_items` is empty

---

## Public Vendor Endpoints

These routes do not require authentication.

### `GET /api/v1/vendors/{slug}`

Returns public vendor information. Does not expose `pairing_code`.

Success response:

```json
{
  "slug": "mama-sade-kitchen",
  "business_name": "Mama Sade Kitchen",
  "owner_name": "Sade Afolabi",
  "whatsapp_number": "2348012345678",
  "is_active": true,
  "rating": 5,
  "hours": "9am-9pm",
  "location": "Yaba",
  "image_url": "https://example.com/vendor.jpg",
  "description": "Homestyle Nigerian meals"
}
```

Note: returns `410 Gone` if the vendor is inactive.

### `GET /api/v1/vendors/{slug}/menu`

Returns the vendor menu grouped by category (available items only).

Success response:

```json
{
  "vendor_slug": "mama-sade-kitchen",
  "business_name": "Mama Sade Kitchen",
  "categories": {
    "Rice": [
      {
        "id": 1,
        "name": "Jollof Rice",
        "price": 1500,
        "category": "Rice",
        "description": null,
        "is_available": true
      }
    ]
  }
}
```

### `GET /api/v1/vendors/{slug}/qr`

Builds the vendor entry URL and generates a QR code image.

Success response:

```json
{
  "slug": "mama-sade-kitchen",
  "business_name": "Mama Sade Kitchen",
  "entry_url": "https://t.me/<telegram-bot-username>?start=mama-sade-kitchen",
  "qr_image_url": "/static/qr_codes/mama-sade-kitchen.png"
}
```

Environment requirements:

- If `OWNER_PLATFORM=telegram`, `TELEGRAM_BOT_USERNAME` must be set
- If `OWNER_PLATFORM=whatsapp`, `OWNER_PHONE` must be set

---

## Orders

### `POST /api/v1/orders`

Creates an order for a vendor slug.

Request body:

```json
{
  "vendor_slug": "mama-sade-kitchen",
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2,
      "unit_price": 1500
    }
  ],
  "delivery_address": "123 Main Street, Lagos",
  "notes": "Please add extra pepper"
}
```

Success response:

```json
{
  "order_id": 15,
  "vendor_slug": "mama-sade-kitchen",
  "user_id": 1,
  "items": [
    {
      "menu_item_id": 1,
      "menu_item_name": "Jollof Rice",
      "quantity": 2,
      "unit_price": 1500,
      "line_total": 3000
    }
  ],
  "total_amount": 3000,
  "status": "Pending",
  "delivery_address": "123 Main Street, Lagos",
  "notes": "Please add extra pepper",
  "created_at": "2026-05-04T12:00:00",
  "payment_reference": null,
  "payment_status": "PENDING"
}
```

Known limitations:

- `unit_price` is trusted from the client (not recalculated from DB)
- `delivery_address` and `notes` are not persisted on the Order ORM model
- Placeholder `user_id = 1` is used
- `payment_reference` is `null` until `initialize_checkout` is called; `payment_status` starts as `"PENDING"`

### `POST /api/v1/orders/verify`

Verifies a payment reference.

Request body:

```json
{
  "reference": "paystack_reference_123"
}
```

### `GET /api/v1/orders/{order_id}`

Returns an order by ID.

---

## Webhook Endpoints

### `GET /api/v1/webhook`

WhatsApp webhook verification. Returns plain text `hub.challenge`.

### `POST /api/v1/webhook`

WhatsApp inbound webhook. Requires `X-Hub-Signature-256` header.

### `POST /api/v1/telegram/webhook`

Telegram inbound webhook. Requires `X-Telegram-Bot-Api-Secret-Token` header.

### `POST /api/v1/webhooks/paystack`

Paystack payment event listener. Verifies the `X-Paystack-Signature` header (HMAC-SHA512 of the raw request body using `PAYSTACK_SECRET_KEY`) before processing.

**Security requirement**: Requests without a valid signature are rejected with `400`.

**Supported events**:

| Event | Action |
|---|---|
| `charge.success` | Sets `Order.payment_status = "PAID"` and `Order.status = "Paid"`. Looks up by `Order.payment_reference`; falls back to `order_id` from metadata. |
| Any other event | Acknowledged with `{"status": "success"}` and ignored. |

**Response**: Always `200 {"status": "success"}` once the signature is verified. Paystack retries on non-200.

Required environment variable: `PAYSTACK_SECRET_KEY`

Implemented in `app/api/endpoints/webhooks.py`.

---

## Demo Endpoints

### `GET /api/v1/demo/chats`

Returns recent demo chat rows.

### `POST /api/v1/demo/reset`

Clears demo chats. Requires `X-Admin-Reset-Token` header.

---

## Health Check

### `GET /`

```json
{
  "status": "Bukka AI System Online ..."
}
```

---

## Pairing Flow

The implemented pairing flow is bot-driven, not frontend-only.

1. Admin onboards a vendor (or vendor self-registers) and receives a server-generated `pairing_code`.
2. The vendor sends `/link <pairing_code>` to the Telegram or WhatsApp bot.
3. The backend binds that vendor to `telegram_chat_id` or `whatsapp_number`.
4. The backend clears the `pairing_code` after successful linking.
5. Customers enter the storefront by slug:
   - Telegram: `/start <vendor-slug>`
   - WhatsApp: message text containing `[ref:<vendor-slug>]`

For self-registered vendors, the pairing code is issued at registration but **the bot will only accept `/link` after the admin activates the vendor** (is_active=True).

Security requirement:

- `pairing_code` must not be exposed by public vendor endpoints

---

## Self-Registration Approval Workflow

1. Vendor submits `POST /api/v1/vendors/register` → receives `vendor_id` and `pairing_code`
2. Admin sees pending vendor in `GET /api/v1/admin/vendors?is_active=false`
3. Admin reviews and calls `PATCH /api/v1/admin/vendors/{id}/activate` with `{"is_active": true}`
4. Vendor receives the `pairing_code` (shared at registration) and sends `/link <code>` to the bot
5. Vendor is live

---

## Documentation Change Rules

When the backend changes, update this file in the same pull request if any of the following change:

- route path or auth requirements
- request body shape
- response body shape
- required environment variables
- live-known production blockers or security issues
