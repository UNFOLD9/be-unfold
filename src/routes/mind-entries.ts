import { desc, eq } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";

import { db } from "../db/client.js";
import { mindEntries } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

export const mindEntriesRouter = Router();

const createMindEntrySchema = z.object({
  content: z.string().trim().min(1).max(10_000),
  isSaved: z.boolean().optional(),
});

mindEntriesRouter.use(requireAuth);

mindEntriesRouter.post("/", async (request, response, next) => {
  const input = createMindEntrySchema.safeParse(request.body);
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
    const [entry] = await db
      .insert(mindEntries)
      .values({ userId: response.locals.userId, ...input.data })
      .returning();

    response.status(201).json({
      success: true,
      message: "Mind entry created",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
});

mindEntriesRouter.get("/", async (_request, response, next) => {
  try {
    const entries = await db
      .select()
      .from(mindEntries)
      .where(eq(mindEntries.userId, response.locals.userId))
      .orderBy(desc(mindEntries.createdAt));

    response.json({
      success: true,
      message: "Mind entries",
      data: entries,
    });
  } catch (error) {
    next(error);
  }
});
