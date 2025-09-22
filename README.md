# Red Planet Staffing

Welcome to the red planet! At just over one million people as of the 2050 census, Martian settlements are flourishing. As the leading staffing marketplace on Mars, Red Planet connects workplaces with workers to fill shifts.

![Red Planet Staffing](./assets/red-planet.webp)

## Business context

Our primary customers are Martian workplaces. While they have full-time staff, they occasionally need short-term flexible staff to fill gaps in their operations (for example, when a worker is sick or on a vacation to the Moon).

When they need a worker, workplaces post a "shift" on our marketplace. Workers on our marketplace then claim these shifts and are assigned to them. Once assigned, workers perform the work at the shift's start time until it's end time, and are paid based on the hours worked.

## Documentation

- [Server](./server/README.md)
- [Client](./client/README.md)

## Quickstart

- Install deps: `npm run setup`
- Dev server: `cd server && npm run start:dev` (API on `http://localhost:3000`)
- Dev client: `cd client && npm run start:dev` (UI on `http://localhost:5000`, `/api` proxy enabled)

## Top Workplaces (Script)

Compute the top 3 workplaces by completed shifts (cancelled excluded). This script reads the local SQLite DB via Prisma and prints JSON to stdout.

- Seed/reset DB (optional): `cd server && npx prisma migrate reset`
- Run: `cd server && npm run start:topWorkplaces`
- Example output:

```
[
  { "name": "Sun Phosphate Software", "shifts": 10 },
  { "name": "Radiant Power Inc", "shifts": 8 },
  { "name": "Phobos Studies", "shifts": 6 }
]
```

Use this output for reporting or to verify your environment is set up correctly.

## Deployment

To deploy:
1. Push your branch to GitHub: `git push origin HEAD`
2. Set up your server (Node.js, Prisma, PostgreSQL/SQLite)
3. Install dependencies and run migrations:
   - `npm install`
   - `npx prisma migrate deploy`
4. Start the server: `npm run start:prod`
