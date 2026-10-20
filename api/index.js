import express from "express";
import cors from "cors";
import * as itemRouter from "../backend/src/routes/itemRoutes.js";
import { errorHandler } from "../backend/src/middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use(["/api/items", "/items"], itemRouter.itemRoutes);
app.all("/{*splat}", (_req, res) =>
  res.status(404).json({ message: "Endpoint not found." }),
);
app.use(errorHandler);

export default app;
