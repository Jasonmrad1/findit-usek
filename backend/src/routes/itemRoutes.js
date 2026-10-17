import { Router } from "express";
import * as itemController from "../controllers/itemController.js";

export function itemRoutes(store) {
  const router = Router();
  router.get("/", (req, res) => itemController.list(store, req, res));
  router.get("/:id", (req, res) => itemController.get(store, req, res));
  router.post("/", (req, res) => itemController.create(store, req, res));
  router.put("/:id", (req, res) => itemController.update(store, req, res));
  router.delete("/:id", (req, res) => itemController.remove(store, req, res));
  return router;
}
