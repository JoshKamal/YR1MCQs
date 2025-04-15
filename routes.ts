import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { insertQuestionHistorySchema, insertQuestionOrderSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API route for health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API for user registration - temporary guest user
  app.post('/api/users/guest', async (req, res) => {
    try {
      const guestUsername = `guest_${Date.now()}`;
      const user = await storage.createUser({
        username: guestUsername,
        password: 'guest' // For demo purposes, in a real app use proper auth
      });
      
      res.status(201).json({ userId: user.id, username: user.username });
    } catch (error) {
      console.error('Error creating guest user:', error);
      res.status(500).json({ error: 'Failed to create guest user' });
    }
  });

  // Middleware to check if user is authenticated and has access to the requested user data
  const checkUserAccess = (req: Request, res: Response, next: NextFunction) => {
    // If not authenticated, return 401
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Get the requested userId from params
    const requestedUserId = parseInt(req.params.userId);
    
    // Get the current authenticated user
    const currentUser = req.user as Express.User;
    
    // Only allow access if the user is accessing their own data
    if (currentUser.id !== requestedUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // User has access, proceed to the route handler
    next();
  };

  // API to get current authenticated user
  app.get('/api/current-user', (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as Express.User;
      return res.json({ id: user.id, username: user.username });
    }
    res.status(401).json({ error: 'Not authenticated' });
  });

  // API to get question history for a user
  app.get('/api/users/:userId/history', checkUserAccess, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const history = await storage.getQuestionHistory(userId);
      res.json(history);
    } catch (error) {
      console.error('Error getting question history:', error);
      res.status(500).json({ error: 'Failed to get question history' });
    }
  });

  // API to save question history
  app.post('/api/users/:userId/history', checkUserAccess, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const historyData = insertQuestionHistorySchema.parse({
        ...req.body,
        userId
      });
      
      const savedHistory = await storage.saveQuestionHistory(historyData);
      res.status(201).json(savedHistory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error saving question history:', error);
      res.status(500).json({ error: 'Failed to save question history' });
    }
  });

  // API to get the question order for a module
  app.get('/api/users/:userId/order/:module', checkUserAccess, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const module = req.params.module;
      const order = await storage.getQuestionOrder(userId, module);
      
      if (!order) {
        return res.status(404).json({ error: 'Question order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error getting question order:', error);
      res.status(500).json({ error: 'Failed to get question order' });
    }
  });

  // API to save or update question order
  app.post('/api/users/:userId/order/:module', checkUserAccess, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const module = req.params.module;
      const questionOrder = req.body.questionOrder;
      
      if (!Array.isArray(questionOrder)) {
        return res.status(400).json({ error: 'Question order must be an array' });
      }
      
      const updatedOrder = await storage.updateQuestionOrder(userId, module, questionOrder);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating question order:', error);
      res.status(500).json({ error: 'Failed to update question order' });
    }
  });
  
  // API to delete all question history for a user (reset functionality)
  app.delete('/api/users/:userId/history', checkUserAccess, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      await storage.deleteQuestionHistory(userId);
      res.status(200).json({ message: 'Question history deleted successfully' });
    } catch (error) {
      console.error('Error deleting question history:', error);
      res.status(500).json({ error: 'Failed to delete question history' });
    }
  });
  
  // API to delete question order for a module
  app.delete('/api/users/:userId/order/:module', checkUserAccess, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const module = req.params.module;
      await storage.deleteQuestionOrder(userId, module);
      res.status(200).json({ message: 'Question order deleted successfully' });
    } catch (error) {
      console.error('Error deleting question order:', error);
      res.status(500).json({ error: 'Failed to delete question order' });
    }
  });

  // Serve the quiz app HTML files
  app.get('/', (req, res) => {
    // If user is authenticated, send to main app, otherwise to auth page
    if (req.isAuthenticated()) {
      res.sendFile(path.resolve(process.cwd(), 'fixed_mcq_quiz_app.html'));
    } else {
      res.sendFile(path.resolve(process.cwd(), 'auth.html'));
    }
  });

  app.get('/auth', (req, res) => {
    // If already logged in, redirect to main app
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.sendFile(path.resolve(process.cwd(), 'auth.html'));
    }
  });

  app.get('/fixed_mcq_quiz_app.html', (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      res.sendFile(path.resolve(process.cwd(), 'fixed_mcq_quiz_app.html'));
    } else {
      res.redirect('/auth');
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
