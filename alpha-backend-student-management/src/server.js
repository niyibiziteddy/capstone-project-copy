import express from "express";
import "dotenv/config";
import { connectDatabase } from "./db/index.js";
import studentRoutes from "./routes/studentRoutes.js";
import globalErrorHandler from "./middleware/errorHandler.js";
import helmet from "helmet";
import cors from "cors";
import apiKeyAuth from "./middleware/apiKeyAuth.js";
import limiter from "./middleware/rateLimiter.js";

const app = express();

app.use(express.json());

const port = Number(process.env.PORT) || 3000;

app.use(helmet());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "API-Key"],
  }),
);

// Each client IP is limited to 100 requests per 15-minute window.
app.use("/api", limiter);

app.use("/api", apiKeyAuth);

// Reports that the server is running.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/students", studentRoutes);

app.use(globalErrorHandler);
try {
  await connectDatabase();
  console.log("PostgreSQL connected");
} catch (err) {
  console.error("PostgreSQL connection failed:", err.message);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
