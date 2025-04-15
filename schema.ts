import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User question history table
export const questionHistory = pgTable("question_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  questionText: text("question_text").notNull(), // Store the actual question text for identification
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  module: text("module").notNull(), // The module this question belongs to
  questionData: jsonb("question_data").notNull() // Store the complete question data
});

export const insertQuestionHistorySchema = createInsertSchema(questionHistory).pick({
  userId: true,
  questionText: true,
  selectedAnswer: true,
  isCorrect: true,
  module: true,
  questionData: true
});

export type InsertQuestionHistory = z.infer<typeof insertQuestionHistorySchema>;
export type QuestionHistory = typeof questionHistory.$inferSelect;

// Table to store the order of questions for each module to maintain consistency
export const questionOrder = pgTable("question_order", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  module: text("module").notNull(),
  questionOrder: jsonb("question_order").notNull(), // Array of question texts in specific order
  lastUpdated: timestamp("last_updated").defaultNow()
});

export const insertQuestionOrderSchema = createInsertSchema(questionOrder).pick({
  userId: true,
  module: true,
  questionOrder: true
});

export type InsertQuestionOrder = z.infer<typeof insertQuestionOrderSchema>;
export type QuestionOrder = typeof questionOrder.$inferSelect;
