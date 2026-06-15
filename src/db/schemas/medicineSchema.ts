import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./userSchema";

export const medicines = pgTable("medicines", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),

  name: text("name").notNull(),
  dailyDose: text("daily_dose").notNull(),
  timeTake: text("take_time").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  expirationDate: text("expiration_date").notNull(),
  icon: text("icon").notNull(),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const selectMedicineSchema = createSelectSchema(medicines);
export const updateMedicineSchema = insertMedicineSchema.partial();

export type Medicine = typeof medicines.$inferSelect;