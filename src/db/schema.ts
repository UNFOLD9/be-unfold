import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).default("user").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const emotionalCheckIns = pgTable(
  "emotional_check_ins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    emotion: varchar("emotion", { length: 50 }).notNull(),
    intensity: integer("intensity").notNull(),
    triggerNote: text("trigger_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "emotional_check_ins_emotion_check",
      sql`${table.emotion} in ('happy', 'calm', 'anxious', 'tired', 'sad', 'empty', 'angry', 'overwhelmed')`,
    ),
    check(
      "emotional_check_ins_intensity_check",
      sql`${table.intensity} between 1 and 5`,
    ),
  ],
);

export const mindEntries = pgTable("mind_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isSaved: boolean("is_saved").default(true).notNull(),
  ...timestamps,
});

export const smallWins = pgTable("small_wins", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  winDate: date("win_date", { mode: "date" }).notNull(),
  ...timestamps,
});
