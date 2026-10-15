# FindIt USEK — Approved implementation plan

FindIt USEK is a premium campus lost-and-found React SPA with an intentionally small Express API. It satisfies the CSC457 two-page assignment: eight views, five HTTP CRUD operations, one in-memory entity, React Router, and Redux. The UI takes its navy, blue, white-space and Poppins direction from the supplied MyUSEK image. The selected homepage uses an editorial split hero. Contact emails and both photo URLs are optional. A single `returned` boolean represents resolution. Implementation is authorized by the user's instruction to implement the plan.

> Current scope: automated test suites, runner configuration, generated reports, and testing dependencies were removed at the user's request. Historical testing references below describe the original plan. Verification now uses build, lint, and manual review.

## 1. Requirements traceability

| Academic requirement | Implementation | Verification |
|---|---|---|
| Node.js/Express backend (20 points) | Separate Express web server | Manual live HTTP review |
| One entity, in-memory dataset | ItemReport array, reset on restart | CRUD lifecycle + fresh app tests |
| GET all/one | GET /items and /items/:id | Success, empty, absent/malformed ID tests |
| POST | POST /items | 201, generated numeric ID, retrieve |
| DELETE | DELETE /items/:id | 204 then 404 |
| PUT | PUT /items/:id | Full editable replacement |
| 5+ properties, differing types | 11 fields: number, strings, boolean | Validation tests |
| No database/auth/business logic | Structural validation and CRUD only | Dependency/source review |
| React SPA (80 points) | Vite + React | Client navigation + build |
| Home | / | E2E |
| About Us | /about | E2E |
| Contact Us | /contact | Form event/validation tests |
| Display all | /items | GET + cards |
| Display single | /items/:id | GET + details |
| Submit new | /items/new | POST from form |
| Delete existing | /items/:id/delete | Dedicated confirmation + DELETE |
| Update existing | /items/:id/edit | Shared form + PUT |
| Components, props, state | Reusable primitives/forms/cards, local interaction state | Component tests + defense |
| Important UI/UX | Poppins, blue/navy, responsive layouts | Visual + keyboard review |
| Contact event handling/validation | Controlled fields, onSubmit, errors, demo confirmation | Invalid/valid submissions |
| Entity views use API | Fetch service + async Redux thunks | Network + E2E |
| Research/use React Router | BrowserRouter, Routes, Link, NavLink | Direct URLs/refresh/back/forward |
| Research/use Redux | Toolkit slice, async lifecycle, selectors | State tests + UI consistency |

The PDF lists learning outcomes 1, 4, 5 without defining them. Do not invent extra criteria.

## 2. Boundaries and decisions

- React JavaScript/JSX, Vite, React Router declarative mode, Redux Toolkit/React-Redux, native fetch, CSS Modules, Lucide, locally bundled Poppins.
- Express + cors, ES modules, one ItemReport array. No database, persistence, accounts, authorization, messaging, email delivery, uploads, AI, maps, other resources, or deployment.
- Root npm workspaces (frontend/backend), root lockfile, shared pure model/validation module. Node 24 is the verified local runtime.
- Client-side search, filters, sorting, counts; URL parameters retain discovery state. Local state holds forms/previews/menu. Redux owns canonical fetched reports and request lifecycle.
- Screenshot file: `ChatGPT Image Oct 15, 2026, 03_41_03 PM.png`; the older filename in the brief is stale. This is an independent educational prototype.

## 3. Model and API

| Field | Type | Validation / purpose |
|---|---|---|
| id | number | Server-generated positive integer; immutable |
| title | string | Trimmed, 3–100; card/detail title |
| description | string | Trimmed, 10–2000; detail copy |
| category | enum string | Electronics, IDs & Documents, Keys, Bags, Books, Clothing & Accessories, Other |
| type | enum string | Lost or Found |
| location | string | Trimmed, 2–120; generic campus label, optional datalist suggestions |
| date | string | Real calendar YYYY-MM-DD; date-only formatting |
| returned | boolean | False by default on POST; derive Open/Returned labels |
| contactEmail | string | Optional empty or valid email <=254; public contact |
| imageUrl | string | Optional HTTP(S) URL or local /images path <=2048 |
| locationImageUrl | string | Same rules; independent location photo |

There are 10 editable properties plus id (11 total). Normalize optional empty strings; do not coerce incorrect JSON types. No duplicate status string or urgency flag.

Base URL http://localhost:3001. GET /items => 200 array. GET /items/:id => 200 object. POST /items => 201 object. PUT /items/:id => 200 object. DELETE /items/:id => 204 empty. Invalid input/ID => 400; absent ID => 404; unexpected failures => generic 500. Validation errors use `{message, errors: {field: message}}`; other errors use `{message}`. PUT sends the complete editable object. IDs increment from max seed ID + 1 and are never derived from array length. Ignore body IDs and whitelist fields. Handle malformed JSON. API never fetches external photos.

Example editable payload:

```json
{"title":"Black wireless earbuds","description":"Found in a closed case near the library entrance.","category":"Electronics","type":"Found","location":"Library entrance","date":"2026-10-15","returned":false,"contactEmail":"finder@example.com","imageUrl":"/images/earbuds.svg","locationImageUrl":""}
```

Responses add a server-generated id, e.g. 11. GET all wraps report objects in an array. DELETE has no JSON body.

Seed ten fictional reports, five Lost/five Found, two Returned; varied dates/categories/locations, example.com emails, eight item photos and three optional location photos. Include two missing-item-photo examples. Use local licensed illustrative photos and credits, never identifying documents.

## 4. Visual system

- Tokens: navy #1E3052; primary #0B437E; soft blue #B3C5D5; white; surface #F5F7FA; border #E4E8ED; text #202938; muted #64748B. These are inspired values, not official brand standards.
- Semantic badges: amber Lost, blue Found, green Returned; destructive red. Text and control contrast independently meet AA; color never stands alone.
- Poppins 400/500/600/700. Body 16/1.65; secondary 14/1.5; card title 20; section 28–36; page 32–44; fluid hero 36–60.
- Spacing 4/8/12/16/24/32/48/64/96. Controls radius 10, cards 16, feature panels 24. Container max 1200 with 16/24/32 gutters.
- Controls/touch targets >=44px. Cards have fixed 4:3 media, clear metadata, one semantic main link. Forms use visible labels/help/errors. Shadows and motion restrained; reduced motion honored.
- Below 640: one column, collapsed navigation, stacked actions; 640–1023: two-column grid; 1024+: split hero, three-column grid, split detail page. No overflow at 200% zoom.
- Semantic landmarks, skip link, route titles/focus, visible focus, accessible labels/errors/live regions and keyboard-operated menus. No copied official logo or implication of endorsement.

## 5. Page specification

- Home `/`: original wordmark/header; split hero “Lost something on campus?”, tagline, Browse/Report CTAs, curated item imagery; total/lost/found/returned counts from complete API data; three recent reports; three-step explanation; footer. Skeleton/error/retry/empty states; no invented counters. Lost/Found counts include returned; Returned is a subset.
- Explore `/items`: GET complete collection, search title/description/location; AND-combined type/category/status filters; newest/oldest date order, ID tie-break; result count/reset; URL params for committed state. Responsive cards, separate empty-data/no-results/error/loading states.
- Details `/items/:id`: GET individual, breadcrumb/title/badges, item photo, description/date/location, separate optional location photo with contextual caption, optional email mailto, no-contact explanation, Edit/Delete links, unverified-information notice; retry and missing/malformed ID states.
- Create `/items/new`: shared grouped form; required six core text/enum/date values; defaults Lost/today/returned false; category unselected; optional two URLs + inline preview; optional email/public warning/privacy reminder. POST valid payload, pending prevention, preserve on failure, success to detail; Cancel to Explore.
- Edit `/items/:id/edit`: fetch report, initialize shared form once, returned/resolved checkbox; full PUT, preserve edits on errors/rerenders; success/cancel to detail; no blank form for missing report.
- Delete `/items/:id/delete`: GET report, dedicated thumbnail/title confirmation, deliberate DELETE button and cancel, no deletion on load; pending/error/retry; success removes Redux entity and goes Explore; already-absent explanation.
- About `/about`: student need, approach, educational/independent status, in-memory/unrestricted-edit limitations, Browse/Report CTAs.
- Contact `/contact`: local controlled name/email/subject/message. Name 2–100, email <=254 valid, subject 3–120, message 10–2000. Blur/submit validation, linked error summary. Success exactly explains demo validation and that no message was sent. No backend endpoint.
- Unknown route: polished 404 with Home/Explore recovery; item 404 is contextual.

## 6. Components, folders, state

Root: package.json, lockfile, README, this plan, shared/itemReport.js, frontend/, backend/, e2e/.
Backend: src/app.js (fresh testable app), server.js, data/items.js, routes/itemRoutes.js, controllers/itemController.js, tests, .env.example.
Frontend: src/app/{store,router}, features/items/{itemsApi,itemsSlice,itemsSelectors}, components/{common,layout,items}, pages/, styles/{tokens,global}, main/App; public/images; tests; .env.example.

Composition: Provider > BrowserRouter > App > SiteHeader + RouteFeedback + main/PageContainer/route page + SiteFooter.
Reusable components: Button, Badge, Input/Select/TextArea/FieldError, ItemCard({item}), ItemGrid({items}), ItemPhoto({src,alt,variant}), ItemFilters({filters,onChange,onReset}), ItemForm({initialValues,mode,onSubmit,pending,error}), skeleton/empty/error/form feedback/StatCard. Pages fetch and coordinate; presentation components do not fetch. No unnecessary extra confirmation modal.

Redux uses createEntityAdapter canonical entities, collection lifecycle/completeness, per-ID read lifecycle, mutation pending/error. Thunks fetchItems/fetchItem/createItem/updateItem/deleteItem; successful reads upsert/replace, successful writes upsert/remove server results. Derive counts/recent/filtered lists; no duplicated arrays/counters. Never show complete counters from only a partial detail cache. Abort obsolete reads; protect mutations from stale read overwrites; avoid duplicate concurrent collection reads. Unwrap before navigation; never retry writes automatically.

Local component state owns forms/errors/touched/menu/photo fallback/Contact feedback. Router navigation state holds transient success feedback. No localStorage.

## 7. Photo policy

Both URLs optional. Card prefers item photo, then location photo explicitly labeled; detail keeps photo roles distinct. Validate syntax before preview, debounce changes, reset failure state on URL change. Broken URL shows local category fallback without error loops; warning does not block valid syntax. Fixed aspect ratio, lazy listing/secondary images, detail contain where needed, descriptive alt text, external no-referrer. No file picker/upload endpoint. Explain expiring URLs and third-party requests. Local seed photos and credits ensure dependable demonstration.

## 8. Phases and done gates

1. Plan: save approved document and preserve references. Done: plan recorded; user implementation authorization received.
2. Workspace: workspaces/dependencies/scripts/env examples. Frontend VITE_API_BASE_URL=http://localhost:3001; backend PORT=3001 and CLIENT_ORIGIN=http://localhost:5173. Done: dev starts both, build runs.
3. API: schema/validation/seeds/CRUD/errors/tests. Done: lifecycle/invalid/absent/reset tests pass.
4. Foundation: design tokens/fonts/layout/routes/primitives/Redux/fetch. Done: routes/shell work across sizes and keyboard.
5. Read: Home/Explore/Detail against API, filters/selectors/photos. Done: direct URLs, states, accurate counts verified.
6. Write: shared Create/Edit/Delete plus About/Contact. Done: eight views complete; CRUD state consistent; Contact honest.
7. Polish: spacing/contrast/imagery/focus/responsive 375/768/1024/1440 and zoom/reduced motion. Done: no material accessibility/layout gaps.
8. Acceptance: clean install, lint/unit/integration/build/E2E, README/checklist/defense guide. Done: actual results documented.

## 9. Verification, handoff and risks

API: GET empty/all/one; valid POST/PUT/DELETE lifecycle; monotonic IDs; malformed/absent IDs; required/enum/type/date/email/URL failures; optional empties; immutable ID; malformed JSON; fresh independent apps.
UI: shared validation/edit initialization/failure preservation; Contact invalid/valid; photo missing/broken/recovery; filters/count/date; Redux success/failure; loading/retry/no results. E2E uses real Express for full create/edit/resolve/delete, all views, direct URLs/refresh/Back/Forward, API outage/read-write recovery, duplicate prevention and Cancel. Manual keyboard, labels/live feedback, responsive/zoom/long content, reset, console/network.
Run npm ci, npm run lint, and npm run build. Review the relevant interactions manually. Do not claim unexecuted checks.

Deliver source, shared validators/tests, ten seed records, local photos/credits, env examples, README/run/API/reset instructions, academic checklist and short defense guide. Explain Router/Redux/component state and real HTTP flow.
Risks: optional email means absent contact; anyone can edit/delete; restart discards changes; remote photos fail/change; content unverified; branding unofficial. No deployment, analytics or operational services required.

## Research references

- https://reactrouter.com/start/declarative/installation
- https://redux.js.org/tutorials/quick-start
- https://vite.dev/guide/
- https://expressjs.com/en/5x/api/
