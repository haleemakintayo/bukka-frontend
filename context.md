# BUKKA AI - FRONTEND ARCHITECTURE & CONTEXT

## 1. Project Overview
Bukka AI is a B2B2C FoodTech & Fintech platform for Nigerian university campus food vendors (Bukkas). 
- **The Core Product:** An AI agent ("Auntie Chioma") that takes food orders via WhatsApp in Nigerian Pidgin, calculates totals, and routes split payments via Paystack.
- **This Frontend:** A lightweight, blazing-fast web application that serves as both the public marketing Landing Page and the secure internal Admin/Operations Dashboard used to onboard vendors.

## 2. Tech Stack & Core Libraries
- **Framework:** React 18 (Initialized via Vite)
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS (Strictly utility classes, no custom CSS files unless absolutely necessary)
- **UI Components:** shadcn/ui (Radix UI primitives + Tailwind) & Lucide-React for icons
- **Data Fetching:** Axios
- **Backend API:** FastAPI (Base URL: `http://localhost:8000/api`)

## 3. Design System & Theme
- **Primary Color (Bukka Green):** `#128C7E` (Trust, WhatsApp native, "Green Alert")
- **Secondary Color (Bukka Orange):** `#E65100` (Appetite, speed, CTA buttons)
- **Backgrounds:** `bg-gray-50` for app backgrounds, `bg-white` for cards and form surfaces.
- **Typography:** Modern, clean sans-serif (Inter or system UI).
- **Vibe:** Clean, modern, high-contrast, mobile-first. Avoid clutter. Use generous padding (e.g., `p-6`, `py-12`).

## 4. Folder Structure Architecture
All development happens inside the `/src` directory following this exact pattern:
/src
  /assets        # Static images, SVG logos
  /components
    /ui          # Reusable micro-components (Buttons, Inputs, Cards - via shadcn)
    /layout      # Navbars, Sidebars, Footers
  /pages
    /public      # Unauthenticated marketing pages (e.g., LandingPage.jsx)
    /admin       # Secured operations pages (e.g., Login.jsx, VendorList.jsx, OnboardVendorForm.jsx)
  App.jsx        # Route definitions
  main.jsx       # Entry point

## 5. Coding Conventions & AI Instructions
When generating or refactoring code for this project, you MUST adhere to the following rules:
1. **Functional Components Only:** Use React hooks (`useState`, `useEffect`). No class components.
2. **Tailwind First:** Never use inline `style={{}}`. Always use Tailwind utility classes.
3. **Mobile Responsive:** All pages and tables must look perfect on mobile devices first, scaling up to desktop using `md:` and `lg:` prefixes.
4. **Error Handling:** Every Axios request must be wrapped in a `try/catch` block. Always provide UI feedback for loading states (e.g., "Deploying AI...") and error states.
5. **Clean Code:** Use early returns to reduce nesting. Keep components under 200 lines by breaking them down into smaller sub-components if necessary.

## 6. Core Business Logic & Data Models
- **Vendor Onboarding:** The `/admin/onboard` route sends a POST payload containing: `business_name`, `owner_name`, `whatsapp_number`, `bank_name`, `account_number`, and a dynamic array of `menu_items` [{name, price}].
- **Multi-Tenancy:** The system manages multiple vendors. Every vendor generated gets a unique `vendor_id` (e.g., `VEN-1029`) which links to their specific WhatsApp QR code.