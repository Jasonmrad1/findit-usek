# FindIt USEK — Complete Project Context & Planning Brief

> **Instructions for Sol (or another implementation-focused AI):** Read this document **and** the attached `CSC457_Project 1.pdf` and MyUSEK screenshot before making decisions. Your **first deliverable is a concrete, actionable implementation plan**, not code. After presenting the plan, follow the user's instruction about whether to proceed with implementation. If operating autonomously in a coding workspace with authorization to build, execute the plan in small verifiable phases, keeping the project's scope minimal.

## 1. Project at a glance

| Field | Decision |
|---|---|
| Project name | **FindIt USEK** |
| Tagline | **Lost on campus. Found together.** |
| Course | CSC457 — Mobile App Development, Project 1 |
| Institution | Holy Spirit University of Kaslik (USEK), Lebanon |
| Product | Campus-themed lost-and-found reporting and browsing site |
| Frontend | **React SPA**, React Router, **Redux**, reusable components, props and state |
| Backend | **Node.js + Express**, five REST CRUD routes, **in-memory data only** |
| Primary entity | `ItemReport` (one entity type) |
| Images | Item photo URL, optional photo URL of location where found/lost; **no server-side upload** |
| Theme | Match the provided **MyUSEK screenshot**: navy/blue, white/light gray, **Poppins** |
| Design ambition | Exceptional, premium-quality UI/UX without adding technical complexity |
| Intended users | USEK students; academic prototype, not an official university service |

### Product problem and value

USEK students can misplace IDs, chargers, wallets, keys, headphones, books and other personal belongings. The user reports that their university **does not currently have a dedicated lost-and-found platform**. Reports can be scattered across informal conversations or groups. FindIt USEK centralizes simple **lost** and **found** listings and gives students a way to browse and locate a contact for a report. Do not claim an officially verified campus-wide absence of such a service or affiliation with USEK; describe this as a **student-identified need** and an **independent educational prototype**.

### User's priorities

1. Satisfy **every requirement from the attached professor's PDF**; do not silently add or drop requirements.
2. Standout visual design and polished experience; frontend contributes **80/100 points**.
3. Keep functionality a **small, understandable CRUD app**, not a larger startup architecture.
4. Clean, **modular** React architecture that can be demonstrated and defended in class.
5. A genuinely useful campus-specific concept with photographs and easy discovery.
6. Poppins typeface and **MyUSEK's screenshot** as visual inspiration — **NOT** the burgundy palette proposed earlier in conversation.

---

## 2. Non-negotiable assignment requirements (from CSC457 PDF)

The attached `CSC457_Project 1.pdf` (2 pages) is the **authoritative** source if any wording in this brief conflicts with it.

### Backend — 20 points

- Web server in **Node.js/Express** exposing a Web API managing **one entity type** of choice.
- CRUD on an **in-memory dataset** with routes equivalent to:
  - `GET /items` — all reports
  - `GET /items/:id` — one report
  - `POST /items` — create report
  - `DELETE /items/:id` — delete report
  - `PUT /items/:id` — update report
- Entity has **at least five properties of different data types**. Explicitly include number, string and boolean fields.
- **No database logic, authentication, authorization, or business logic**. Bare-bones CRUD API.

### Frontend — 80 points

- **React Single Page Application**, connected to the backend using HTTP requests.
- Required **eight views**: Home, About Us, Contact Us, Display All Entities, Display Single Entity, Submit New Entity, Delete Existing Entity, Update Existing Entity.
- Meaningful use of **React components, props and states**.
- UI/UX look and feel explicitly emphasized.
- **Contact Us** includes a **form with event handling and input validation**.
- Entity views actually use the Express API; not frontend-only fake CRUD.
- **React Router** for navigation between views.
- **Redux** for managing and centralizing application state. Prefer Redux Toolkit as a modern Redux implementation.

### Scope boundary

DO NOT add a database, persistence service, Firebase, Supabase, authentication, authorization, OAuth, roles, admin system, real email delivery, messaging, cloud photo storage, AI matching, map integrations, payment systems, or extra backend entities. Filtering, search, sorting and status counters are **frontend-only calculations over existing reports**, not an additional backend business layer.

**Expected limitation:** In-memory reports reset on server restart. Explain that honestly in the README and demo. Without user accounts, the prototype cannot enforce who is allowed to edit/delete a report. Do not imply otherwise.

---

## 3. Product functionality and content

A visitor should be able to:

1. **Explore** all lost/found reports and view clear images.
2. **Search/filter** by lost/found, category, return status, or text (client-side).
3. **Open** a report for description, last-seen/found campus location, date, item photo and optional place photo.
4. **Create** a lost or found report with a validated form.
5. **Edit** a report, including marking an item returned/resolved.
6. **Delete** a report only after deliberate confirmation.
7. Visit **About** and **Contact** pages.

**Do not** implement item matching algorithms, submissions by email, claiming/ownership validation or any claim of automatic reunification. Item details may show a fictional/demo contact email; use clear privacy language: do not publish sensitive identifiers or photos of personal IDs and do not advertise any verification mechanism that has not been implemented.

### One-entity data model

Proposed shape (refine naming once, then be consistent everywhere):

```js
{
  id: 1,                            // number
  title: "Black wireless earbuds", // string
  description: "Found near the library entrance.",
  category: "Electronics",         // string enum
  type: "Found",                   // "Lost" | "Found"
  location: "Library entrance",    // campus location string
  date: "2026-10-15",              // ISO date string
  status: "Open",                  // "Open" | "Returned"
  contactEmail: "demo@example.com",
  imageUrl: "/images/earbuds.jpg",// main item photo URL, optional
  locationImageUrl: "",            // optional photo of place where found/lost
  isUrgent: false                  // optional boolean; or prefer `returned: false`
}
```

**Model normalization note:** Avoid redundant contradictory fields (e.g., `status` AND `returned` as independent sources of truth). Keep **one** return-status representation. To demonstrate heterogeneous types, include a useful boolean such as `hasDistinctiveMarkings` or use `returned` boolean **instead of** status string and derive the display status. Choose the simplest coherent data model in your plan and explain the choice. Keep at least five properties with number/string/boolean represented.

Suggested categories: Electronics, IDs & Documents, Keys, Bags, Books, Clothing & Accessories, Other. Keep locations grounded in verified or generic labels such as Library, Main Entrance, Cafeteria, Parking, Other; do not invent official USEK facility names.

### Photos: critical product detail

The user specifically wants photographs **of the item and/or the place it was found**. Provide:

- `imageUrl` for the item photograph.
- `locationImageUrl` for an optional location photograph.
- A thumbnail on listing cards and prominent photo on detail page; optional secondary photo with distinct caption ("Where it was found" / "Last seen here").
- URL field with inline preview in create/edit forms.
- Polished fallback state for no image or broken URL, without endless error loops.
- **No actual file upload** / cloud storage / binary upload API. Explain URL-only limitation clearly to user.
- Seed 8–12 realistic demo records with safe illustrative images and dummy contact emails. Prefer project-local illustrative image assets when feasible; external URLs may fail, so provide fallbacks.

---

## 4. Routing: all eight required views

| Route | View | Main behavior |
|---|---|---|
| `/` | Home | Hero, product explanation, summary counts, recent reports, CTA |
| `/about` | About Us | Problem, approach, how it works, prototype disclaimer |
| `/contact` | Contact Us | Local demo contact form with validation and accessible success feedback |
| `/items` | Display All | Fetch and display all reports; client-side search, filters and sort |
| `/items/:id` | Display Single | Fetch/view details, photos, and edit/delete actions |
| `/items/new` | Submit New | Form uses `POST /items` |
| `/items/:id/edit` | Update | Reuse same form, populated data, uses `PUT /items/:id` |
| `/items/:id/delete` | Delete | Dedicated confirmation view; calls `DELETE /items/:id` on confirmation |

Add a polished 404 page as a helpful extra (not counted among eight). Important: declare `/items/new` before dynamic `/items/:id` routes or otherwise ensure correct matching.

**Contact behavior:** Assignment only mandates validation/event handling, not an email backend. Validate locally, then display a clearly labeled **demo confirmation**, never a false assertion that an email was sent.

---

## 5. Branding / MyUSEK visual reference

**User-supplied screenshot filename:** `image(20261015-123013).png`. The user provided a screenshot of MyUSEK and explicitly said: **“these colors for the USEK theme and Poppins font.”** Use the actual screenshot as the primary design reference. If the screenshot is unavailable to the coding agent, ask for it rather than claiming to have inspected it.

Visual traits observed in screenshot:

- White primary background with very subtle hairline separators.
- Prominent **dark navy** and **deep institutional blue** headings and wordmark.
- Black/charcoal body copy.
- Pale/desaturated blue supporting illustration fills and occasional restrained red accents.
- Spacious sections, readable proportions, simple horizontal navigation.
- **Poppins font** for all application UI, with 400/500/600/700 weights (300 optional).

### Provisional design tokens — screenshot-inspired, **not official verified brand HEX**

```css
:root {
  --color-navy: #1E3052;
  --color-primary: #0B437E;
  --color-blue-soft: #B3C5D5;
  --color-background: #FFFFFF;
  --color-surface: #F5F7FA;
  --color-border: #E4E8ED;
  --color-text: #202938;
  --color-muted: #64748B;
  --font-family: 'Poppins', sans-serif;
}
```

Treat these as **starting values**, tune against the screenshot using visual judgment; do not describe them as USEK's official standards. Avoid burgundy as the primary branding color. Reserve restrained semantic accent colors for readable badges: e.g., amber for Lost, blue for Found, green for Returned, red for destructive action; ensure contrast.

### Artistic direction

Create a **premium modern university service** — a product that belongs visually near MyUSEK but isn't a copy or an official-site impersonation. Clean editorial hierarchy, well-spaced grids, elegant forms, intentional iconography, tasteful shadows/borders, refined image treatment and strong interaction feedback. Do not default to stock admin dashboard templates, heavy gradients/glassmorphism, massive blobby decorations or animation for its own sake. Use original FindIt wordmark treatment; if using official USEK marks requires permissions or licensed assets, prefer descriptive text/USEK-inspired color palette without falsely implying endorsement.

**Quality bar:** Homepage should immediately communicate "Lost something on campus?" and provide dominant **Browse Items** / **Report an Item** CTAs. Explore page and report detail page should look like polished consumer-facing products rather than homework forms. Tailor desktop/tablet/mobile layouts instead of simply shrinking the desktop UI.

---

## 6. UX and component specification

### Home

- Header with FindIt USEK brand, Explore, About, Contact and primary Report CTA.
- Bold and human "Lost something on campus?" hero with concise supporting statement.
- Clear primary/secondary CTAs, a subtle campus-related illustration or item imagery (not mandatory if it delays functionality).
- Stats based on Redux item data: total/lost/found/returned.
- Most recent reports (from in-memory dataset) as visually excellent cards.
- Three-step "How it works" and thoughtful footer with prototype disclaimer.

### Explore

- Search input, Lost/Found controls, category/status filter, date sort — all local.
- Responsive image-first cards showing title, type, location, date, status.
- Empty, no-results, loading, API-error and retry states.

### Details

- Primary item photo, optional distinct location photo, category/type/status, description, date/location, dummy contact info, edit/delete actions.
- Important warning: a photo and report are user-provided claims, **not verified ownership**.

### Create/Edit

- Reuse a single `ItemForm` component and validation functions.
- Required: title, description, category, type, location, date; validate URL/email only when present or requested.
- Optional item/location photo links and previews.
- Input labels, visible errors, sensible focus management and pending-submission state.
- On successful API operation, navigate to details/list with feedback; on failure, preserve entered values.

### Delete

- Dedicated confirmation route, clear irreversible-action explanation for this session, cancel and destructive confirm.
- Do not perform delete on page load; handle 404 and API failure.

### About/Contact

- About explains real student need and the nonofficial prototype scope.
- Contact validates full name, email, subject, message locally; no backend messages entity; no false delivered claim.

### Reusable components

`SiteHeader`, `SiteFooter`, `PageContainer`, `Button`, `Badge`, `Input`, `Select`, `TextArea`, `FieldError`, `ItemCard`, `ItemGrid`, `ItemForm`, `ItemPhoto`, `ItemFilters`, `StatCard`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `ConfirmDialog` (only if useful), `FormFeedback`, `NotFound`.

Accessibility: semantic HTML, keyboard support, visible focus, sufficient contrast, descriptive alt text, form labels and errors, accessible status feedback, reduced-motion support. Thoughtful responsive breakpoints, no horizontal overflow.

---

## 7. Technical architecture — small and modular

### Recommended stack

- Frontend: Vite + React (JavaScript/JSX), React Router, Redux Toolkit, native CSS/CSS Modules (select one lightweight styling approach), optional `lucide-react`, native `fetch` or Axios (choose one).
- Backend: Node.js + Express, `cors` as appropriate, `express.json()`.
- No database and no third-party hosted runtime dependencies.
- API base URL via environment variable (`VITE_API_BASE_URL`) and one small API service module.
- Keep front-end forms in component state; Redux for shared items/fetching lifecycle, async operations, loading/error and updates. Use `createAsyncThunk` or a similarly simple Redux Toolkit approach. Avoid Redux solely in name.

### Suggested directory tree

```text
findit-usek/
  backend/
    src/
      app.js
      data/items.js
      routes/itemRoutes.js
      controllers/itemController.js
    package.json
  frontend/
    public/images/
    src/
      app/store.js
      app/router.jsx
      features/items/itemsSlice.js
      features/items/itemsApi.js
      components/common/
      components/layout/
      components/items/
      pages/
        HomePage.jsx
        AboutPage.jsx
        ContactPage.jsx
        ItemsPage.jsx
        ItemDetailsPage.jsx
        CreateItemPage.jsx
        EditItemPage.jsx
        DeleteItemPage.jsx
        NotFoundPage.jsx
      styles/tokens.css
      styles/global.css
      App.jsx
      main.jsx
    .env.example
    package.json
  README.md
```

Do not build an extra layer just because the directory tree shows folders. Choose cohesive reusable components, avoid giant page components but also avoid unnecessary abstractions.

### Backend API behavior

- `GET /items`: `200` array
- `GET /items/:id`: `200` object, or `404` when absent
- `POST /items`: `201` created object, or `400` invalid input
- `PUT /items/:id`: `200` updated object, `400` invalid input, `404` absent ID
- `DELETE /items/:id`: `204` or `200` consistently, `404` absent ID

Use simple predictable ID allocation and basic validation, no persistence. Backend should contain **data management only**, not contact delivery, verification, auto-matching or specialized business rules.

---

## 8. Quality, testing and constraints

### Must test, not merely claim

- All five API routes: success and absent ID; invalid fields; create/update/delete lifecycle.
- All eight required views navigate and render correctly.
- Router direct URLs and unknown routes.
- Redux state updates accurately after real HTTP CRUD.
- Contact form validation + explicitly demo success state.
- Image previews, broken/missing image fallback.
- Filter/search and counts calculated on real fetched items.
- Request pending/error/retry UI; preserve form on error.
- Mobile/tablet/desktop layout and accessibility basics.
- Frontend and backend start from a clean install, no console warnings/errors where avoidable.

### Explicit exclusions

**No** authentication, authorization, database, persistence, notifications, real email, messaging/chat, map/GPS, AI, ownership verification, file uploads, additional REST resources, admin panel or multiple entity types. No scope creep from a visually impressive design.

### Honest prototype constraints

- In-memory changes disappear on backend restart.
- Item images are URL references, not uploaded or permanently stored by FindIt.
- Contact page is demonstrative and does not transmit mail.
- Anyone with access to prototype CRUD routes could modify data; do not claim secured ownership controls.
- USEK branding is inspired by the screenshot; not official endorsement.

---

## 9. Your immediate task: create the implementation PLAN

**Do this first, before writing code.** Generate a clear plan as a practical working document, not vague advice. Include all of the following:

1. **Requirements traceability matrix**: every original PDF requirement; map to route/component/API behavior and planned verification. Separate mandatory from optional enhancements.
2. **Brief concept and MVP boundaries**: one entity, eight required views, no extra backend features. Identify out-of-scope ideas explicitly.
3. **Final ItemReport schema**: name, type, validation rule and UI usage of each property; choose one coherent return-status representation; ensure 5+ properties and multiple data types.
4. **API contract**: five methods/paths, example JSON request/response, error codes, ID behavior, in-memory seed dataset details.
5. **Page-by-page specification**: layout, content, interactive elements, validation, API requests, navigation, loading/errors/empty states.
6. **Design system**: provisional MyUSEK-inspired color tokens, Poppins typography scale, spacing, radii, responsive breakpoints, card/button/form standards, accessibility.
7. **Component tree and folder structure**: responsibilities, props, composition and shared form logic.
8. **State/data-flow design**: when to use Redux vs local React state, async thunks, how CRUD updates the UI; avoid redundant sources of truth.
9. **Photo strategy**: item + optional location photo URLs and robust fallbacks, with no actual upload service.
10. **Implementation milestones**: dependencies/commands, back-end, API testing, frontend foundation, pages, polish, integration, acceptance testing. Define concrete "done" conditions for each phase.
11. **Test/QA plan**: manual click-through and API check scenarios covering all eight views, five routes, accessibility, mobile and failure cases.
12. **Risk and trade-off notes**: image URLs, contact privacy, no auth, no persistence, unverified affiliation, external assets.
13. **Final deliverables**: source files, README, run instructions, `.env.example`, seeded records, assignment checklist, and brief explanation suitable for course defense.

### Planning response format

Start with a 5–8 sentence executive summary; then a compact requirements checklist and phased actionable plan. Make decisions rather than listing endless alternatives. Where genuinely uncertain, note a sensible default, not a blocker. **Do not start implementation in the first response unless the user additionally instructs you to implement immediately.** When implementing later, finish a phase, execute checks, and report actual results before moving to the next.

### Definition of success

A visually distinctive, fast, responsive **FindIt USEK** student prototype, faithfully reflecting the supplied MyUSEK navy/blue + Poppins direction, **all** CSC457 PDF requirements satisfied, two photo URL options, real React→Express CRUD, Redux + React Router genuinely used, **no database or auth**, and code simple enough to explain comfortably in an academic demonstration.
