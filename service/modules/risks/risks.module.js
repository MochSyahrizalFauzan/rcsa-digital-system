import createRisksRepository from "./risks.repository.js";
import createRisksService from "./risks.service.js";
import createRisksController from "./risks.controller.js";
import createRisksRoutes from "./risks.routes.js";

const createRisksModule = (db, authMiddleware, attachPermissions, authorizePerm) => {
  const repository = createRisksRepository(db);
  const service = createRisksService(repository);
  const controller = createRisksController(service);
  const routes = createRisksRoutes(controller, authMiddleware, attachPermissions, authorizePerm);

  return { repository, service, controller, routes };
};

export default createRisksModule;
