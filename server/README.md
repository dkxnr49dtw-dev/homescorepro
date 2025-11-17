# HomeScorePro Backend Server

Backend API server for HomeScorePro application.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Set up database:
   - Install PostgreSQL
   - Create database: `createdb homescorepro`
   - Run schema: `psql homescorepro < database/schema.sql`

4. Start server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/properties/*` - Property CRUD
- `/api/suburbs/*` - Suburb data
- `/api/payments/*` - Payment processing
- `/api/subscriptions/*` - Subscription management
- `/api/contact` - Contact form
- `/webhooks/stripe` - Stripe webhooks

## Development

- Server runs on port 3000 by default
- Frontend should run on port 8000 (or update CORS in `.env`)


