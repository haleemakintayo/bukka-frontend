# Bukka AI - Multi-Vendor Architecture Technical Breakdown

## Overview

Bukka AI is a multi-vendor food ordering platform that supports multiple restaurants/vendors through a unified Telegram and WhatsApp chatbot interface. Each vendor has their own menu, inventory, and order management system.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Messaging Platforms                       │
│  ┌─────────────────┐              ┌─────────────────┐           │
│  │    Telegram     │              │    WhatsApp     │           │
│  └────────┬────────┘              └────────┬────────┘           │
└───────────┼──────────────────────────────┼──────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (FastAPI)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ /telegram/webhook│  │ /whatsapp/webhook│  │   /auth/*      │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
└───────────┼──────────────────────┼──────────────────────┬────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Service Layer (Business Logic)               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  chat_manager   │  │  vendor_service │  │   ai_tools      │  │
│  │  (conversation) │  │  (vendor ops)   │  │   (AI/LLM)      │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
└───────────┼──────────────────────┼──────────────────────┼──────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer (SQLAlchemy)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL Database                    │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │  │
│  │  │ vendors │ │  users  │ │  orders  │ │messages │      │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │  │
│  │  │menu_items│ │user_sessions│ │accounts│ │stock_   │      │  │
│  │  │         │ │          │ │         │ │movements│      │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **vendors** | Multi-vendor registry | `id`, `vendor_id`, `slug`, `business_name`, `owner_name`, `whatsapp_number`, `telegram_chat_id`, `bank_details` |
| **users** | Customer profiles | `id`, `phone_number`, `name` |
| **orders** | Order records | `id`, `user_id`, `vendor_id`, `items`, `total_price`, `status` |
| **messages** | Chat history | `id`, `platform`, `contact_id`, `direction`, `body`, `timestamp` |
| **menu_items** | Vendor menu catalog | `id`, `vendor_id`, `name`, `category`, `price`, `is_available`, `stock_qty`, `reorder_level` |
| **user_sessions** | Multi-vendor session tracking | `id`, `user_id`, `active_vendor_id`, `last_interaction_at` |
| **accounts** | Vendor owner auth | `id`, `email`, `hashed_password`, `role`, `vendor_id`, `is_active` |
| **processed_webhook_events** | Deduplication | `id`, `platform`, `external_event_id`, `claimed_at` |
| **stock_movements** | Inventory tracking | `id`, `item_id`, `movement_type`, `qty`, `reason`, `actor_platform`, `actor_id`, `timestamp` |

---

## Multi-Vendor Session Management

### How It Works

1. **User starts a session** with a vendor:
   ```python
   set_active_user_session(db, user_id=4, vendor_id=1)
   ```

2. **System tracks active vendor** per user:
   ```python
   session = get_active_user_session(db, user_id=4)
   # Returns: UserSession(user_id=4, active_vendor_id=1, ...)
   ```

3. **Session expires after 2 hours** of inactivity:
   ```python
   if current_time - session.last_interaction_at > two_hours_ms:
       session.active_vendor_id = None  # Clear session
   ```

4. **All subsequent operations** are scoped to the active vendor:
   - Menu lookups are filtered by `vendor_id`
   - Orders are created with the active `vendor_id`
   - Inventory checks are vendor-specific

### Session Flow Diagram

```
User sends message
       │
       ▼
┌──────────────────┐
│ Check user_session│
│ for active_vendor│
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
 No session  Has session
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────────┐
│Prompt   │ │Use active_vendor │
│to select│ │for all operations│
│vendor   │ └─────────────────┘
└─────────┘
```

---

## Vendor Identification

### Via Telegram Chat ID
```python
vendor = db.query(Vendor).filter(
    Vendor.telegram_chat_id == str(telegram_user_id)
).first()
```

### Via WhatsApp Number
```python
vendor = db.query(Vendor).filter(
    Vendor.whatsapp_number == clean_number
).first()
```

### Via Vendor Slug (URL-friendly)
```python
vendor = db.query(Vendor).filter(
    Vendor.slug == "vendor-slug"
).first()
```

---

## API Endpoints

### Webhook Endpoints
| Endpoint | Platform | Purpose |
|----------|----------|---------|
| `POST /api/v1/telegram/webhook` | Telegram | Receive messages from Telegram bot |
| `GET /api/v1/webhook` | WhatsApp | Verify Meta webhook challenge |
| `POST /api/v1/webhook` | WhatsApp | Receive messages from WhatsApp Business API |

### Vendor Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/v1/admin/vendors/onboard` | POST | Register new vendor |
| `GET /api/v1/admin/vendors` | GET | List all vendors |
| `GET /api/v1/admin/vendors/{id}` | GET | Get vendor by ID |
| `PATCH /api/v1/admin/vendors/{id}` | PATCH | Update vendor |
| `DELETE /api/v1/admin/vendors/{id}` | DELETE | Remove vendor |

### Public Vendor Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/v1/vendors/{slug}` | GET | Get vendor details |
| `GET /api/v1/vendors/{slug}/menu` | GET | Get vendor menu |
| `GET /api/v1/vendors/{slug}/qr` | GET | Get vendor QR code |

### Order Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/v1/orders` | POST | Create new order |
| `POST /api/v1/orders/verify` | POST | Verify payment |
| `GET /api/v1/orders/{order_id}` | GET | Get order details |

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/v1/admin/login` | POST | Admin login |

---

## Key Service Modules

### chat_manager.py
- `process_message()` - Main message handler
- `handle_vendor_selection()` - Vendor picker flow
- `create_order_from_cart()` - Order creation

### vendor_service.py
- `get_active_user_session()` - Get current vendor for user
- `set_active_user_session()` - Set active vendor
- `get_vendor_menu_items()` - Get vendor's menu
- `resolve_vendor_product()` - Fuzzy product matching

### ai_tools.py
- `classify_intent()` - NLU intent classification
- `extract_order_details()` - Parse order from message
- `generate_response()` - AI response generation

---

## Migration History

```
98df6bb1d7c1 - Initial tables (users, orders)
    │
    ▼
c315aaec8536 - Messages table
    │
    ▼
d8e9f0a1b2c3 - Vendors table [NEW]
    │
    ▼
37bc529ad715 - Menu items
    │
    ▼
8e5c1d2a9f44 - Processed webhook events
    │
    ▼
f4b2c8d91a7e - Convert money columns to integer
    │
    ▼
2a1d9e7c6b34 - Stock tracking tables
    │
    ▼
6d5f8a7b9c21 - Add telegram_chat_id to vendors
    │
    ▼
b1c2d3e4f5a6 - Add slug to vendors
    │
    ▼
e9f0a1b2c3d4 - User sessions & accounts [NEW] ◄── HEAD
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `WHATSAPP_TOKEN` | WhatsApp Business API token | `EAAC...` |
| `OPENAI_API_KEY` | OpenAI API key for LLM | `sk-...` |
| `REDIS_URL` | Redis cache connection | `redis://localhost:6379` |

---

## Deployment (Heroku)

### Automatic Migration
Heroku automatically runs pending Alembic migrations on deploy:
```bash
git push heroku main
```

### Manual Migration (if needed)
```bash
heroku run alembic upgrade head --app bukka-ai-backend
```

### Check Migration Status
```bash
heroku run alembic current --app bukka-ai-backend
```

---

## Current Issues & Fixes

### 1. Missing user_sessions Table
- **Error**: `UndefinedTable: relation "user_sessions" does not exist`
- **Fix**: Run `heroku run alembic upgrade head --app bukka-ai-backend`
- **Status**: Migration `e9f0a1b2c3d4` creates this table

### 2. Multiple Head Revisions
- **Error**: `Multiple head revisions are present`
- **Cause**: Conflicting migration chains
- **Fix**: Delete duplicate migration files, keep single chain

---

## Future Enhancements

1. **Vendor Analytics Dashboard** - Sales per vendor
2. **Inventory Alerts** - Low stock notifications
3. **Payment Integration** - Flutterwave/Stripe
4. **Order Status Webhooks** - Real-time status updates
5. **Multi-language Support** - Hausa, Yoruba, Igbo

---

*Last Updated: May 1, 2026*
