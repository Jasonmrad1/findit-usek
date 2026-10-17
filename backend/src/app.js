import express from "express";
import cors from "cors";
import { itemRoutes } from "./routes/itemRoutes.js";
import { createSeedItems } from "./data/items.js";
import { createItemStore } from "./db/itemRepository.js";
import { itemController } from "./controllers/itemController.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp({ seed = createSeedItems() } = {}) {
  const app = express();
  const store = createItemStore(seed);
  const controller = itemController(store);
  app.use(cors());
  app.use(express.json({ limit: "32kb" }));
  app.use("/items", itemRoutes(controller));
  app.all("/{*splat}", (_req, res) =>
    res.status(404).json({ message: "Endpoint not found." }),
  );
  app.use(errorHandler);
  return app;
}
