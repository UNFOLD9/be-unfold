import express from "express";

export const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    message: "UNFOLD API is healthy",
    data: null,
  });
});
