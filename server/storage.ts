import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  users,
  projects,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjectsByUser(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(userId: string, data: InsertProject): Promise<Project>;
  updateProject(
    id: string,
    userId: string,
    data: Partial<InsertProject>,
  ): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // ── Users ────────────────────────────────────────────────────────
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // ── Projects ─────────────────────────────────────────────────────
  async getProjectsByUser(userId: string): Promise<Project[]> {
    return db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async createProject(
    userId: string,
    data: InsertProject,
  ): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({ ...data, userId })
      .returning();
    return project;
  }

  async updateProject(
    id: string,
    userId: string,
    data: Partial<InsertProject>,
  ): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    // Verify ownership
    if (project && project.userId !== userId) return undefined;
    return project;
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    const project = await this.getProject(id);
    if (!project || project.userId !== userId) return false;
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
