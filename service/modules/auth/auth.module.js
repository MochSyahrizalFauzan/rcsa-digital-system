import createAuthRepository from "./auth.repository.js";
import createAuthService from "./auth.service.js";
import createAuthController from "./auth.controller.js";
import createAuthRoutes from "./auth.routes.js";

/**
 * Auth Module Composition Root
 * @param {object} db - Database Pool or Connection
 * @param {Function} authMiddleware - Authentication Middleware
 */
const createAuthModule = (db, authMiddleware) => {
  const authRepository = createAuthRepository(db);
  const authService = createAuthService(authRepository);
  const authController = createAuthController(authService);
  const routes = createAuthRoutes(authController, authMiddleware);

  return {
    repository: authRepository,
    service: authService,
    controller: authController,
    routes,
  };
};

export default createAuthModule;
