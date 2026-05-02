# Bukka AI API Documentation

This document provides a detailed reference for all API endpoints available in the Bukka AI system.

## Table of Contents

- [Authentication](#authentication)
- [Admin Endpoints](#admin-endpoints)
- [Orders](#orders)
- [Webhook Endpoints](#webhook-endpoints)
- [Demo Endpoints](#demo-endpoints)
- [General Endpoints](#general-endpoints)

---

## Authentication

Several endpoints are protected and require specific headers for authentication or verification.

- **WhatsApp Webhooks:** Require an `X-Hub-Signature-256` header for HMAC-SHA256 signature verification.
- **Telegram Webhooks:** Require an `X-Telegram-Bot-Api-Secret-Token` header.
- **Admin Actions:** Certain administrative actions, like resetting demo data, require an `X-Admin-Reset-Token`.

These tokens and secrets are configured via environment variables.

---

## Admin Endpoints

These endpoints are used for administrative tasks like vendor management.

### Admin Login

- **`POST /api/v1/admin/login`**

  Authenticates an admin user using credentials and returns a JWT access token.

  **Request Body:**

  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```

  **Successful Response (200):**

  ```json
  {
    "access_token": "eyJhb...",
    "token_type": "bearer"
  }
  ```

### Onboard New Vendor

- **`POST /api/v1/admin/vendors/onboard`**

  Onboards a new vendor, creates a unique vendor ID, saves menu items, generates a WhatsApp click-to-chat QR code, and saves it to the static directory.
  **Requires Authentication:** Bearer Token from `/api/v1/admin/login`.

  **Request Body:**

  ```json
  {
    "business_name": "Mama J's Kitchen",
    "owner_name": "Jane Doe",
    "whatsapp_number": "2348012345678",
    "bank_details": "GTBank 0123456789",
    "menu_items": [
      {
        "name": "Jollof Rice",
        "price": 500,
        "category": "Main"
      }
    ]
  }
  ```

  **Successful Response (200):**

  ```json
  {
    "vendor_id": "VEN-1234",
    "message": "Vendor successfully onboarded.",
    "qr_image_url": "/static/qr_codes/VEN-1234.png"
  }
  ```

### Get Vendor Directory

- **`GET /api/v1/admin/vendors`**

  Retrieves a list of all onboarded vendors with a dynamic count of their active menu items. Supports pagination.
  **Requires Authentication:** Bearer Token from `/api/v1/admin/login`.

  **Query Parameters:**
  - `skip` (int): Number of records to skip (default: 0)
  - `limit` (int): Max number of records to return (default: 100)

  **Successful Response (200):**

  ```json
  [
    {
      "vendor_id": "VEN-1234",
      "slug": "mama-j-kitchen",
      "business_name": "Mama J's Kitchen",
      "owner_name": "Jane Doe",
      "active_menu_items_count": 5
    }
  ]
  ```

### Get Single Vendor

- **`GET /api/v1/admin/vendors/{id}`**

  Retrieves detailed information about a specific vendor by internal ID.
  **Requires Authentication:** Bearer Token from `/api/v1/admin/login`.

  **Path Parameters:**
  - `id` (str): The internal vendor ID

  **Successful Response (200):**

  ```json
  {
    "id": 1,
    "vendor_id": "VEN-1234",
    "slug": "mama-j-kitchen",
    "business_name": "Mama J's Kitchen",
    "owner_name": "Jane Doe",
    "whatsapp_number": "2348012345678",
    "telegram_chat_id": "123456789",
    "bank_details": "GTBank 0123456789",
    "pairing_code": "a1b2c3d4",
    "is_active": true,
    "active_menu_items_count": 5,
    "created_at": "2026-05-01T10:00:00"
  }
  ```

### Update Vendor

- **`PATCH /api/v1/admin/vendors/{id}`**

  Updates vendor information (business name, contact details, active status).
  **Requires Authentication:** Bearer Token from `/api/v1/admin/login`.

  **Path Parameters:**
  - `id` (str): The internal vendor ID

  **Request Body:**

  ```json
  {
    "business_name": "Mama J's Updated Kitchen",
    "whatsapp_number": "2348012345678",
    "is_active": true
  }
  ```

  **Successful Response (200):**

  ```json
  {
    "vendor_id": "VEN-1234",
    "slug": "mama-j-kitchen",
    "message": "Vendor updated successfully"
  }
  ```

### Remove Vendor

- **`DELETE /api/v1/admin/vendors/{id}`**

  Soft-deletes a vendor by setting `is_active` to false.
  **Requires Authentication:** Bearer Token from `/api/v1/admin/login`.

  **Path Parameters:**
  - `id` (str): The internal vendor ID

  **Successful Response (200):**

  ```json
  {
    "message": "Vendor removed successfully",
    "vendor_id": "VEN-1234"
  }
  ```

---

## Public Vendor Endpoints

These endpoints are publicly accessible (no authentication required) for customer-facing features.

### Get Vendor Details

- **`GET /api/v1/vendors/{slug}`**

  Retrieves public vendor information (name, status, contact).
  
  **Path Parameters:**
  - `slug` (str): The vendor's URL-friendly slug

  **Successful Response (200):**

  ```json
  {
    "slug": "mama-j-kitchen",
    "business_name": "Mama J's Kitchen",
    "owner_name": "Jane Doe",
    "whatsapp_number": "2348012345678",
    "is_active": true,
    "pairing_code": "a1b2c3d4"
  }
  ```

### Get Vendor Menu

- **`GET /api/v1/vendors/{slug}/menu`**

  Retrieves vendor's menu items grouped by category.
  
  **Path Parameters:**
  - `slug` (str): The vendor's URL-friendly slug

  **Successful Response (200):**

  ```json
  {
    "vendor_slug": "mama-j-kitchen",
    "business_name": "Mama J's Kitchen",
    "categories": {
      "Main": [
        {
          "id": 1,
          "name": "Jollof Rice",
          "price": 500.0,
          "category": "Main",
          "description": null,
          "is_available": true
        }
      ],
      "Drinks": [
        {
          "id": 2,
          "name": "Zobo",
          "price": 200.0,
          "category": "Drinks",
          "description": null,
          "is_available": true
        }
      ]
    }
  }
  ```

### Get Vendor QR Code

- **`GET /api/v1/vendors/{slug}/qr`**

  Generates a QR code that links to the vendor's ordering page.
  
  **Path Parameters:**
  - `slug` (str): The vendor's URL-friendly slug

  **Successful Response (200):**

  ```json
  {
    "slug": "mama-j-kitchen",
    "business_name": "Mama J's Kitchen",
    "entry_url": "https://t.me/bukka_ai_bot?start=mama-j-kitchen",
    "qr_image_url": "/static/qr_codes/mama-j-kitchen.png"
  }
  ```

---

## Orders

These endpoints handle order creation and payment verification.

### Create Order

- **`POST /api/v1/orders`**

  Creates a new order when customer checks out.
  **No authentication required** (for customer-facing checkout).

  **Request Body:**

  ```json
  {
    "vendor_slug": "mama-j-kitchen",
    "items": [
      {
        "menu_item_id": 1,
        "quantity": 2,
        "unit_price": 500
      },
      {
        "menu_item_id": 3,
        "quantity": 1,
        "unit_price": 200
      }
    ],
    "delivery_address": "123 Main Street, Lagos",
    "notes": "Please add extra pepper"
  }
  ```

  **Successful Response (201):**

  ```json
  {
    "order_id": 15,
    "vendor_slug": "mama-j-kitchen",
    "user_id": 4,
    "items": [
      {
        "menu_item_id": 1,
        "menu_item_name": "Jollof Rice",
        "quantity": 2,
        "unit_price": 500,
        "line_total": 1000
      },
      {
        "menu_item_id": 3,
        "menu_item_name": "Zobo",
        "quantity": 1,
        "unit_price": 200,
        "line_total": 200
      }
    ],
    "total_amount": 1200,
    "status": "Pending",
    "delivery_address": "123 Main Street, Lagos",
    "notes": "Please add extra pepper",
    "created_at": "2026-05-01T10:30:00"
  }
  ```

### Verify Payment

- **`POST /api/v1/orders/verify`**

  Verifies payment after Paystack callback.
  **No authentication required** (called from payment callback).

  **Request Body:**

  ```json
  {
    "reference": "paystack_reference_123"
  }
  ```

  **Successful Response (200):**

  ```json
  {
    "order_id": 15,
    "status": "success",
    "message": "Payment verified successfully",
    "transaction_ref": "paystack_reference_123"
  }
  ```

### Get Order

- **`GET /api/v1/orders/{order_id}`**

  Retrieves order details by ID.
  **No authentication required**.

  **Path Parameters:**
  - `order_id` (int): The order ID

  **Successful Response (200):**

  ```json
  {
    "order_id": 15,
    "vendor_slug": "mama-j-kitchen",
    "user_id": 4,
    "items": [...],
    "total_amount": 1200,
    "status": "Paid",
    "created_at": "2026-05-01T10:30:00"
  }
  ```

---

## Webhook Endpoints

These endpoints are the entry points for incoming messages from messaging platforms.

### WhatsApp Webhook Verification

- **`GET /api/v1/webhook`**

  Used by Meta to verify the webhook endpoint during setup. The endpoint must echo back the `hub.challenge` value if the `hub.verify_token` is valid.

  **Query Parameters:**

  - `hub.mode`: Should be `"subscribe"`.
  - `hub.verify_token`: Your secret verification token.
  - `hub.challenge`: A random string to be echoed back.

  **Successful Response (200):**

  - The `hub.challenge` string as plain text.

### Receive WhatsApp Message

- **`POST /api/v1/webhook`**

  Receives incoming messages and status updates from the WhatsApp Cloud API. The request body is signed with HMAC-SHA256 using your App Secret.

  **Headers:**

  - `X-Hub-Signature-256`: `sha256=<signature>`

  **Request Body:**

  - A complex JSON object from the Meta Graph API. See Meta's documentation for the full schema.

  **Successful Response (200):**

  The endpoint immediately returns a `200 OK` and processes the message in the background to avoid timeouts.

  ```json
  {
    "status": "received"
  }
  ```

### Receive Telegram Message

- **`POST /api/v1/telegram/webhook`**

  Receives incoming messages and updates from the Telegram Bot API.

  **Headers:**

  - `X-Telegram-Bot-Api-Secret-Token`: Your secret webhook token.

  **Request Body:**

  - A JSON object from the Telegram Bot API representing an `Update`.

  **Successful Response (200):**

  ```json
  {
    "status": "ok"
  }
  ```

---

## Demo Endpoints

These endpoints are for demonstration and testing purposes.

### Get Demo Chats

- **`GET /api/v1/demo/chats`**

  Retrieves the last 50 messages from the database for display on a demo frontend.

  **Successful Response (200):**

  An array of message objects.

### Reset Demo Chats

- **`POST /api/v1/demo/reset`**

  Deletes all messages from the `messages` table to reset the demo state. This is a destructive action protected by a token.

  **Headers:**

  - `X-Admin-Reset-Token`: Your secret admin token.

  **Successful Response (200):**

  ```json
  {
    "status": "cleared"
  }
  ```

---

## General Endpoints

### Root / Health Check

- **`GET /`**

  A simple endpoint to confirm that the API server is online and running.

  **Successful Response (200):**

  ```json
  {
    "status": "Bukka AI System Online 🚀"
  }
  ```
