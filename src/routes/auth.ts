import { eq } from "drizzle-orm";
import { Router, type Response } from "express";
import { z } from "zod";

import { hashPassword, verifyPassword } from "../auth/password.js";
import { clearAuthCookie, setAuthCookie } from "../auth/session.js";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(150),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(150),
  password: z.string().min(1).max(128),
});

const publicUser = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
};

const dummyPasswordHash = hashPassword("not-a-real-password");

function invalidInput(response: Response, error: z.ZodError) {
  response.status(400).json({
    success: false,
    message: "Invalid request",
    data: null,
    errors: error.flatten().fieldErrors,
  });
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

authRouter.post("/register", async (request, response, next) => {
  const input = registerSchema.safeParse(request.body);
  if (!input.success) return invalidInput(response, input.error);

  try {
    const [user] = await db
      .insert(users)
      .values({
        name: input.data.name,
        email: input.data.email,
        passwordHash: await hashPassword(input.data.password),
      })
      .returning(publicUser);

    await setAuthCookie(response, user.id);
    response.status(201).json({ success: true, message: "Account created", data: user });
  } catch (error) {
    if (isUniqueViolation(error)) {
      response.status(409).json({ success: false, message: "Email already registered", data: null });
      return;
    }
    next(error);
  }
});

authRouter.post("/login", async (request, response, next) => {
  const input = loginSchema.safeParse(request.body);
  if (!input.success) return invalidInput(response, input.error);

  try {
    const [user] = await db
      .select({ ...publicUser, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, input.data.email))
      .limit(1);
    const passwordMatches = await verifyPassword(
      input.data.password,
      user?.passwordHash ?? (await dummyPasswordHash),
    );
    if (!user || !passwordMatches) {
      response.status(401).json({ success: false, message: "Invalid email or password", data: null });
      return;
    }

    await setAuthCookie(response, user.id);
    const { passwordHash: _, ...data } = user;
    response.json({ success: true, message: "Logged in", data });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", (_request, response) => {
  clearAuthCookie(response);
  response.json({ success: true, message: "Logged out", data: null });
});

authRouter.get("/me", requireAuth, async (_request, response, next) => {
  try {
    const [user] = await db
      .select(publicUser)
      .from(users)
      .where(eq(users.id, response.locals.userId))
      .limit(1);

    if (!user) {
      clearAuthCookie(response);
      response.status(401).json({ success: false, message: "Session is no longer valid", data: null });
      return;
    }

    response.json({ success: true, message: "Current user", data: user });
  } catch (error) {
    next(error);
  }
});
