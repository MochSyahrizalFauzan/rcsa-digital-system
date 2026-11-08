import { Router } from "express";

const createDashboardRoutes = (
  dashboardController,
  authenticateToken,
  attachPermissions,
  authorizePerm
) => {
  const router = Router();

  router.get(
    "/dashboard/summary",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    dashboardController.getSummary
  );

  return router;
};

export default createDashboardRoutes;
