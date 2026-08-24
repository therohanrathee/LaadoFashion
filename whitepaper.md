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
1. `profiles`: Extends `auth.users` with `full_name`, `phone`, `role` (customer, admin, runner, tailor), and `active` status.
2. `catalog_items`: Available garments for stitching (`name`, `base_price`, `image_url`).
3. `addons`: Add-on options linked to catalog items (`name`, `price`).
4. `orders`: Tracks the order lifecycle with statuses (`pending_measurement`, `in_stitching`, etc.), geocoordinates, total cost, and assigned runner/tailor.
5. `order_addons`: Junction table linking orders to selected add-ons.
6. `task_logs`: Audit log for employee actions (runner/tailor) to facilitate billing.

### Manual Query Log
All Supabase SQL queries are documented for manual execution in the Supabase SQL Editor.
- **Initial schema**: `supabase/migrations/01_initial_schema.sql` (Legacy, executed)
- **Ongoing query log**: `supabase/queries/` directory containing chronologically numbered SQL files (e.g. `02_fix_auth_trigger...sql`)

## Current State
- [x] Initial Requirements Gathering
- [x] Tech Stack Finalization
- [x] Next.js Project Initialization
- [x] Database Schema Design
- [x] Authentication Setup (Staff only via Passwords; Customers track via Order ID)
- [x] Homepage & Frictionless Order Flow (Updated to 6-step flow)
- [x] Unauthenticated Tracking Portal
- [x] Runner Portal & Geographic Clustering
- [ ] Admin & Tailor Portal Implementations
