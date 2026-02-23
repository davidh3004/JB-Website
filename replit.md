# JB Websites - Marketing Site + Admin Portal

## Overview
A production-ready marketing website and admin portal for JB Websites, a web agency that builds custom-coded websites for local businesses.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui (wouter routing)
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Session-based with bcryptjs password hashing
- **File Uploads**: Multer (local storage in /uploads)

## Project Structure
- `client/src/pages/` - Public pages (Home, Services, Portfolio, About, Contact)
- `client/src/pages/admin/` - Admin pages (Login, Dashboard, Projects, Settings, Leads, Square)
- `client/src/components/` - Shared components (Navbar, Footer, AdminLayout)
- `server/` - Express backend (routes, storage, db, seed)
- `shared/schema.ts` - Drizzle schemas + Zod validation

## Key Features
- **Public Site**: Home with hero + services + portfolio, Services page, Portfolio with filters, About, Contact form
- **Admin Portal**: Auth-protected dashboard, Project CRUD with image upload, Site Settings CMS, Lead management with CSV export, Square payment settings
- **Database Models**: Users, Projects, ProjectImages, SiteSettings, Leads, SquareSettings

## Admin Access
- Default admin: admin@jbwebsites.com / admin123
- Login at /admin/login

## Design
- Clean white + blue (#2563EB) accent + slate text
- Inter font, rounded cards, soft shadows
- Mobile-responsive with hamburger menu

## Running
- `npm run dev` starts Express + Vite dev server on port 5000
- `npm run db:push` syncs database schema
