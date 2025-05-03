import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Question schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  categoryId: integer("category_id").notNull(),
  difficulty: integer("difficulty").notNull(),
  imageUrl: text("image_url"),
  explanation: text("explanation"),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  text: true,
  categoryId: true,
  difficulty: true,
  imageUrl: true,
  explanation: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Option schema
export const options = pgTable("options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull(),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

export const insertOptionSchema = createInsertSchema(options).pick({
  questionId: true,
  text: true,
  isCorrect: true,
});

export type InsertOption = z.infer<typeof insertOptionSchema>;
export type Option = typeof options.$inferSelect;

// Quiz schema
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id"),
  totalQuestions: integer("total_questions").notNull(),
  currentQuestion: integer("current_question").notNull().default(0),
  score: integer("score").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  answers: jsonb("answers").notNull().default({}),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  categoryId: true,
  totalQuestions: true,
});

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

// Extended types for API responses
export type QuestionWithOptions = Question & {
  options: Option[];
  category?: Category;
};

export type QuizWithQuestions = Quiz & {
  questions: QuestionWithOptions[];
};
