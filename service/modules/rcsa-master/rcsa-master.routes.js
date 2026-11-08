import { Router } from "express";

const createRcsaMasterRoutes = (
  rcsaMasterController,
  authenticateToken,
  attachPermissions,
  authorizePerm
) => {
  const router = Router();

  // 1. Static / Specific Routes (Harus ditaruh sebelum rute dengan parameter :id)
  router.get(
    "/rcsa/master/list",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaMasterController.getMasterList
  );

  router.get(
    "/rcsa/master/approval/inbox",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_approve"),
    rcsaMasterController.getApprovalInbox
  );

  router.get(
    "/rcsa/master/active",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaMasterController.getActiveMasters
  );

  router.get(
    "/rcsa/master/by-unit/:unitId",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaMasterController.getByUnitId
  );

  // 2. Parametric Routes & Actions
  router.get(
    "/rcsa/master/:id/detail",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaMasterController.getMasterDetail
  );

  router.post(
    "/rcsa/master",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_create"),
    rcsaMasterController.createMaster
  );

  router.put(
    "/rcsa/master/:id",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_update"),
    rcsaMasterController.updateMaster
  );

  router.delete(
    "/rcsa/master/:id",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_delete"),
    rcsaMasterController.deleteMaster
  );

  router.post(
    "/rcsa/master/:id/assign-units",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_provision"),
    rcsaMasterController.assignUnits
  );

  router.post(
    "/rcsa/master/:id/archive",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_update"),
    rcsaMasterController.archiveMaster
  );

  router.post(
    "/rcsa/master/:id/submit",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_update"),
    rcsaMasterController.submitForApproval
  );

  router.post(
    "/rcsa/master/:id/decision",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_approve"),
    rcsaMasterController.decideApproval
  );

  router.post(
    "/rcsa/master/:id/publish",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_provision"),
    rcsaMasterController.publishMaster
  );

  return router;
};

export default createRcsaMasterRoutes;
