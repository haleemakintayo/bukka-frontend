# 🥘 Bukka AI Web Ecosystem

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

The comprehensive frontend web ecosystem for **Bukka AI**, consisting of a mobile-first student "Click & Collect" ordering app, a conversion-optimized vendor landing page, and a desktop-optimized admin dashboard.

## ✨ Core Features

### 🚀 **Landing Page**
Designed to convert campus food vendors (*bukkas*) to the Bukka AI platform:
- **Interactive Preview**: Live, mocked interactive WhatsApp chat showing *Auntie Chioma* handling student orders in Pidgin.
- **Value Propositions**: Highlights "Zero fake transfer anxiety", faster queues with QR scans, and built-in AI upselling.
- **Vendor Trust**: Features vendor testimonials and impact statistics (Avg. order time 45s, +32% sales lift).
- **Aesthetics**: Polished dark theme integration, animated depth effects, and glassmorphism styling using the custom Bukka brand palette.

### 📊 **Admin Dashboard**
A powerful, analytics-first desktop dashboard for system administrators and vendor management:
- **Real-Time Metrics Grid**: Instant overview of Active Vendors, Gross Volume, Total Orders, and Average Order Value, including week-over-week trends.
- **Interactive Data Visualization**: Clean, custom-themed charts built with `recharts`:
  - *Revenue Trajectory*: Smooth area chart displaying dynamic revenue over time.
  - *Peak Order Days*: Bar chart to analyze high-traffic ordering patterns.
- **Vendor Management Flow**: Comprehensive listing, activation, and specialized vendor onboarding form components.

### 📱 **Student "Click & Collect" (Mobile-First)**
The frictionless checkout loop for students interacting via WhatsApp/Telegram:
- **Vendor Menu View**: Responsive browsing of real-time inventory and combo deals.
- **Smart Checkout**: Review AI-compiled carts, customize quantities, and securely navigate directly to Paystack payment gates.
- **Order Success Loop**: Immediate visual confirmation, reducing anxiety for the student while triggering the "Green Alert" for the vendor.

## 🎨 Design System
This application implements a strict **Bukka Design System** featuring:
- **Brand Colors**: Vivid Orange (`#FF6600`), Deep Bukka Green (`#0F6B43`), and bright Cyan (`#2CD6EB`) accents.
- **Dark Mode**: A natively integrated premium dark surface aesthetic (`#0A0A0A`, `#141414`), making the UI feel vibrant, dynamic, and professional.
- **Responsive Layout**: Seamlessly shifting from a compact vertical flow for students to expansive data-heavy grids for dashboard admins.

## 🛠️ Quick Start

```bash
# 🥘 Bukka AI Web Ecosystem

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

The comprehensive frontend web ecosystem for **Bukka AI**, consisting of a mobile-first student "Click & Collect" ordering app, a conversion-optimized vendor landing page, and a desktop-optimized admin dashboard.

## ✨ Core Features

### 🚀 **Landing Page**
Designed to convert campus food vendors (*bukkas*) to the Bukka AI platform:
- **Interactive Preview**: Live, mocked interactive WhatsApp chat showing *Auntie Chioma* handling student orders in Pidgin.
- **Value Propositions**: Highlights "Zero fake transfer anxiety", faster queues with QR scans, and built-in AI upselling.
- **Vendor Trust**: Features vendor testimonials and impact statistics (Avg. order time 45s, +32% sales lift).
- **Aesthetics**: Polished dark theme integration, animated depth effects, and glassmorphism styling using the custom Bukka brand palette.

### 📊 **Admin Dashboard**
A powerful, analytics-first desktop dashboard for system administrators and vendor management:
- **Real-Time Metrics Grid**: Instant overview of Active Vendors, Gross Volume, Total Orders, and Average Order Value, including week-over-week trends.
- **Interactive Data Visualization**: Clean, custom-themed charts built with `recharts`:
  - *Revenue Trajectory*: Smooth area chart displaying dynamic revenue over time.
  - *Peak Order Days*: Bar chart to analyze high-traffic ordering patterns.
- **Vendor Management Flow**: Comprehensive listing, activation, and specialized vendor onboarding form components.

### 📱 **Student "Click & Collect" (Mobile-First)**
The frictionless checkout loop for students interacting via WhatsApp/Telegram:
- **Vendor Menu View**: Responsive browsing of real-time inventory and combo deals.
- **Smart Checkout**: Review AI-compiled carts, customize quantities, and securely navigate directly to Paystack payment gates.
- **Order Success Loop**: Immediate visual confirmation, reducing anxiety for the student while triggering the "Green Alert" for the vendor.

## 🎨 Design System
This application implements a strict **Bukka Design System** featuring:
- **Brand Colors**: Vivid Orange (`#FF6600`), Deep Bukka Green (`#0F6B43`), and bright Cyan (`#2CD6EB`) accents.
- **Dark Mode**: A natively integrated premium dark surface aesthetic (`#0A0A0A`, `#141414`), making the UI feel vibrant, dynamic, and professional.
- **Responsive Layout**: Seamlessly shifting from a compact vertical flow for students to expansive data-heavy grids for dashboard admins.

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```text
bukka-frontend/
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── AdminSidebar.jsx        # Sidebar navigation for the admin dashboard
│   │   ├── CartSummaryBar.jsx      # Mobile sticky bottom bar for checkout
│   │   └── LandingNavbar.jsx       # Navigation bar for public pages
│   │
│   ├── context/                    # React Context providers for global state
│   │   ├── CartContext.jsx         # Manages user shopping cart state
│   │   └── VendorAuthContext.jsx   # Manages vendor authentication and session
│   │
│   ├── layouts/                    # Layout shells for different application sections
│   │   └── VendorLayout.jsx        # Bottom navigation layout for the Vendor PWA
│   │
│   ├── pages/                      # Main application views/pages
│   │   ├── AdminDashboard.jsx      # Admin overview dashboard
│   │   ├── AdminLogin.jsx          # Admin login portal
│   │   ├── ChatPrototype.jsx       # AI chat interface prototype for admin
│   │   ├── OnboardVendorForm.jsx   # Form to onboard new vendors
│   │   ├── VendorDetails.jsx       # Detailed view/edit page for a specific vendor
│   │   ├── VendorList.jsx          # List of all registered vendors
│   │   │
│   │   ├── public/                 # Publicly accessible pages
│   │   │   ├── Checkout.jsx        # Cart checkout page
│   │   │   ├── LandingPage.jsx     # Main landing page (marketing)
│   │   │   ├── OrderSuccess.jsx    # Successful order confirmation page
│   │   │   ├── VendorMenu.jsx      # Public menu view for customers to order from
│   │   │   └── VendorOnboardingGuide.jsx # Public self-service guide for vendors
│   │   │
│   │   └── vendor/                 # Vendor mobile-first PWA dashboard pages
│   │       ├── VendorDashboard.jsx # Vendor dashboard showing payouts & orders
│   │       ├── VendorLogin.jsx     # Vendor login via phone/telegram + PIN
│   │       └── VendorMenuManager.jsx # Vendor view to toggle item availability
│   │
│   ├── services/                   # API clients and business logic
│   │   ├── adminService.js         # API calls for admin operations (vendors, orders)
│   │   ├── api.js                  # Shared API utilities and constants
│   │   ├── apiClient.js            # Axios instance with auth token interceptors
│   │   ├── publicService.js        # API calls for public actions (menus, checkout)
│   │   └── vendorService.js        # API calls for vendor specific operations
│   │
│   ├── App.jsx                     # Application router and layout configuration
│   ├── App.css                     # Global styles
│   ├── index.css                   # Tailwind entry point
│   └── main.jsx                    # React entry point
│
├── api.md                          # API documentation contract
├── MULTI_VENDOR_ARCHITECTURE.md    # Architecture and data flow documentation
├── package.json                    # Project dependencies and scripts
└── vite.config.js                  # Vite bundler configuration
```
