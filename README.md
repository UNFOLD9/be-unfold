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
- npm

## Setup

Install dependencies:

```bash
npm install
```

Copy the environment file and update its values:

```bash
cp .env.example .env
```

Apply database migrations:

```bash
npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:3001` by default.

## Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | HTTP server port |
| `DATABASE_URL` | PostgreSQL connection URL |
| `CLIENT_ORIGIN` | Comma-separated frontend origins allowed by CORS |
| `JWT_SECRET` | Secret used to sign authentication tokens |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with file watching |
| `npm run build` | Compile TypeScript |
| `npm start` | Run the compiled server |
| `npm test` | Run tests |
| `npm run typecheck` | Check TypeScript types |
| `npm run db:generate` | Generate a Drizzle migration |
| `npm run db:migrate` | Apply database migrations |

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API status |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Get the authenticated user |
