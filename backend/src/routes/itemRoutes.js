import { Router } from "express";
import * as itemController from "../controllers/itemController.js";

export function itemRoutes() {
  const router = Router();
  router.get("/", itemController.list);
  router.get("/:id", itemController.get);
  router.post("/", itemController.create);
  router.put("/:id", itemController.update);
  router.delete("/:id", itemController.remove);
  return router;
}
