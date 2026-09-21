# UNFOLD Backend

REST API for the UNFOLD application.

## Tech stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- Zod

## Prerequisites

- Node.js 22 or newer
- PostgreSQL
- pnpm

## Setup

Install dependencies:

```bash
pnpm install
```

Copy the environment file and update its values:

```bash
cp .env.example .env
```

Apply database migrations:

```bash
pnpm db:migrate
```

Start the development server:

```bash
pnpm dev
```

The API runs at `http://localhost:3001` by default.

## Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | HTTP server port |
| `DATABASE_URL` | PostgreSQL connection URL |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS |
| `JWT_SECRET` | Secret used to sign authentication tokens |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with file watching |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Run the compiled server |
| `pnpm test` | Run tests |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm db:generate` | Generate a Drizzle migration |
| `pnpm db:migrate` | Apply database migrations |

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API status |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Get the authenticated user |
