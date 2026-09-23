import { desc, eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";

import { db } from "../db/client.js";
import { smallWins } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

export const smallWinsRouter = Router();

const createSmallWinSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(2000).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  winDate: z.iso.date().transform((value) => new Date(`${value}T00:00:00.000Z`)),
});

smallWinsRouter.use(requireAuth);

smallWinsRouter.post("/", async (request, response, next) => {
  const input = createSmallWinSchema.safeParse(request.body);
  if (!input.success) {
    response.status(400).json({
      success: false,
      message: "Invalid request",
      data: null,
      errors: input.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const [win] = await db
      .insert(smallWins)
      .values({ userId: response.locals.userId, ...input.data })
      .returning();

    response.status(201).json({
      success: true,
      message: "Small win created",
      data: win,
    });
  } catch (error) {
    next(error);
  }
});

smallWinsRouter.get("/", async (_request, response, next) => {
  try {
    const wins = await db
      .select()
      .from(smallWins)
      .where(eq(smallWins.userId, response.locals.userId))
      .orderBy(desc(smallWins.winDate), desc(smallWins.createdAt));

    response.json({
      success: true,
      message: "Small wins",
      data: wins,
    });
  } catch (error) {
    next(error);
  }
});
