import { pgTable, uuid, text, timestamp, time, date} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./userSchema";

export const medicines = pgTable("medicines", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),

  name: text("name").notNull(),
  dailyDose: text("daily_dose").notNull(),
  timeTake: time("take_time").notNull(), // 👈 antes text
  startDate: date("start_date").notNull(), // 👈 antes text
  endDate: date("end_date").notNull(),     // 👈 antes text
  expirationDate: date("expiration_date").notNull(), // 👈 antes text,
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



export const medicineHistory = pgTable("medicine_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  medicine_name: text("medicine_name").notNull(),
  daily_dose: text("daily_dose").notNull(),
  start_date: date("start_date").notNull(),
  end_date: date("end_date").notNull(),
 created_at: timestamp("created_at")
  .defaultNow()
  .notNull(),
});

export const selectMedicineSchema = createSelectSchema(medicines);
export const updateMedicineSchema = insertMedicineSchema.partial();

export type Medicine = typeof medicines.$inferSelect;