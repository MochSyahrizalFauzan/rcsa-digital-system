import createUsersRepository from "./users.repository.js";
import createUsersService from "./users.service.js";
import createUsersController from "./users.controller.js";
import createUsersRoutes from "./users.routes.js";

/**
 * Users Module Composition Root
 * @param {object} db - Database pool or connection
 * @param {Function} authMiddleware - Authentication Middleware
 * @param {Function} attachPermissions - RBAC attach permissions middleware
 * @param {Function} authorizePerm - RBAC authorize permission factory
 */
const createUsersModule = (db, authMiddleware, attachPermissions, authorizePerm) => {
  const usersRepository = createUsersRepository(db);
  const usersService = createUsersService(usersRepository);
  const usersController = createUsersController(usersService);
  const routes = createUsersRoutes(usersController, authMiddleware, attachPermissions, authorizePerm);

  return {
    repository: usersRepository,
    service: usersService,
    controller: usersController,
    routes,
  };
};

export default createUsersModule;
