import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";

import {relations} from "drizzle-orm";

import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import { z } from "zod";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});


export const userProfiles = pgTable('user_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => users.id).unique(),
    name: text('name').notNull(),
    identification_number: text('identification_number').notNull().unique(),
    age: integer('age').notNull(),
    height: integer('height').notNull(),
    weight: integer('weight').notNull(),
    blood_type: text('blood_type').notNull(),
    gender: text('gender').notNull(),
    phone_number: text('phone_number').notNull(),
    emergency_contact: text('emergency_contact').notNull(),
    emergency_person: text('emergency_person').notNull(),
    relationship: text('relationship').notNull(),
    allergies: text('allergies').notNull(),
    conditions: text('conditions').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});



// Define relations
//Un usuario tiene un perfil
export const userRelations = relations(users, ({ one, many }) => ({
    profile: one(userProfiles, {
        fields: [users.id],
        references: [userProfiles.user_id]
    }),
}));

//Un perfil pertenece a un usuario
export const userProfileRelations = relations(userProfiles, ({ one }) => ({
    user: one(users, {
        fields: [userProfiles.user_id],
        references: [users.id]
    })
}));





// Infer types
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;



// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
    email: (schema) => schema.email("Invalid email format"),
    username: (schema) =>
        schema
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username cannot exceed 30 characters"),

    password: (schema) =>
        schema.min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username cannot exceed 30 characters"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export const selectUserSchema = createSelectSchema(users);

export const insertUserProfileSchema =
    createInsertSchema(userProfiles).omit({
        id: true,
        user_id: true,
        created_at: true,
        updated_at: true,
    });

export const selectUserProfileSchema = createSelectSchema(userProfiles);
export const updateUserProfileSchema = insertUserProfileSchema.partial();



