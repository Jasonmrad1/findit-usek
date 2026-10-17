import express from "express";
import cors from "cors";
import * as itemRouter from "./routes/itemRoutes.js";
import * as itemData from "./data/items.js";
import * as itemRepository from "./db/itemRepository.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp({ seed = itemData.createSeedItems() } = {}) {
  const app = express();
  const store = itemRepository.createItemStore(seed);
  app.use(cors());
  app.use(express.json({ limit: "32kb" }));
  app.use("/items", itemRouter.itemRoutes(store));
  app.all("/{*splat}", (_req, res) =>
    res.status(404).json({ message: "Endpoint not found." }),
  );
  app.use(errorHandler);
  return app;
}
