# Laado Fashion & Boutique - Whitepaper

## Overview
This document serves as the single source of truth for the project's state, architecture, database schemas, and current progress. It is designed to be easily analyzed by another AI to continue development from any point.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS v4 (with full system-native Dark Mode support).
- **Animations**: Framer Motion (dynamic vector thread unweaving animation mapped 1:1 with scroll height).
- **Backend & Auth**: Supabase (PostgreSQL, Supabase Auth via Passwords for staff).
- **State Management**: Zustand / React Context.
- **Color Palette**: Rani Pink (`#E91E63`) as primary brand accent. Deep Onyx and Charcoal themes for Dark Mode.

## System Architecture
The platform is an ERP and E-commerce system serving 4 roles:
1. **Customer**: Books orders completely anonymously (geolocation captured). Tracking is entirely unauthenticated via an Order ID (tracking link sent to email).
2. **Admin**: Manages pricing, SKUs, employees, and overrides orders. Logs in via Password.
3. **Runner**: Receives geographically clustered tasks to pick up/deliver orders and collect manual Cash/UPI payments. Logs in via Password.
4. **Tailor**: Views assigned stitching tasks and customer details. Logs in via Password.

## Geographic Clustering
- Instead of using a mapping API to convert addresses, the web app requests HTML5 Geolocation (Latitude/Longitude) permission from the Customer when placing an order. 
- Runners are assigned tasks based on K-Means clustering of these exact coordinates.

## Database Schema (Supabase)
The database uses PostgreSQL with the following core tables:
1. `profiles`: Extends `auth.users` with `full_name`, `phone`, `role` (customer, admin, runner, tailor), and `active` status.
2. `catalog_items`: Dynamic storefront catalog (`name`, `category`, `base_price`, `is_active`).
3. `addons`: Add-on options linked to catalog items (`name`, `price`, `is_active`).
4. `promo_codes`: Global discount rules (`code`, `discount_type`, `discount_amount`, `min_order_amount`, `one_time_per_user`, `is_active`).
5. `orders`: Tracks the entire order lifecycle (`status`, `cart_items` as JSONB, `customer_name`, `discount_applied`, `total_amount`), geocoordinates, and assigned runner/tailor.
6. `bulk_orders`: Stores contact form submissions for bulk tailoring and gifting (`name`, `contact_info`, `details`, `status`).

## Dynamic Catalog & Checkout Math
The system originally used hardcoded pricing files, but is now fully dynamic:
- **Catalog**: Storefront fetches `catalog_items` dynamically. Items can be marked inactive via the Admin UI, causing them to show "Not available currently" (or "Out of stock" for Juttis) instead of disappearing.
- **Promo Rules**: Validated at checkout via Server Actions, dynamically adjusting fixed, percentage, free visit, or free delivery modifiers, enforcing `one_time_per_user` limits on `customer_id`.
- **Checkout Ledger**: Free orders (₹1000+) record `visit_charge` (0) and `delivery_charge` (0). Standard orders record the charges. The final total offsets them dynamically to maintain correct financial ledgers in the DB.

### Manual Query Log
All Supabase SQL queries are documented for manual execution in the Supabase SQL Editor.
- **Ongoing query log**: `supabase/queries/` directory containing chronologically numbered SQL files. The latest migration is `10_remove_obsolete_order_columns.sql`.

## Current State
- [x] Next.js Project Initialization & UI Design
- [x] Database Schema Design & SQL migrations
- [x] Architecture Pivot (Removed Customer Auth, unified Employee Login)
- [x] Cloudflare / Resend Email Action infrastructure
- [x] Storefront UI (Dynamic Catalog, Cross-sells, Blinkit-style Addons)
- [x] Advanced Checkout Flow (Geo-location, Promo Validation, Financial Math)
- [x] Full Admin Dashboard (Visual Order Cards, Catalog CRUD, Promos CRUD, Staff assignments)
- [x] Bulk Orders Contact Form, Email Notification & DB persistence
- [x] Complete System-Native Dark Mode UI Overhaul across all pages
- [ ] Runner Portal & Geographic K-Means clustering algorithm logic
- [ ] Tailor Portal Implementation
- [ ] SMS / Order status notification trigger
