import createDashboardRepository from "./dashboard.repository.js";
import createDashboardService from "./dashboard.service.js";
import createDashboardController from "./dashboard.controller.js";
import createDashboardRoutes from "./dashboard.routes.js";

/**
 * Dashboard Module Composition Root
 * @param {object} db - Database pool or connection
 * @param {Function} authMiddleware - Authentication Middleware
 * @param {Function} attachPermissions - RBAC attach permissions middleware
 * @param {Function} authorizePerm - RBAC authorize permission factory
 */
const createDashboardModule = (db, authMiddleware, attachPermissions, authorizePerm) => {
  const repository = createDashboardRepository(db);
  const service = createDashboardService(repository);
  const controller = createDashboardController(service);
  const routes = createDashboardRoutes(controller, authMiddleware, attachPermissions, authorizePerm);

  return {
    repository,
    service,
    controller,
    routes,
  };
};

export default createDashboardModule;
