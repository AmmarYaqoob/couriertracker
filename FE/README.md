# EELS Fleet Portal

Reconstructed source for the standalone EELS Fleet Portal. The original file is a single HTML document with an esbuild bundle (React 19, no source map). This project is that application split back into editable modules, with React loaded from npm.

The bundled React runtime is not included. The app imports `react` and `react-dom` from npm.

## Run

```bash
cd eels-fleet-portal
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Open the dev URL Vite prints (usually `http://localhost:5173`). Routing is hash-based (`#/dashboard`, `#/orders`, …).

## Demo sign-in

Every account uses the password `demo123`.

| Email | Role | Home |
| --- | --- | --- |
| executive@eels.de | Chief Executive | `#/dashboard` |
| admin@eels.de | Operations Admin | `#/admin` |
| shiftlead@eels.de | Shift Lead | `#/ops` |
| fleet@eels.de | Fleet Owner | `#/fleet` |
| hr@eels.de | HR Manager | `#/riders` |
| compliance@eels.de | Compliance Officer | `#/compliance` |
| payroll@eels.de | Payroll Admin | `#/payroll` |

The “Quick demo login” chips call `loginAs(role)` and skip the password.

## What the app is

Frankfurt last-mile pilot console (Uber Eats, Wolt, Lieferando). Data is simulated. The API defaults to an in-browser mock (`src/config.js`: `apiMode: "mock"`, `target: "artifact"`).

## Layout

| Path | Role |
| --- | --- |
| `src/main.jsx` | Mounts the app and restores `data-theme` from `localStorage` |
| `src/App.jsx` | Hash router, role redirects, inbox page |
| `src/pages/` | Screens. A few bundle modules contained two pages, so those stay in one file |
| `src/components/ui.jsx` | Shared UI and the shell |
| `src/components/icons.jsx` | Inline SVG icons |
| `src/auth/AuthProvider.jsx` | Demo users and session |
| `src/services/portalState.jsx` | Pilot model, simulated clock, ops store, i18n, navigation |
| `src/services/copilotEngine.js` | Offline Copilot answers and the end-of-day draft |
| `src/api/mockApi.jsx` | Mock `/api/v1` routes, webhook checks, API Hub UI |
| `src/hooks/index.js` | Re-exports of the recovered hooks |
| `src/styles/global.css` | CSS extracted from the original `<style>` block |

Shared pages (one original module each):

- `CapacityPage.jsx` also exports `CompliancePage`
- `DashboardPage.jsx` also exports `CopilotPage`
- `EconomicsPage.jsx` also exports `DocumentsPage`
- `PerformancePage.jsx` also exports `FleetPage`
- `ReportsPage.jsx` also exports `ResponsibilitiesPage`

## Button and form traces

### Sign in

`LoginPage` form `onSubmit` → `preventDefault` → `useAuth().login(email, password)`.

`login` looks up `DEMO_USERS` by email (trim, case-insensitive). The password must equal `demo123`. Success stores the user and writes `{ email }` to `localStorage` key `eels_auth_v1`. Failure sets the error flag and shows “Email or password is not correct…”.

`AppRoutes` then sends an authenticated user away from `#/login` to `HOME_BY_ROLE[role]`, and sends an anonymous user to `#/login`. A route the role cannot open also redirects home. `/riders/:id` is allowed when the riders list is allowed.

### Ops Copilot “Ask”

Chat form `onSubmit` → `preventDefault` → send handler in `CopilotChat`.

The handler appends the user message and a “Thinking…” bubble, then calls `_2` in `copilotEngine.js` with the recent messages, a JSON snapshot from `A2`, and an offline fallback (`j2`, or `bn` when the text matches `/report|bericht/i`).

Because `config.target` is `"artifact"`, `_2` tries `window.claude.use("sample")` first. In this Vite app that object is absent, so the offline engine answers and the bubble is replaced with `{ text, engine: "Offline engine" }`. The `/api/copilot` Netlify path only runs when `target` is not `"artifact"`. Stop aborts the `AbortController` and the bubble becomes “Stopped.”

### API Hub “Validate and import”

Button `onClick` → `callApi("POST", "/imports/{partner}/report", { body: csv })`.

`callApi` (`src/api/mockApi.jsx`) waits ~60–150ms, matches the route in `API_ROUTES`, and runs that handler. The import handler requires `order_id`, `courier_id`, `status`, and `promised_at`. The result (`status`, `data`, `ms`, `mode`) is stored in component state and rendered in the Result card. “Load file” only reads a local CSV into the textarea; it does not upload.

### API explorer “Send”

Builds path, query, and body from the selected `API_ROUTES` entry, rejects a non-JSON body with a local 400, then `callApi(method, path, { query, body, headers })` and shows the same result shape.

### Webhook simulator

“Send” signs or tampers the sample payload, then `callApi("POST", "/webhooks/{platform}", …)`. Uber-style events check HMAC SHA-256 (`demo-uber-signing-key`). Wolt-style events check an HS256 JWT (`demo-wolt-client-secret`). Nothing leaves the browser in mock mode.

## What could not be reconstructed exactly

The HTML had no source map. esbuild had already renamed locals and inlined every module into one scope. Behavior was recovered from that output; original file names and most inner variable names were not in the bundle.

- Parameters and locals inside functions often stay short (`t`, `e`, `a`). The minifier deleted the original names, so they were not guessed.
- Icon components in `src/components/icons.jsx` keep those short names. They are inline SVGs (Lucide-style paths). Renaming them without a source map would risk pointing a nav icon at the wrong glyph.
- Some helpers in `portalState.jsx`, `mockApi.jsx`, and the page files keep short names for the same reason. Page components, shell, auth, stores, router, and the mock client use readable names where the role was clear from strings and call sites.
- Several nav items render their key (`delayCauses`, `prepTime`, `hex`, `inbox`, and others). Those keys are missing from the English/German dictionary in the original bundle as well. The lookup falls back to the key. That was not filled in.
- Sign-in, routing, the shared store, and the basic UI components are ordinary React. Page and calculation files still use short local names recovered from the bundle. Those names were not in the original source, so they were left in place rather than guessed.
- Claude-in-claude.ai and the Netlify `/api/copilot` function are not part of this repo. With `target: "artifact"` the Copilot uses the offline engine unless `window.claude` exists.
- Switching `apiMode` to `"http"` makes `callApi` fetch `${apiBaseUrl}/api/v1...`. No backend is included.
