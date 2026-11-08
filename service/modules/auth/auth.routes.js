import { Router } from "express";

const createAuthRoutes = (authController, authenticateToken) => {
  const router = Router();

  // Public Routes
  router.post("/login", authController.login);
  router.post("/refresh-token", authController.refreshToken);

  // Protected Routes
  router.post("/logout", authenticateToken, authController.logout);
  router.get("/me", authenticateToken, authController.getMe);
  router.get("/profile", authenticateToken, authController.getProfile);

  return router;
};

export default createAuthRoutes;
