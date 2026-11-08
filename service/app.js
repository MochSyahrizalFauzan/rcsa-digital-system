import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authenticateToken } from "./middleware/auth.js";
import { attachPermissions, authorizePerm } from "./middleware/rbac.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

import createAuthModule from "./modules/auth/auth.module.js";
import createUsersModule from "./modules/users/users.module.js";
import createRcsaMasterModule from "./modules/rcsa-master/rcsa-master.module.js";
import createRcsaAssessmentModule from "./modules/rcsa-assessment/rcsa-assessment.module.js";
import createDashboardModule from "./modules/dashboard/dashboard.module.js";
import createRisksModule from "./modules/risks/risks.module.js";

/**
 * Express Application Factory (Modular Monolith)
 * @param {object} db - Database Pool or Connection
 * @returns {express.Application}
 */
const createApp = (db) => {
  const app = express();

  // 1. Global Middleware
  const allowedOrigins = [
    "http://localhost:9002",
    "http://localhost:3000",
    "http://127.0.0.1:9002",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Izinkan request tanpa origin (seperti Postman, curl, server-to-server) atau yang terdaftar
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive during local development
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  // 2. Health Check Endpoint
  app.get("/health", async (req, res) => {
    try {
      await db.query("SELECT 1");
      res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        database: "CONNECTED",
      });
    } catch (err) {
      res.status(503).json({
        status: "DOWN",
        database: "DISCONNECTED",
        error: err.message,
      });
    }
  });

  // 3. Shared Middlewares
  const authMiddleware = authenticateToken(db);
  const permissionsMiddleware = attachPermissions(db);

  // 4. Module Initializations (Inversion of Control)
  const authModule = createAuthModule(db, authMiddleware);
  const usersModule = createUsersModule(db, authMiddleware, permissionsMiddleware, authorizePerm);
  const rcsaMasterModule = createRcsaMasterModule(db, authMiddleware, permissionsMiddleware, authorizePerm);
  const rcsaAssessmentModule = createRcsaAssessmentModule(db, authMiddleware, permissionsMiddleware, authorizePerm);
  const dashboardModule = createDashboardModule(db, authMiddleware, permissionsMiddleware, authorizePerm);
  const risksModule = createRisksModule(db, authMiddleware, permissionsMiddleware, authorizePerm);

  // 5. Mount Module Routes
  app.use("/", authModule.routes);
  app.use("/", usersModule.routes);
  app.use("/", rcsaMasterModule.routes);
  app.use("/", rcsaAssessmentModule.routes);
  app.use("/", dashboardModule.routes);
  app.use("/", risksModule.routes);

  // 6. 404 & Global Error Handling Middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
