# FindIt USEK

**Lost on campus. Found together.** A responsive campus lost-and-found platform for CSC457 Project 1: React + React Router + Redux Toolkit, connected through HTTP to a Node.js/Express in-memory CRUD API.

This is an independent educational prototype, inspired by the supplied MyUSEK reference. It is not an official USEK service.

## Run locally

Prerequisites: **Node.js 24 LTS** and npm 11. From `C:\CS\React`:

```powershell
npm ci
npm run dev
```

- Frontend: http://127.0.0.1:5173
- API: http://localhost:3001/items
- Press Ctrl+C to stop both applications.

The defaults work without environment files. To customize them, copy `frontend/.env.example` to `frontend/.env` and `backend/.env.example` to `backend/.env`. Vite reads `VITE_API_BASE_URL` (defaults to `/api`, proxied to the local API); the API reads `PORT`. Restart after changing configuration. The API allows requests from all origins through `cors()`.

Use `npm run dev:frontend` and `npm run dev:backend` for separate terminals. `npm run build` writes the production SPA into `frontend/dist`. To inspect that build locally, run `npm run start -w backend` in one terminal and `npm run preview -w frontend` in another. Vite serves direct SPA URLs in development and preview; any future static host must rewrite application routes to `index.html`.

## Open on your phone

Run `npm run dev`, connect your phone and computer to the same Wi-Fi, and open the Network URL printed by Vite. The frontend listens on the local network and sends `/api` requests through Vite to the backend on port 3001. Keep both processes running. If port 5173 is already occupied, run `npm run dev -w frontend -- --port 5174` with the backend running. If Windows asks, allow Node.js on private networks.

## What is included

- Fourteen fictional lost/found items, including two returned items.
- Home with live counters and recent items; Explore with text search, combined filters, URL state, and date sorting.
- Item details; shared validated Create/Edit form; dedicated Delete confirmation.
- Optional public email; item and location photo URLs with previews and safe fallbacks.
- About and a validated **local demonstration** Contact form.
- Poppins fonts bundled locally, user-supplied USEK photos and logo, real stock item and location photography, responsive navy/blue styling, semantic controls and keyboard focus handling.
- Loading, empty, no-results, error, retry, missing-item and unknown-route states.

## Routes and academic checklist

| Required view | Route | Operation |
|---|---|---|
| Home | `/` | Collection GET for live counts/recent items |
| About Us | `/about` | Purpose and prototype limitations |
| Contact Us | `/contact` | Event handling, local validation and honest demo confirmation |
| Display all | `/items` | `GET /items` |
| Display single | `/items/:id` | `GET /items/:id` |
| Submit new | `/items/new` | `POST /items` |
| Update existing | `/items/:id/edit` | GET + `PUT /items/:id` |
| Delete existing | `/items/:id/delete` | GET + deliberate `DELETE /items/:id` |

Backend (20 points): Express server, one entity type, in-memory array, all five REST routes, more than five properties using number/string/boolean, no database/auth/business workflow. Frontend (80 points): React SPA, reusable components/props/state, responsive UI/UX, Contact validation/event handling, actual API requests, React Router and centralized Redux state. The PDF lists learning outcomes 1, 4, 5 without further definitions. See `IMPLEMENTATION_PLAN.md` for the full requirement mapping.

## Architecture

The visual refinement uses the supplied campus panorama for the homepage hero and the courtyard photograph for the community story, About, and Contact. The header/footer use the provided USEK logo alongside the service name; there is no custom application icon. Homepage search opens the existing Explore view with its query in the URL. The Explore card/filter layout and item breadcrumbs retain their established behavior. See `ASSET_CREDITS.md` for the supplied file mapping.

```text
frontend/src/
  app/              Store and route definitions
  features/items/   Fetch wrapper, async thunks, canonical Redux entities, selectors, read hooks
  components/       Shared UI, layout, item cards/photos/filters/form
  pages/            Eight required views plus 404
  styles/           Global design tokens and base styles
backend/src/
  app.js            Composes middleware and item routes
  server.js         Starts the local HTTP server
  data/             Fictional seed items
  routes/           Five item REST endpoints
  controllers/      HTTP requests, responses and status codes
  services/         Item validation, ID checks and not-found handling
  db/               In-memory repository, CRUD storage and ID generation
  middleware/       Centralized API error responses
  errors/           Structured service errors
shared/             Pure model constants and validation
e2e/                Real API browser acceptance tests
```

### State and data flow

1. A route page dispatches a Redux Toolkit async thunk.
2. The central fetch service sends an HTTP request to Express.
3. Express validates and reads/changes its array, returning JSON.
4. Fulfilled reducers reconcile the returned object with canonical Redux entities.
5. Selectors derive counts, recent items and filtered lists. Components receive items through props.

Form values, errors, previews, menu state and Contact feedback belong in local React state. Explore filters belong in URL search parameters. Reads track request IDs; successful mutations advance a revision so earlier reads cannot overwrite saved changes. A partial detail cache never supplies complete collection statistics. No localStorage is used.

Backend flow: routes ? controllers ? services ? repository. The service validates item input and resolves missing/invalid IDs; the controller only translates HTTP requests and responses. The repository owns one shared in-memory array and monotonic ID counter per server process, and returns copies. Seed fixtures stay in `data/`. Express error middleware preserves structured validation errors and handles malformed JSON. Storage remains in memory as required by the assignment; this is not a persistent database.

## Item and API

An Item has **11 properties**: numeric immutable `id`; strings `title`, `description`, `category`, `type`, `location`, `date`, `contactEmail`, `imageUrl`, `locationImageUrl`; and boolean `returned`. Open/Returned is derived from that one boolean.

Title: 3–100 characters; description: 10–2000; location: 2–120; category/type: allowed enums; date: real `YYYY-MM-DD` calendar date. Email and both photos are optional strings. Email is syntax-validated, not ownership-verified. Image values allow absolute HTTP(S) URLs or project-local `/images/…` paths. These fields reference images and never upload files. Dates are displayed as calendar dates without timezone shifting.

| Endpoint | Success | Other responses |
|---|---|---|
| `GET /items` | 200 array | 500 |
| `GET /items/:id` | 200 object | 400 malformed ID, 404 absent |
| `POST /items` | 201 created object | 400 invalid body |
| `PUT /items/:id` | 200 updated object | 400 invalid ID/body, 404 absent |
| `DELETE /items/:id` | 204 no body | 400 invalid ID, 404 absent |

POST defaults omitted optional strings to `""` and omitted `returned` to `false`. PUT requires every required editable field including the boolean; it is a full update rather than a partial patch. Body IDs and unknown properties are ignored. IDs increment independently of array length and are not reused within a server session. JSON bodies are capped at 32 KB (413 when exceeded). Errors use `{ "message": "…", "errors": { "field": "…" } }`, with field errors only for validation.

Example request, usable in PowerShell:

```powershell
$item = @{
  title = 'Blue lecture notebook'
  description = 'A blue notebook with a silver sticker on the front cover.'
  category = 'Books'
  type = 'Lost'
  location = 'Library'
  date = '2026-10-15'
  returned = $false
  contactEmail = ''
  imageUrl = '/images/notebook.svg'
  locationImageUrl = ''
} | ConvertTo-Json

$created = Invoke-RestMethod http://localhost:3001/items -Method Post -ContentType 'application/json' -Body $item
Invoke-RestMethod "http://localhost:3001/items/$($created.id)"
```

## Build and lint

```powershell
npm run lint
npm run build
```

Automated test suites and their dependencies have been removed from this project.

## Demonstration and course defense

1. Open Home and explain that counts derive from fetched items, not hardcoded numbers.
2. Explore, search for earbuds, apply filters, and open an item. Show the HTTP GET in browser developer tools.
3. Create an item with optional photos/email, edit it, and mark it returned. Show POST/PUT and Redux state changes.
4. Open the dedicated delete page, cancel once, then confirm deletion. Show DELETE and the updated list.
5. Submit Contact with empty fields, then valid values. Explain that validation is local and **no email is sent**.
6. Explain component props (`ItemCard`), local state (`ItemForm`), centralized state (items slice), routing, and shared pure validation.
7. Restart the API and show the original fourteen records. Explain the deliberate assignment constraint: memory only.

## Honest prototype limitations

- Items reset on backend restart. There is no database or persistence.
- There are no accounts or authorization; anyone with access can edit/delete items.
- Contact validates locally and sends/stores nothing. Optional public item email is the only contact method.
- Items, photos and ownership claims are unverified. Never publish personal ID photos or sensitive identifiers.
- Seed items use real Pexels stock photos, including location reference photos; they do not depict verified USEK items or finding locations. See `ASSET_CREDITS.md`. External photo URLs work but may expire, fail or cause requests to third-party hosts.
- Seed emails use reserved `example.com` addresses and do not represent real students.
- Styling is MyUSEK-inspired, not an official brand specification or endorsement.
- No deployment, messaging, uploads, claims verification, maps, or matching service is included.

Research sources: [React Router](https://reactrouter.com/start/declarative/installation), [Redux Toolkit/React-Redux](https://redux.js.org/tutorials/quick-start), [Vite](https://vite.dev/guide/), [Express](https://expressjs.com/en/5x/api/).
