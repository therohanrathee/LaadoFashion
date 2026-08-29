# Simplification of Ordering Process into a Lead Generation Flow

Currently, the multi-step checkout (Add to Cart -> Cart View -> Checkout Form) is causing a high drop-off rate (71% bounce). To combat this, we will rip out the Cart functionality and replace it with a low-friction "Enquiry / Lead Generation" drawer. We will also introduce a simple Rate List page to allow users to quickly glance at pricing.

## Proposed Changes

### Database Changes
#### [NEW] `supabase/queries/15_create_leads_table.sql`
- Create a `leads` table with columns: `id`, `name`, `phone`, `requirements`, `interested_in` (text, optional, populated if they click on a specific product), `status` (default: 'new'), `created_at`.
- Enable RLS and add a policy allowing anonymous inserts and admin reads.

### Global State & UI Components
#### [MODIFY] `src/context/CartContext.tsx`
- Refactor (or rename) to an `EnquiryContext`. It will manage the state of the Enquiry Drawer (open/closed) and the specific item the user is currently looking at (`interestedItem`).
#### [MODIFY] `src/components/cart/CartDrawer.tsx` -> `src/components/ui/EnquiryDrawer.tsx`
- Replace the cart list with a simple, high-converting form:
  - Name (required)
  - Phone Number (required)
  - Requirements / Remarks (optional)
  - A button linking to the "Rate List" page.
- On submit, insert into the `leads` table and trigger a web push notification to Admins.
#### [MODIFY] `src/components/cart/AddToCartButton.tsx` -> `src/components/ui/EnquireButton.tsx`
- Change the button behavior: instead of adding to a cart array, it simply sets the `interestedItem` context and opens the Enquiry Drawer.
- Change the icon from a "+" or cart to an Arrow / "Book".
#### [MODIFY] `src/components/ui/SplitBookButton.tsx`
- Update behavior to open the Enquiry Drawer.

### New Pages & Navigation
#### [NEW] `src/app/rate-list/page.tsx`
- A clean, simple page displaying all catalog items (using `fetchCatalogItems`) in a dense, list-style format (small icon, name, price). 
- Include "Enquire Now" / "Shop Now" buttons that redirect back to the catalog or open the Enquiry Drawer.
#### [MODIFY] `src/components/home/Navbar.tsx`
- Add "Rate List" to the desktop header and the mobile hamburger menu.
#### [DELETE] `src/app/cart/`
- Delete the cart and checkout routing entirely.

### Admin Portal
#### [MODIFY] `src/app/dashboard/AdminPortal.tsx`
- Add a new tab/section alongside "Active Orders" specifically for "Leads / Enquiries".
- Display the leads in a simple table, allowing the admin to mark them as "Contacted".
#### [MODIFY] `src/app/actions/notify.ts`
- Add a `notifyAdminsNewLead` function to trigger background push notifications when a new lead comes in.

## Verification Plan
### Automated Tests
- Build verification via `npm run build`

### Manual Verification
- Verify the "Rate List" page renders cleanly on mobile and desktop.
- Verify clicking a product opens the Enquiry drawer.
- Submit a test lead, verify it enters the DB, and ensure a Push Notification is fired to the admin.
