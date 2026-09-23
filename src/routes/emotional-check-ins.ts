import { desc, eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";

import { db } from "../db/client.js";
import { emotionalCheckIns } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

export const emotionalCheckInsRouter = Router();

const createCheckInSchema = z.object({
  emotion: z.enum([
    "happy",
    "calm",
    "anxious",
    "tired",
    "sad",
    "empty",
    "angry",
    "overwhelmed",
  ]),
  intensity: z.number().int().min(1).max(5),
  triggerNote: z.string().trim().min(1).max(1000).optional(),
});

emotionalCheckInsRouter.use(requireAuth);

emotionalCheckInsRouter.post("/", async (request, response, next) => {
  const input = createCheckInSchema.safeParse(request.body);
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
    const [checkIn] = await db
      .insert(emotionalCheckIns)
      .values({ userId: response.locals.userId, ...input.data })
      .returning();

    response.status(201).json({
      success: true,
      message: "Emotional check-in created",
      data: checkIn,
    });
  } catch (error) {
    next(error);
  }
});

emotionalCheckInsRouter.get("/", async (_request, response, next) => {
  try {
    const checkIns = await db
      .select()
      .from(emotionalCheckIns)
      .where(eq(emotionalCheckIns.userId, response.locals.userId))
      .orderBy(desc(emotionalCheckIns.createdAt));

    response.json({
      success: true,
      message: "Emotional check-ins",
      data: checkIns,
    });
  } catch (error) {
    next(error);
  }
});
