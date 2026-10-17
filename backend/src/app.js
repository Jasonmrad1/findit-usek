import express from "express";
import cors from "cors";
import { itemRoutes } from "./routes/itemRoutes.js";
import { createSeedItems } from "./data/items.js";
import { createItemRepository } from "./db/itemRepository.js";
import { createItemService } from "./services/itemService.js";
import { itemController } from "./controllers/itemController.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp({ seed = createSeedItems() } = {}) {
  const app = express();
  const repository = createItemRepository(seed);
  const service = createItemService(repository);
  const controller = itemController(service);
  app.disable("x-powered-by");
  const allowed = [
    process.env.CLIENT_ORIGIN || "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];
  app.use(cors({ origin: allowed }));
  app.use(express.json({ limit: "32kb" }));
  app.use("/items", itemRoutes(controller));
  app.all("/{*splat}", (_req, res) =>
    res.status(404).json({ message: "Endpoint not found." }),
  );
  app.use(errorHandler);
  return app;
}
