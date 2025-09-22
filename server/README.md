<h1 align="center">Red Planet Staffing Server</h1>

This is the server application for Red Planet Staffing, the leading staffing marketplace on Mars. Built with NestJS and Prisma, it provides a robust API for managing workers, workplaces, and shifts.

## Technologies

- TypeScript
- NestJS
- Prisma

## Getting Started

### Setup

```bash
# Install dependencies
npm install

# Create and migrate the database, and then apply seed data located at `./prisma/seed`
npx prisma migrate dev --name init

# Drop and re-seed the database
npx prisma migrate reset

# Start the server in watch mode with hot-reloading
npm run start:dev
```

## Top Workplaces Script

Compute the top 3 workplaces by completed shifts (cancelled excluded). The script queries the local SQLite database directly via Prisma and prints JSON to stdout.

```bash
# Optional: reset and seed the DB
npx prisma migrate reset

# Run the script (outputs JSON)
npm run start:topWorkplaces
```

Example output:

```
[
  { "name": "Sun Phosphate Software", "shifts": 10 },
  { "name": "Radiant Power Inc", "shifts": 8 },
  { "name": "Phobos Studies", "shifts": 6 }
]
```

## API Reference

### Workers

- `POST /workers`: Create a worker
  - Body: `createWorkerSchema`
- `GET /workers/:id`: Get worker by ID
  - Params: `:id` - Worker ID
- `GET /workers`: List all workers
- `GET /workers/claims`: Get worker claims
  - Query: `workerId` - Worker ID

### Workplaces

- `POST /workplaces`: Create a workplace
  - Body: `createWorkplaceSchema`
- `GET /workplaces/:id`: Get workplace by ID
  - Params: `:id` - Workplace ID
- `GET /workplaces`: List all workplaces

### Shifts

- `POST /shifts`: Create a shift
  - Body: `createShiftSchema`
- `GET /shifts/:id`: Get shift by ID
  - Params: `:id` - Shift ID
- `POST /shifts/:id/claim`: Claim a shift
  - Params: `:id` - Shift ID
  - Body: `workerId` - Worker ID
- `POST /shifts/:id/cancel`: Cancel a claimed shift
  - Params: `:id` - Shift ID
- `GET /shifts`: List all shifts
