# FE

React 19, Vite, JSX. This app stays JavaScript. Hash routing is in `src/services/portalState.jsx`. `src/config.js` is still `apiMode: "mock"`.

## Layout

- `pages` — one screen per file
- `components/ui.jsx` — shared UI
- `components/icons.jsx` — icons
- `auth/AuthProvider.jsx` — session
- `api/mockApi.jsx` — mock data while API mode is mock
- `styles/global.css` — global styles

## UI

- Functional components only.
- Keep calculations out of large JSX blocks.
- If a value can be derived from props or state, do not copy it into another `useState`.
- Reuse `Button`, `Card`, `Field`, and the other exports in `components/ui.jsx`.

## Do not

- Add Redux, Zustand, a new router, or a component library.
- Convert files to TypeScript as part of an unrelated change.
- Rename the short identifiers left from the original bundle unless you are editing that function.
- Put secrets in client code.
