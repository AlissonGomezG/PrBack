import { pgTable, uuid, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./userSchema";

export const accessibilitySettings = pgTable("accessibility_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  fontSize: integer("font_size").notNull().default(100),
  fontWeight: boolean("font_weight").notNull().default(false),
  letterSpacing: boolean("letter_spacing").notNull().default(false),
  textToSpeech: boolean("text_to_speech").notNull().default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAccessibilitySchema = createInsertSchema(accessibilitySettings).omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const selectAccessibilitySchema = createSelectSchema(accessibilitySettings);
export const updateAccessibilitySchema = insertAccessibilitySchema.partial();

export type AccessibilitySetting = typeof accessibilitySettings.$inferSelect;
