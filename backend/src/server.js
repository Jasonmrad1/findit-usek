import { loadEnvFile } from "node:process";
import express from "express";
import cors from "cors";
import * as itemRouter from "./routes/itemRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

loadEnvFile();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use("/items", itemRouter.itemRoutes);
app.all("/{*splat}", (_req, res) =>
  res.status(404).json({ message: "Endpoint not found." }),
);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`FindIt API ready at http://localhost:${port}`),
);
