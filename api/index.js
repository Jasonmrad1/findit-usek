import { createApp } from "../backend/src/app.js";

// Keep the original URL and query string so Express handles /api/items and IDs.
// One app per warm function instance preserves the existing seeded demo store.
export default createApp();
