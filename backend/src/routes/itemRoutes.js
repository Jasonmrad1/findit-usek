import { Router } from "express";
import { list, get, create, update, remove } from "../controllers/itemController.js";

export function itemRoutes(store) {
  const router = Router();
  router.get("/", (req, res) => list(store, req, res));
  router.get("/:id", (req, res) => get(store, req, res));
  router.post("/", (req, res) => create(store, req, res));
  router.put("/:id", (req, res) => update(store, req, res));
  router.delete("/:id", (req, res) => remove(store, req, res));
  return router;
}
