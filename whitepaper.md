# Laado Fashion & Boutique - Whitepaper

## Overview
This document serves as the single source of truth for the project's state, architecture, database schemas, and current progress. It is designed to be easily analyzed by another AI to continue development from any point.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Animations**: Framer Motion (dynamic vector thread unweaving animation mapped 1:1 with scroll height).
- **Backend & Auth**: Supabase (PostgreSQL, Supabase Auth via Passwords for staff).
- **State Management**: Zustand / React Context.
- **Color Palette**: Rani Pink (`#E91E63`) as primary brand accent.

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
1. `profiles`: Extends `auth.users` with `full_name`, `phone`, `role` (customer, admin, runner, tailor).
2. `promo_codes`: Manages dynamic discounting (fixed, percentage, free delivery/visit) with expiry and usage limits.
3. `orders`: The core transactional table. Supports a **Global Cart System**. Stores a `cart_items` JSONB array of all items and selected addons. Also stores comprehensive checkout data: `customer_name`, `delivery_address`, `location_lat`, `location_lng`, `subtotal`, `visit_charge`, `delivery_charge`, `promo_code_id`, and `total_amount`. Tracks order lifecycle statuses (`pending_measurement`, `in_stitching`, etc.) and assigned runner/tailor.
4. `bulk_orders`: Captures lead generation data from the B2B contact form.

### Manual Query Log
All Supabase SQL queries are documented for manual execution in the Supabase SQL Editor.
- **Ongoing query log**: `supabase/queries/` directory containing chronologically numbered SQL files. The latest migration is `10_remove_obsolete_order_columns.sql`.

## Current State
- [x] Initial Requirements Gathering & Tech Stack
- [x] Database Schema Design
- [x] Authentication Setup (Staff only via Passwords; Customers track via Order ID)
- [x] Homepage & Global Cart System (Architecture shifted from 6-step wizard to a standard persistent E-Commerce Cart with Add-ons).
- [x] Unauthenticated Tracking Portal
- [ ] Runner Portal & Geographic Clustering
- [ ] Admin & Tailor Portal Implementations
