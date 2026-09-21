import type { NextFunction, Request, Response } from "express";

import { getAuthenticatedUserId } from "../auth/session.js";

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    response.status(401).json({
      success: false,
      message: "Authentication required",
      data: null,
    });
    return;
  }

  response.locals.userId = userId;
  next();
}
