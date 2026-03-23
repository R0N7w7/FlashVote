# FlashVote

FlashVote is a real-time polling platform built with ASP.NET Core on the backend and React on the frontend.

It provides:
- Poll creation and retrieval through REST endpoints.
- Real-time vote updates through SignalR.
- Live chart visualization in the web dashboard.

## Architecture Overview

FlashVote is organized as a two-app monorepo:
- FlashVoteBackend: ASP.NET Core Web API, SignalR hub, EF Core, SQLite.
- FlashVoteFrontend: React + Vite app with React Query, SignalR client, Tailwind, and Recharts.

High-level flow:

1. Frontend fetches polls using HTTP.
2. Frontend joins a SignalR group for the active poll.
3. User votes through an HTTP endpoint.
4. Backend persists vote and broadcasts ReceiveVote to the poll group.
5. Frontend invalidates query cache and re-fetches updated poll results.

## Tech Stack

Backend:
- ASP.NET Core (.NET 10)
- Entity Framework Core
- SQLite
- SignalR

Frontend:
- React 19 + TypeScript
- Vite
- TanStack React Query
- @microsoft/signalr
- Recharts
- TailwindCSS
- shadcn-style UI components

## Repository Structure

- FlashVoteBackend
	- Controllers: REST endpoints
	- Services: business logic
	- Repositories: persistence abstraction
	- Hubs: SignalR hub
	- Data: EF DbContext
	- Models: entities and DTOs
- FlashVoteFrontend
	- src/services: HTTP and SignalR clients
	- src/hooks: React Query and realtime hooks
	- src/components: dashboard and UI components

## Runtime Ports and URLs

Default local endpoints:
- Backend API: http://localhost:5000
- SignalR hub: http://localhost:5000/pollhub
- Frontend dev server: http://localhost:5173

Current backend host binding is 0.0.0.0:5000.

## Prerequisites

- .NET SDK 10
- Node.js 20+
- npm 10+

## Getting Started

### 1. Run Backend

From FlashVoteBackend:

```bash
dotnet restore
dotnet build
dotnet run
```

Development OpenAPI/Swagger:
- http://localhost:5000/openapi/v1.json
- http://localhost:5000/swagger

### 2. Run Frontend

From FlashVoteFrontend:

```bash
npm install
npm run dev
```

Open the URL shown by Vite (typically http://localhost:5173).

## Frontend Configuration

The frontend reads backend base URL from:
- VITE_API_BASE_URL

Example FlashVoteFrontend/.env:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If not defined, frontend falls back to the default value in the HTTP client.

## API Reference

Base route:
- /api/poll

Endpoints:
- GET /api/poll
	- Returns all polls (summary list).
- GET /api/poll/{id}
	- Returns one poll with options and vote counts.
- POST /api/poll
	- Creates a poll from CreatePollDto.
- POST /api/poll/{pollId}/vote/{optionId}
	- Registers a vote and returns success status.

## SignalR Contract

Hub endpoint:
- /pollhub

Hub methods:
- JoinPoll(string pollId)
- LeavePoll(string pollId)

Server-to-client event:
- ReceiveVote(optionId)

## Data Model Summary

Poll:
- Id: Guid
- Title: string
- Description: string
- CreatedAt: DateTime
- ExpiresAt: DateTime?
- IsClosed: bool
- Options: List<Option>

Option:
- Id: Guid
- Text: string
- VoteCount: int
- PollId: Guid

## CORS and Security Notes

Current backend CORS policy allows any origin with credentials for development convenience.

Important:
- This is not recommended for production.
- In production, restrict origins explicitly and enforce HTTPS.

## Operational Guide

Useful backend commands:

```bash
dotnet build
dotnet watch run
dotnet ef database update
```

Useful frontend commands:

```bash
npm run lint
npm run build
npm run preview
```

## Testing the Realtime Behavior

Manual validation flow:

1. Start backend.
2. Start frontend.
3. Open the app in two browser tabs.
4. Select the same poll in both tabs.
5. Vote in tab A.
6. Confirm charts and vote counts refresh in tab B without reload.

## Troubleshooting

### CORS errors

- Confirm backend is running on the expected host/port.
- Confirm VITE_API_BASE_URL points to the active backend.

### No realtime updates

- Confirm frontend connects to /pollhub.
- Confirm active poll triggers JoinPoll.
- Confirm vote endpoint returns success.

### Build warnings about bundle size

- Recharts and SignalR increase bundle size.
- Consider route-based code splitting for optimization.

## Current Feature Scope

Implemented:
- Real-time poll visualization dashboard.
- Vote submission from frontend.
- SignalR-driven synchronization.
- Tailwind + shadcn-style UI foundation.

Not implemented yet:
- Authentication/authorization.
- Full poll admin workflow in frontend.
- Automated end-to-end test suite.
