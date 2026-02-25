# Specification

## Summary
**Goal:** Audit and fix all broken functionality in the Kartik Cosmetic app — including the cart, order placement, backend Motoko functions, and frontend React Query hooks — so the app works end-to-end.

**Planned changes:**
- Fix the backend Motoko actor so `getAllProducts`, `getProductById`, `addToCart`, `removeFromCart`, `getCart`, `placeOrder`, and `getOrderHistory` all return correct data without trapping or silently failing.
- Ensure stable storage works correctly across canister upgrades.
- Fix frontend React Query hooks in `useQueries.ts` so all backend calls are correctly wired, loading/error states are handled, and queries are properly invalidated after mutations (add to cart, remove from cart, place order).
- Fix the cart page to correctly display items, update quantities, remove items, and calculate totals.
- Fix the order placement flow so placing an order shows a confirmation, clears the cart, and records the order in order history.
- Ensure anonymous users can browse products without errors; if cart/order features require login, show a clear prompt instead of a blank or broken state.
- Ensure the Internet Identity login flow completes without errors and correctly scopes cart and order history to the logged-in user's principal.

**User-visible outcome:** Users can browse products, add items to the cart, adjust quantities, place orders, and view order history without encountering errors or blank states. Anonymous users see a clear login prompt when required, and authenticated users have full access to cart and order functionality.
