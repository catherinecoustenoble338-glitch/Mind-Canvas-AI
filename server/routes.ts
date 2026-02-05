import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { storage } from "./storage";
import { requireAuth, sanitizeUser } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // ═══════════════════════════════════════════════════════════════
  //  AUTH ROUTES
  // ═══════════════════════════════════════════════════════════════

  // Register
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const body = z
        .object({
          username: z.string().min(3).max(50),
          email: z.string().email(),
          name: z.string().min(1).max(100),
          password: z.string().min(6).max(128),
        })
        .parse(req.body);

      // Check existing
      const existingEmail = await storage.getUserByEmail(body.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
      const existingUsername = await storage.getUserByUsername(body.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(body.password, 12);
      const user = await storage.createUser({
        username: body.username,
        email: body.email,
        name: body.name,
        password: hashedPassword,
      });

      // Auto-login after registration
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(sanitizeUser(user));
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      next(err);
    }
  });

  // Login
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate(
      "local",
      (err: Error | null, user: Express.User | false, info: { message: string }) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }
        req.login(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          res.json(sanitizeUser(user));
        });
      },
    )(req, res, next);
  });

  // Logout
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  // Current user
  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(sanitizeUser(req.user!));
  });

  // ═══════════════════════════════════════════════════════════════
  //  PROJECT ROUTES (all require auth)
  // ═══════════════════════════════════════════════════════════════

  // List projects for current user
  app.get("/api/projects", requireAuth, async (req, res, next) => {
    try {
      const projects = await storage.getProjectsByUser(req.user!.id);
      res.json(projects);
    } catch (err) {
      next(err);
    }
  });

  // Get single project
  app.get("/api/projects/:id", requireAuth, async (req, res, next) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project || project.userId !== req.user!.id) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (err) {
      next(err);
    }
  });

  // Create project
  app.post("/api/projects", requireAuth, async (req, res, next) => {
    try {
      const body = z
        .object({
          name: z.string().min(1).max(200),
          description: z.string().max(2000).optional().default(""),
          canvasData: z
            .object({
              nodes: z.array(z.any()),
              edges: z.array(z.any()),
            })
            .optional()
            .default({ nodes: [], edges: [] }),
        })
        .parse(req.body);

      const project = await storage.createProject(req.user!.id, body);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      next(err);
    }
  });

  // Update project
  app.put("/api/projects/:id", requireAuth, async (req, res, next) => {
    try {
      const body = z
        .object({
          name: z.string().min(1).max(200).optional(),
          description: z.string().max(2000).optional(),
          canvasData: z
            .object({
              nodes: z.array(z.any()),
              edges: z.array(z.any()),
            })
            .optional(),
        })
        .parse(req.body);

      const project = await storage.updateProject(
        req.params.id,
        req.user!.id,
        body,
      );
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      next(err);
    }
  });

  // Delete project
  app.delete("/api/projects/:id", requireAuth, async (req, res, next) => {
    try {
      const deleted = await storage.deleteProject(req.params.id, req.user!.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted" });
    } catch (err) {
      next(err);
    }
  });

  return httpServer;
}
