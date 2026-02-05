import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { pool } from "./db";
import type { User } from "@shared/schema";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      name: string;
      password: string;
      createdAt: Date;
    }
  }
}

export function setupAuth(app: Express) {
  // ── Session ────────────────────────────────────────────────────
  const PgSession = connectPgSimple(session);

  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "octoflow-dev-secret-change-in-prod",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    }),
  );

  // ── Passport ───────────────────────────────────────────────────
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) return done(null, false, { message: "Invalid email or password" });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return done(null, false, { message: "Invalid email or password" });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (err) {
      done(err);
    }
  });
}

// ── Middleware ──────────────────────────────────────────────────
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Authentication required" });
}

// Helper to strip password from user object before sending to client
export function sanitizeUser(user: User) {
  const { password, ...safe } = user;
  return safe;
}
