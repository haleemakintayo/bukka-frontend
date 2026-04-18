Frontend PRD: Bukka AI Web Ecosystem (V1 Pilot)
Project Title: Bukka AI Frontend (V1 Campus Pilot)
Platform: Web / Mobile Web (React SPA)
Target Location: Olabisi Onabanjo University (OOU)

1. Executive Overview
The Bukka AI frontend ecosystem consists of two distinct Single Page Applications (SPAs) sharing the same technical foundation but serving entirely different user bases:

The Student Web App (B2C): A high-speed, mobile-optimized checkout interface ("The Cashier") designed to eliminate queues and process Paystack payments in under 30 seconds.

The Admin Dashboard (Internal): A secure, desktop-optimized back-office tool for the operations team to rapidly onboard vendors, generate QR codes, and monitor pilot analytics.

2. Technology Stack & Architecture
Framework: React 18 (Initialized via Vite for fast builds).

Routing: React Router DOM v6.

Styling: Tailwind CSS (Utility-first styling).

UI Library: shadcn/ui (Accessible, customizable Radix UI components) & Lucide-React (Icons).

State Management: React Context API (for Cart state) & standard React Hooks.

HTTP Client: Axios.

Hosting & Deployment: Vercel (Auto-deployed from GitHub main branch).

Design System: * Primary: Bukka Green (#128C7E)

Secondary/CTA: Bukka Orange (#E65100)

Backgrounds: Off-white/Gray (bg-gray-50)

3. Component A: The Student "Click & Collect" Web App
Objective: Provide a frictionless, visually appealing digital menu and checkout experience for students scanning the physical QR codes on campus.

3.1. Core User Flow
Student clicks the link provided by the Bukka AI WhatsApp bot.

The web app loads the specific menu based on the vendor_id in the URL (e.g., bukkaai.com.ng/order/VEN-4092).

Student adds items to the cart and proceeds to checkout.

Student enters their WhatsApp number and pays via the Paystack popup.

Student is redirected to a Success Screen and receives their WhatsApp "Order Ready" alert.

3.2. Key Screens & Features
Vendor Landing View:

Header: Displays Vendor Business Name and an "Open/Closed" status badge.

Menu Feed: Categorized list of items (e.g., Proteins, Swallows, Drinks).

Item Cards: Displays Name, Price, and a prominent + Add button. Items marked is_available: false in the database render as grayed out ("Sold Out") with the button disabled.

Floating Cart Summary:

A sticky bottom bar appearing only when items are in the cart, displaying: [Total Items] | [Total Price] | [View Cart Button].

Checkout & Payment View:

Cart Review: Ability to increment/decrement quantities or remove items.

Cost Breakdown: Subtotal (Food) + Convenience Fee (₦50) = Final Total.

Input Field: Requires the student's WhatsApp number (crucial for linking the order back to the WhatsApp bot for the pickup notification).

Payment Trigger: An integrated "Pay with Paystack" button using the react-paystack wrapper.

Success View:

Displays a large green checkmark, the Order Number (e.g., #042), and text: "Payment successful! Please return to WhatsApp for your pickup notification."

3.3. UX Constraints
Mobile-First Strictness: 99% of traffic will be from student smartphones. The UI must feature large touch targets and avoid complex dropdowns.

No Authentication: Students MUST NOT be forced to create an account or log in. Friction kills conversion.

4. Component B: The Internal Admin Dashboard
Objective: A secure, efficient tool for the Bukka AI Ops Team to manage the campus pilot without needing database engineering skills.

4.1. Core User Flow
Ops team member logs in securely on a desktop or tablet.

Navigates to the Dashboard to view daily pilot metrics.

Uses the Onboarding tool to digitize a physical Bukka's menu.

Downloads the generated QR code to send to the printer.

4.2. Key Screens & Features
Authentication (Login):

Standard Username/Password form protected by JWT (JSON Web Tokens). Unauthorized access redirects to /login.

The 60-Second Onboarding Engine (Form):

Vendor Profile Details: Inputs for Business Name, Owner Name, WhatsApp Number.

Financial Details: Select dropdown for Nigerian Banks and Account Number input.

Dynamic Menu Builder: An interactive form segment allowing the Ops team to dynamically add/remove rows for [Item Name] and [Price].

Submission & QR Retrieval: Upon successful API POST, the UI immediately displays the newly generated vendor_id and the .png QR code image with a "Download to Device" button.

Vendor Directory (Data Table):

A searchable, paginated table listing all onboarded vendors.

Columns: Vendor ID, Business Name, WhatsApp Number, Status (Active/Inactive pill).

Action Menu: A three-dot menu on each row allowing the admin to re-download the QR code or toggle the vendor's active status.

Analytics Overview (The "God Mode"):

High-level metric cards displaying: Total Vendors, Total Orders Processed, Total GMV (Food), and Total Platform Revenue (The ₦50 fees).

4.3. UX Constraints
Desktop-Optimized: Designed primarily for laptop use by the internal team, utilizing sidebars and wide data tables.

Speed & Feedback: Every form submission must have a clear loading state (e.g., button changes to "Processing...") to prevent double submissions.

5. API Integration Map (FastAPI Endpoints)
The frontend requires the following RESTful routes from the backend to function:

Public Routes (Student App):

GET /api/menu/{vendor_id} - Fetches the live menu for a specific vendor.

POST /api/orders/verify - Submits the cart payload and Paystack reference for backend verification.

Protected Routes (Admin Dashboard):

POST /api/admin/login - Returns the JWT token.

POST /api/vendors/onboard - Accepts the onboarding payload, creates the vendor/menu, and returns the QR code URL.

GET /api/vendors - Fetches the directory list.
# SYSTEM CONTEXT: BUKKA AI FRONTEND & BRANDING
You are an expert React frontend developer building the web ecosystem for "Bukka AI"—a hybrid WhatsApp & Web food ordering system for university campuses.

Our tech stack: Vite, React 18, Tailwind CSS, React Router v6, Axios, Lucide-React, and shadcn/ui.

# BRAND DESIGN SYSTEM (STRICT ENFORCEMENT)
You must adhere to the official brand guidelines extracted from our design files.

## 1. Color Palette (Tailwind Config)
Please configure the `tailwind.config.js` to include these specific brand colors:
- **Primary Green (`bukka-green`):** A deep, rich forest green (Approx. `#0F6B43`). Use for primary buttons, active states, and trust elements.
- **Accent Orange (`bukka-orange`):** A vibrant, appetizing bright orange (Approx. `#FF6600`). Use for urgent call-to-actions, warning badges, and the logo mark.
- **Backgrounds:** Pure white (`#FFFFFF`) for cards, and a very subtle off-white/gray (`bg-gray-50`) for app backgrounds to make the white cards pop.
- **Text:** Dark slate/gray (`text-gray-900`) for primary text. Never use pure black.

## 2. Typography & Styling
- **Headings/Logos:** The brand uses a bold, rounded, lowercase sans-serif aesthetic. When styling the text logo or major headings, use `font-bold tracking-tight lowercase` to mimic the friendly brand identity.
- **Tagline:** "your ai powered food ordering system" (always lowercase in marketing assets).
- **Border Radius:** The logo and overall brand identity lean heavily on rounded shapes. Use generous border radii for UI elements (e.g., `rounded-xl` or `rounded-2xl` for cards, `rounded-full` for buttons). Avoid sharp, blocky corners.

## 3. UI/UX Vibe
- **Student App (Click & Collect):** Must feel like a modern, fast food delivery app (similar to Glovo or Uber Eats). High contrast, appetizing, with zero friction.
- **Admin App:** Clean, spacious, SaaS-style data tables.

## 4. Architecture Reminders
- No class components; use functional hooks only.
- Ensure all Axios requests have proper `try/catch` blocks and loading states.
- The app must be fully mobile-responsive (mobile-first design).

Acknowledge these brand guidelines and architectural rules. Reply with "Brand Identity Loaded" before we begin the next coding task.