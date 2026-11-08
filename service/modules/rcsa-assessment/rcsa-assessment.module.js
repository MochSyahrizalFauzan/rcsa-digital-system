import createRcsaAssessmentRepository from "./rcsa-assessment.repository.js";
import createRcsaAssessmentService from "./rcsa-assessment.service.js";
import createRcsaAssessmentController from "./rcsa-assessment.controller.js";
import createRcsaAssessmentRoutes from "./rcsa-assessment.routes.js";

/**
 * RCSA Assessment Module Composition Root
 * @param {object} db - Database pool or connection
 * @param {Function} authMiddleware - Authentication Middleware
 * @param {Function} attachPermissions - RBAC attach permissions middleware
 * @param {Function} authorizePerm - RBAC authorize permission factory
 */
const createRcsaAssessmentModule = (db, authMiddleware, attachPermissions, authorizePerm) => {
  const repository = createRcsaAssessmentRepository(db);
  const service = createRcsaAssessmentService(repository);
  const controller = createRcsaAssessmentController(service);
  const routes = createRcsaAssessmentRoutes(controller, authMiddleware, attachPermissions, authorizePerm);

  return {
    repository,
    service,
    controller,
    routes,
  };
};

export default createRcsaAssessmentModule;
