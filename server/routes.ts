import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Endpoint to get questions (optionally filtered by category)
  app.get("/api/questions", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
      const questions = await storage.getQuestions(categoryId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Endpoint to get a specific question by ID
  app.get("/api/questions/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const question = await storage.getQuestionById(id);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  // Endpoint to create a new quiz
  app.post("/api/quizzes", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        categoryId: z.number().optional(),
        totalQuestions: z.number().min(1).max(10).default(10)
      });
      
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.errors });
      }
      
      const quiz = await storage.createQuiz(result.data);
      const quizWithQuestions = await storage.getQuizById(quiz.id);
      
      res.status(201).json(quizWithQuestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  // Endpoint to get a specific quiz by ID
  app.get("/api/quizzes/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const quiz = await storage.getQuizById(id);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Endpoint to update quiz progress
  app.patch("/api/quizzes/:id/progress", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      const schema = z.object({
        questionIndex: z.number().min(0),
        isCorrect: z.boolean()
      });
      
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.errors });
      }
      
      const { questionIndex, isCorrect } = result.data;
      const updatedQuiz = await storage.updateQuizProgress(id, questionIndex, isCorrect);
      
      if (!updatedQuiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quiz progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
