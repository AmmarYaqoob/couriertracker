# BE

Node, Express, TypeScript, Mongoose. Start at `src/index.ts`. Routes mount under `/api` in `src/routes/index.ts`. Wiring is in `src/container.ts`.

## Layout

- `routes` — path and method only
- `controllers` — read the request, call a service, send the response
- `services` — business rules
- `repositories` — database access (interface plus `mongo*` implementation)
- `models` — Mongoose schemas
- `domain` — types and pure functions, no Mongo
- `middleware` — auth, async handler, errors

## API

- Reply with `sendSuccess` / `sendFailure`: `{ httpStatus, isSuccess, message, data }`.
- Throw `AppError` for expected failures.
- Validate bodies in the existing `*Input.ts` helpers.

## Data

- Store a fact once. Link records by id.
- Copy a name or rate only as a snapshot of a closed record, such as an approved payroll line.
- Do not add a second collection for data that already sits on the parent document.

## Do not

- Add another database library.
- Put business logic in route files.
- Log passwords, tokens, or connection strings.
