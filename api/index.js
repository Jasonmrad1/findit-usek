import { createApp } from "../backend/src/app.js";

const app = createApp();

export default function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const route = (url.searchParams.get("path") || "").replace(/^\/+/, "");
  url.searchParams.delete("path");
  req.url = `/${route}${url.search}`;
  return app(req, res);
}
