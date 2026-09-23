import cors from "cors";
import express from "express";
import { apiReference } from "@scalar/express-api-reference";

import { env } from "./config/env.js";
import { openApiDocument } from "./openapi.js";
import { authRouter } from "./routes/auth.js";
import { emotionalCheckInsRouter } from "./routes/emotional-check-ins.js";
import { mindEntriesRouter } from "./routes/mind-entries.js";
import { smallWinsRouter } from "./routes/small-wins.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));

app.get("/api/openapi.json", (_request, response) => response.json(openApiDocument));
app.use("/api/reference", apiReference({ url: "/api/openapi.json" }));

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    message: "UNFOLD API is healthy",
    data: null,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/emotional-check-ins", emotionalCheckInsRouter);
app.use("/api/mind-entries", mindEntriesRouter);
app.use("/api/small-wins", smallWinsRouter);

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
