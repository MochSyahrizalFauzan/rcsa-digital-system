import createRcsaMasterRepository from "./rcsa-master.repository.js";
import createRcsaMasterService from "./rcsa-master.service.js";
import createRcsaMasterController from "./rcsa-master.controller.js";
import createRcsaMasterRoutes from "./rcsa-master.routes.js";

/**
 * RCSA Master Module Composition Root
 * @param {object} db - Database pool or connection
 * @param {Function} authMiddleware - Authentication Middleware
 * @param {Function} attachPermissions - RBAC attach permissions middleware
 * @param {Function} authorizePerm - RBAC authorize permission factory
 */
const createRcsaMasterModule = (db, authMiddleware, attachPermissions, authorizePerm) => {
  const repository = createRcsaMasterRepository(db);
  const service = createRcsaMasterService(repository);
  const controller = createRcsaMasterController(service);
  const routes = createRcsaMasterRoutes(controller, authMiddleware, attachPermissions, authorizePerm);

  return {
    repository,
    service,
    controller,
    routes,
  };
};

export default createRcsaMasterModule;
