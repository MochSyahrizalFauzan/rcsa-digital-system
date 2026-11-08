import { Router } from "express";

const createRisksRoutes = (
  risksController,
  authenticateToken,
  attachPermissions,
  authorizePerm
) => {
  const router = Router();
  const canRead = [authenticateToken, attachPermissions, authorizePerm("can_read")];
  const canCreate = [authenticateToken, attachPermissions, authorizePerm("can_create")];
  const canUpdate = [authenticateToken, attachPermissions, authorizePerm("can_update")];
  const canDelete = [authenticateToken, attachPermissions, authorizePerm("can_delete")];
  const canProvision = [authenticateToken, attachPermissions, authorizePerm("can_provision")];

  // Specific routes first
  router.get("/risks/masters", canRead, risksController.getRiskMasters);
  router.post("/risks/master", canProvision, risksController.createRiskMaster);
  router.post("/risks/generate", canProvision, risksController.generateRisk);

  // General CRUD
  router.get("/risks", canRead, risksController.getAllRisks);
  router.get("/risks/:id(\\d+)", canRead, risksController.getRiskById);
  router.post("/risks", canCreate, risksController.createRisk);
  router.put("/risks/:id", canUpdate, risksController.updateRisk);
  router.delete("/risks/:id", canDelete, risksController.deleteRisk);

  return router;
};

export default createRisksRoutes;
