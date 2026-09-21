import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    message: "UNFOLD API is healthy",
    data: null,
  });
});

app.use("/api/auth", authRouter);

app.use((_request, response) => {
  response.status(404).json({ success: false, message: "Route not found", data: null });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const invalidJson = error instanceof SyntaxError && "status" in error && error.status === 400;
  if (!invalidJson) console.error(error);
  response.status(invalidJson ? 400 : 500).json({
    success: false,
    message: invalidJson ? "Invalid JSON" : "Unexpected server error",
    data: null,
  });
});
