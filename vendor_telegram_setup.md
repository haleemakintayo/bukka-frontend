Vendor Onboarding — Frontend Copy & UX Guide
This file contains all the text content, field descriptions, validation hints, and step instructions needed to build the vendor onboarding UI in the admin dashboard.

Page Title & Intro
Page heading:

Add New Vendor

Subheading:

Fill in the details below to register a new vendor on Bukka AI. Once submitted, the vendor will be live in the system and ready to receive customer orders on Telegram.

Stepper Overview (Recommended 3-Step Flow)
Display as a horizontal stepper at the top of the form:

Step	Label	Description
1	Business Details	Name, owner, contact and payment info
2	Menu Items	Add at least one food item to the vendor's menu
3	Review & Submit	Confirm all details before creating the vendor
Step 1 — Business Details
Section heading: Business Information
Field: Business Name
Label: Business Name
Placeholder: e.g. Mama Sade Kitchen
Required: Yes
Helper text: The public name customers will see when they enter the storefront.
Validation: Cannot be empty.
Field: Owner Name
Label: Owner / Contact Name
Placeholder: e.g. Sade Afolabi
Required: Yes
Helper text: The name of the person responsible for managing this vendor account.
Validation: Cannot be empty.
Field: Slug (URL Handle)
Label: Store URL Handle
Placeholder: e.g. mama-sade-kitchen
Required: No (auto-generated if left blank)
Helper text: This becomes part of the vendor's unique storefront link. Use lowercase letters, numbers, and hyphens only. Leave blank to auto-generate from the business name.
Validation: If provided — lowercase letters, numbers, and hyphens only. No spaces.
Format hint: mama-sade-kitchen → storefront link becomes t.me/BukkaAIBot?start=mama-sade-kitchen
Field: Bank Details
Label: Bank Account Details
Placeholder: e.g. GTBank 0123456789 - Sade Afolabi
Required: Yes
Helper text: This is shown to customers at checkout for manual bank transfer payments. Include bank name, account number, and account name.
Validation: Cannot be empty.
Section heading: Telegram Setup
Field: Telegram Chat ID
Label: Telegram Chat ID (Optional)
Placeholder: e.g. 7001002003
Required: No
Helper text: The vendor's personal Telegram numeric ID. If you provide this now, the vendor is immediately linked to the bot and no pairing step is needed. If you leave this blank, you will receive a pairing code after submission — share it with the vendor so they can complete the setup by messaging the bot.
Validation: Must be a number if provided. No @ symbols or usernames.
Tooltip (ℹ️ icon):
How to find a Telegram chat ID:

Ask the vendor to open Telegram and message @userinfobot
The bot will instantly reply with their numeric ID (e.g. 7001002003)
Paste that number here
Section heading: Login Credentials
These credentials will be used by the vendor owner to log in to the Bukka AI admin panel.

Field: Email Address
Label: Vendor Owner Email
Placeholder: e.g. 
sade@mamasadekitchen.com
Required: Yes
Helper text: Must be unique — this email is used as the vendor owner's login username.
Validation: Valid email format. Cannot already be registered in the system.
Error (if duplicate): This email address is already registered to another account.
Field: Password
Label: Set a Password
Placeholder: Create a secure password
Required: Yes
Helper text: The vendor owner will use this password to log in. Share it with them securely after onboarding.
Validation: Minimum 8 characters recommended.
Step 2 — Menu Items
Section heading: Vendor Menu
Description text:

Add at least one menu item. You can always update the menu later from the vendor detail page.

Menu Item Row Fields
Each row in the menu builder contains:

Field	Label	Placeholder	Required	Notes
Name	Item Name	e.g. Jollof Rice	Yes	The exact name customers will say when ordering
Price	Price (₦)	e.g. 1500	Yes	Whole numbers only — no decimals
Category	Category	e.g. Rice, Protein, Sides, Drinks	Yes	Used to group items on the menu
Add item button label: + Add Another Item

Remove item button label: ✕ (appears on each row when more than one item exists)

Validation rules:

At least one menu item is required.
Item name cannot be empty.
Price must be a positive whole number (e.g. 1500, not 1500.50).
Category cannot be empty.
Category suggestions (show as dropdown or autocomplete):

Rice
Protein
Sides
Drinks
Soup
Swallow
Snacks
Step 3 — Review & Submit
Section heading: Review Vendor Details
Description text:

Please confirm all the details below before creating the vendor. You can go back to make changes.

Display a read-only summary card showing:

Business Name
Owner Name
Store Handle (slug)
Bank Details
Telegram Chat ID (show Not provided — pairing required if blank)
Email
Number of menu items (e.g. 4 items added)
Submit Button
Label: Create Vendor
Loading state label: Creating vendor…
Disabled state: When any required field is missing or validation has failed.
Success State (After Submission)
Show a success panel / modal with the following content:

✅ Vendor Created Successfully
Heading: {business_name} is now live on Bukka AI

Body text:

The vendor account has been created. Below are the details you need to complete the setup.

Info Cards to Display
Card 1 — Vendor ID
Vendor ID: VEN-4821 Use this ID to manage the vendor from the admin panel.

Card 2 — Storefront QR Code
QR Code: (show the QR image from qr_image_url) The vendor can print this and place it at their location. Customers scan it to start ordering.

Card 3 — Pairing Code (only show if telegram_chat_id was NOT provided)
Display this card prominently with a warning style:

⚠️ Telegram Pairing Required

Pairing Code: 8f3a9b21

This vendor is not yet connected to Telegram. To complete setup:

Share this pairing code with the vendor owner securely (e.g. via phone or email — do NOT share publicly).
Ask the vendor to open the Bukka AI bot on Telegram: t.me/BukkaAIBot
The vendor should send this exact message to the bot:
/link 8f3a9b21
The bot will confirm with a ✅ success message and the vendor will be live.
The pairing code is single-use and will expire once used.

Card 4 — Already Linked (only show if telegram_chat_id WAS provided)
✅ Telegram Connected

This vendor is already linked to Telegram using the chat ID you provided. No further setup is needed — the vendor will start receiving order notifications immediately.

Action Buttons (after success)
View Vendor → navigates to GET /api/v1/admin/vendors/{vendor_id} detail page
Add Another Vendor → resets the form and starts again
Download QR Code → triggers download of the QR image
Error States
API errors to handle and display
HTTP Status	Scenario	User-facing message
400	Email already registered	This email address is already registered to another account.
400	Telegram chat ID already used	This Telegram chat ID is already linked to another vendor. Please check the ID and try again.
500	QR generation failed (usually missing env var)	Vendor creation failed: the system could not generate the storefront QR code. Please contact the system administrator.
Network error	Request timed out	Could not connect to the server. Please check your connection and try again.
Post-Onboarding: What Happens Next
Show this as a collapsible "What happens next?" section or a timeline below the success card:

After Onboarding — Timeline
Step A — Vendor completes Telegram pairing (if pairing code was issued)

The vendor messages /link <pairing_code> to the Bukka AI bot. Once sent, the bot responds with a confirmation and the full list of vendor commands. The vendor is now live.

Step B — Vendor gets familiar with bot commands

Once linked, the vendor can manage their store entirely through Telegram:

Command	What it does
/menu	See all current menu items
/add Jollof Rice 1500	Add or update a menu item
/out Chicken	Mark an item as out of stock
/restock Chicken	Mark an item as available again
/confirm 105	Approve order #105 and notify the customer
/stock	View stock levels snapshot
/help	See the full command list
Step C — Customers start ordering

Customers scan the vendor's QR code or follow the storefront link. This opens the bot with a /start command pre-filled. The bot greets the customer and they can start ordering from the vendor's menu using natural language (e.g. "I want 2 jollof rice and a chicken").

Step D — Orders flow to the vendor

When a customer checks out, the vendor receives an order notification on Telegram. The vendor reviews it and types /confirm <order_id> to approve and notify the customer that their food is being prepared.

Field Summary Table (for developer reference)
Field	Maps to API field	Type	Required
Business Name	business_name	string	✅ Yes
Owner Name	owner_name	string	✅ Yes
Store Handle	slug	string	❌ Optional (auto-generated)
Telegram Chat ID	telegram_chat_id	string (numeric)	❌ Optional
Bank Details	bank_details	string	✅ Yes
Email	email	string (email)	✅ Yes
Password	password	string	✅ Yes
Menu Items	menu_items[]	array	✅ Min 1 item
→ Item Name	menu_items[].name	string	✅ Yes
→ Price	menu_items[].price	integer (₦)	✅ Yes
→ Category	menu_items[].category	string	✅ Yes
API Call Reference (for frontend developer)
Endpoint: POST /api/v1/admin/vendors/onboard Auth: Authorization: Bearer <admin_access_token> Content-Type: application/json

Example payload:

json
{
  "business_name": "Mama Sade Kitchen",
  "owner_name": "Sade Afolabi",
  "slug": "mama-sade-kitchen",
  "telegram_chat_id": "7001002003",
  "bank_details": "GTBank 0123456789 - Sade Afolabi",
  "email": "sade@mamasadekitchen.com",
  "password": "VendorPass123!",
  "menu_items": [
    { "name": "Jollof Rice", "price": 1500, "category": "Rice" },
    { "name": "Fried Rice",  "price": 1600, "category": "Rice" },
    { "name": "Chicken",     "price": 2200, "category": "Protein" },
    { "name": "Plantain",    "price": 700,  "category": "Sides" }
  ]
}
Success response (use these fields to populate the success state):

json
{
  "vendor_id": "VEN-4821",
  "slug": "mama-sade-kitchen",
  "message": "Vendor successfully onboarded.",
  "qr_image_url": "/static/qr_codes/mama-sade-kitchen.png",
  "pairing_code": "8f3a9b21"
}
Logic after success:

If the form had telegram_chat_id filled → show "Already Linked" card, hide pairing code card.
If the form had telegram_chat_id blank → show the "Pairing Required" card with the pairing_code prominently.
Always show the QR code image from qr_image_url.