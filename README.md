# UNFOLD backend

Initial backend foundation for the UNFOLD MVP.

## Requirements

- Node.js 22+
- PostgreSQL
- pnpm

## Run locally

1. Copy `.env.example` to `.env` and update `DATABASE_URL`.
2. Install dependencies with `pnpm install`.
3. Start the development server with `pnpm dev`.
4. Open `http://localhost:3001/api/health`.

## Current scope

This first milestone only includes the Express/TypeScript scaffold, validated environment configuration, a Drizzle database client, and a health endpoint. Authentication and product features are intentionally deferred.
