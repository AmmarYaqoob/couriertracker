# Delivery API

Standalone Node, Express, and TypeScript API. MongoDB is accessed with Mongoose.

Sequelize is not included. It only supports SQL databases (PostgreSQL, MySQL, MariaDB, SQLite, SQL Server) and cannot connect to MongoDB.

## Run

```bash
cd BE
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `MONGODB_URI` if MongoDB is not on `mongodb://127.0.0.1:27017/delivery`.

Health check: `GET http://localhost:4000/api/health`

On an empty database the server seeds the seven portal demo users. Their password is `demo123`. New accounts created through sign-up need a password of at least 8 characters. Login accepts the password stored on the account, including `demo123`.

Every response uses the same JSON shape:

```json
{
  "httpStatus": 200,
  "isSuccess": true,
  "message": "Signed in",
  "data": {}
}
```

Failures set `isSuccess` to `false` and `data` to `null`, except health, which still includes the database state.

## Auth

Send the session token as `Authorization: Bearer <token>`. Logout requires that header. Sessions last `SESSION_TTL_HOURS` (default 168).

| Method | Path | Body |
| --- | --- | --- |
| POST | `/api/auth/sign` | `{ name, email, password, role, active? }` |
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | Bearer token |

Sign and login return `data: { token, expiresAt, user }`.

## Users

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/users/roles` | Role catalog |
| GET | `/api/users` | List users (`role`, `search`, `active`) |
| GET | `/api/users/:id` | One user |
| POST | `/api/users` | Create `{ name, email, password, role, active? }` |
| PATCH | `/api/users/:id` | Update name, email, password, role, or active |
| DELETE | `/api/users/:id` | Remove a user |

Roles: `executive`, `admin`, `shift_lead`, `fleet_manager`, `hr`, `compliance`, `payroll`.

## Riders

The list matches the Riders screen: summary cards stay on the full pilot, and `search` plus `employment` filter the table. `employment=Student` is the Working Student filter. Detail includes contract, today, documents, payroll, the mini-job limit, compliance items, and the 28-day assessment.

Compliance, documents, and payroll are calculated from the rider record using the portal rules for pilot day `2026-09-16`. An empty database seeds 19 riders, including the rows visible on the screen and one example of each status and compliance case.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/riders/catalog` | Employment filters, zones, platforms, vehicles, activities |
| GET | `/api/riders` | Summary cards and rider rows |
| GET | `/api/riders/:id` | Full rider, all tabs |
| GET | `/api/riders/:id/documents` | Document checklist |
| GET | `/api/riders/:id/payroll` | Payroll months and mini-job limit |
| GET | `/api/riders/:id/compliance` | Score and open items |
| GET | `/api/riders/:id/performance` | 28-day assessment |
| POST | `/api/riders` | Create a rider |
| PATCH | `/api/riders/:id` | Update a rider |
| DELETE | `/api/riders/:id` | Remove a rider |

Create requires `name`, `employmentType`, `homeZoneId`, `platform`, `vehicle.type`, `shiftStart`, and `shiftEnd`. Other fields use the same defaults as the portal.

## Orders

The list matches Order Dispatch at pilot time `2026-09-16T22:14:00`. Summary cards stay on the full set. `status` and `platform` filter the table. An empty database seeds the frontend pilot snapshot: 623 orders, with card counts 31 / 12 / 587 / 24.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/orders` | Summary and rows (`status=active\|done\|cancelled`, `platform`) |
| GET | `/api/orders/:id` | One order |

`status` defaults to `active`. `platform` is `uber_eats`, `wolt`, `lieferando`, or `all`.

## Reference data

Platforms, zones, restaurants, and employment types each have their own collection, copied from the frontend. An empty collection is seeded on startup.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/platforms` | 3 platforms |
| GET | `/api/zones` | 8 zones |
| GET | `/api/restaurants` | 35 restaurants |
| GET | `/api/employment-types` | 5 employment types |

## Layout

| Path | Role |
| --- | --- |
| `src/index.ts` | Connects to MongoDB, seeds users, riders, orders, and reference data, starts the server |
| `src/services/rider.service.ts` | Rider list, detail, and portal rules |
| `src/services/order.service.ts` | Order list, detail, and dispatch summary |
| `src/app.ts` | Express app |
| `src/container.ts` | Wires repository, service, and controller |
| `src/domain/` | Roles, users, and rider rules |
| `src/repositories/` | `UserRepository` and the MongoDB implementation |
| `src/services/user.service.ts` | User management rules |
| `src/services/auth.service.ts` | Sign-up, login, and logout |
| `src/models/` | User and session schemas |
| `src/http/apiResponse.ts` | Shared response envelope |
| `src/routes/` | HTTP routes |
| `src/middleware/` | Async errors, 404, and error handling |
