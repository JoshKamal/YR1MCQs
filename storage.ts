import { 
  users, type User, type InsertUser,
  questionHistory, type QuestionHistory, type InsertQuestionHistory,
  questionOrder, type QuestionOrder, type InsertQuestionOrder
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question history methods
  getQuestionHistory(userId: number): Promise<QuestionHistory[]>;
  saveQuestionHistory(history: InsertQuestionHistory): Promise<QuestionHistory>;
  deleteQuestionHistory(userId: number): Promise<void>;
  
  // Question order methods
  getQuestionOrder(userId: number, module: string): Promise<QuestionOrder | undefined>;
  saveQuestionOrder(order: InsertQuestionOrder): Promise<QuestionOrder>;
  updateQuestionOrder(userId: number, module: string, questionOrder: any): Promise<QuestionOrder>;
  deleteQuestionOrder(userId: number, module: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Question history methods
  async getQuestionHistory(userId: number): Promise<QuestionHistory[]> {
    return await db.select().from(questionHistory).where(eq(questionHistory.userId, userId));
  }
  
  async saveQuestionHistory(history: InsertQuestionHistory): Promise<QuestionHistory> {
    const [record] = await db.insert(questionHistory).values(history).returning();
    return record;
  }
  
  async deleteQuestionHistory(userId: number): Promise<void> {
    await db.delete(questionHistory).where(eq(questionHistory.userId, userId));
  }
  
  // Question order methods
  async getQuestionOrder(userId: number, module: string): Promise<QuestionOrder | undefined> {
    const [order] = await db.select().from(questionOrder).where(
      and(
        eq(questionOrder.userId, userId),
        eq(questionOrder.module, module)
      )
    );
    return order;
  }
  
  async saveQuestionOrder(order: InsertQuestionOrder): Promise<QuestionOrder> {
    const [record] = await db.insert(questionOrder).values(order).returning();
    return record;
  }
  
  async updateQuestionOrder(userId: number, module: string, newOrder: any): Promise<QuestionOrder> {
    // First, check if a record exists
    const existingOrder = await this.getQuestionOrder(userId, module);
    
    if (existingOrder) {
      // If exists, update it
      const [updated] = await db.update(questionOrder)
        .set({ 
          questionOrder: newOrder,
          lastUpdated: new Date()
        })
        .where(
          and(
            eq(questionOrder.userId, userId),
            eq(questionOrder.module, module)
          )
        )
        .returning();
      return updated;
    } else {
      // If not exists, create a new one
      return await this.saveQuestionOrder({
        userId,
        module,
        questionOrder: newOrder
      });
    }
  }
  
  async deleteQuestionOrder(userId: number, module: string): Promise<void> {
    await db.delete(questionOrder).where(
      and(
        eq(questionOrder.userId, userId),
        eq(questionOrder.module, module)
      )
    );
  }
}

export const storage = new DatabaseStorage();
