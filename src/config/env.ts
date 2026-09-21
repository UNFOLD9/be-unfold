import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url(),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z
    .string()
    .min(32)
    .refine((value) => value !== "replace-with-at-least-32-random-characters", {
      message: "JWT_SECRET must be replaced",
    }),
});

export const env = envSchema.parse(process.env);
