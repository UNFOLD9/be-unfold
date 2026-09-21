import type { Request, Response } from "express";

import { env } from "../config/env.js";
import { createAuthToken, verifyAuthToken } from "./token.js";

const cookieName = "unfold_session";
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

function readCookie(request: Request) {
  const item = request.headers.cookie
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${cookieName}=`));
  return item ? decodeURIComponent(item.slice(cookieName.length + 1)) : undefined;
}

export async function setAuthCookie(response: Response, userId: string) {
  const token = await createAuthToken(userId, env.JWT_SECRET);
  response.cookie(cookieName, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(cookieName, cookieOptions);
}

export async function getAuthenticatedUserId(request: Request) {
  try {
    const token = readCookie(request);
    if (!token) return null;
    return await verifyAuthToken(token, env.JWT_SECRET);
  } catch {
    return null;
  }
}
