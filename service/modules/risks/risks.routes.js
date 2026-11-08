import { Router } from "express";

const createRisksRoutes = (risksController, authenticateToken) => {
  const router = Router();

  // Specific routes first
  router.get("/risks/masters", authenticateToken, risksController.getRiskMasters);
  router.post("/risks/master", authenticateToken, risksController.createRiskMaster);
  router.post("/risks/generate", authenticateToken, risksController.generateRisk);

  // General CRUD
  router.get("/risks", authenticateToken, risksController.getAllRisks);
  router.post("/risks", authenticateToken, risksController.createRisk);
  router.put("/risks/:id", authenticateToken, risksController.updateRisk);
  router.delete("/risks/:id", authenticateToken, risksController.deleteRisk);

  return router;
};

export default createRisksRoutes;
