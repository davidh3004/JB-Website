# JB Websites - Marketing Site + Admin Portal + CRM

## Overview
A production-ready marketing website, admin portal, and internal CRM for JB Websites, a web agency that builds custom-coded websites for local businesses.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui (wouter routing)
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Session-based with bcryptjs password hashing + RBAC (admin/caller/editor roles)
- **File Uploads**: Multer (local storage in /uploads)

## Project Structure
- `client/src/pages/` - Public pages (Home, Services, Portfolio, About, Contact)
- `client/src/pages/admin/` - Admin pages (Login, Dashboard, Projects, Settings, Leads, Square)
- `client/src/pages/crm/` - CRM pages (Dashboard, Leads, Lead Detail, Search, Admin Users, Admin Audit)
- `client/src/components/` - Shared components (Navbar, Footer, AdminLayout, CrmLayout)
- `server/` - Express backend (routes, storage, db, seed)
- `shared/schema.ts` - Drizzle schemas + Zod validation

## Key Features
- **Public Site**: Home with hero + services + portfolio, Services page, Portfolio with filters, About, Contact form
- **Admin Portal**: Auth-protected dashboard, Project CRUD with image upload, Site Settings CMS, Lead management with CSV export, Square payment settings
- **CRM System**: Role-based access (admin sees all, caller sees own data), Lead management with create/edit/filter/search, Call logging with outcome tracking, Search history, User management (admin), Audit log (admin), Lead reassignment (admin)
- **Database Models**: Users, Projects, ProjectImages, SiteSettings, Leads, Calls, Searches, AuditEvents, SquareSettings

## Admin/CRM Access
- Default admin: admin@jbwebsites.com / admin123
- Login at /admin/login
- CRM accessible at /app (after login)
- Roles: admin (full access), caller (own data only), editor (site content)

## CRM API Routes
- `GET/POST /api/crm/leads` - List/create leads (scoped by role)
- `GET/PATCH /api/crm/leads/:id` - Get/update single lead
- `GET/POST /api/crm/calls` - List/log calls
- `GET/POST /api/crm/searches` - List/create searches
- `GET/POST /api/crm/admin/users` - User management (admin only)
- `PATCH /api/crm/admin/users/:id` - Update user (admin only)
- `POST /api/crm/admin/reassign` - Reassign lead (admin only)
- `GET /api/crm/admin/audit` - Audit log (admin only)

## Design
- Clean white + blue (#2563EB) accent + slate text
- Inter font, rounded cards, soft shadows
- Mobile-responsive with hamburger menu

## Running
- `npm run dev` starts Express + Vite dev server on port 5000
- `npm run db:push` syncs database schema
