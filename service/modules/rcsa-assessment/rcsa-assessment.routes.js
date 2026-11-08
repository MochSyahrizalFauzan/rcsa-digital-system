import { Router } from "express";

const createRcsaAssessmentRoutes = (
  rcsaAssessmentController,
  authenticateToken,
  attachPermissions,
  authorizePerm
) => {
  const router = Router();

  // 1. Static Routes (Harus ditaruh sebelum rute dengan parameter :id)
  router.get(
  "/rcsa/assessment",
  authenticateToken,
  attachPermissions,
  authorizePerm("can_read"),
  rcsaAssessmentController.getSubmitted
);
  router.get(
  "/rcsa/assessment/drafts",
  authenticateToken,
  attachPermissions,
  authorizePerm("can_read"),
  rcsaAssessmentController.getDrafts
);

  router.get(
    "/rcsa/assessment/reviewed",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaAssessmentController.getReviewedHistory
  );

  router.get(
    "/rcsa/report/reviewed",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaAssessmentController.getReportReviewed
  );

  router.get(
    "/rcsa/assessment/mine-reviewed",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaAssessmentController.getMineReviewed
  );

  // 2. Review Workflow Routes
  router.get(
    "/rcsa/review/queue",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_approve"),
    rcsaAssessmentController.getReviewQueue
  );

  router.get(
    "/rcsa/review/:assessmentId/notes",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_approve"),
    rcsaAssessmentController.getReviewNotes
  );

  router.post(
    "/rcsa/review/:assessmentId",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_approve"),
    rcsaAssessmentController.reviewAssessment
  );

  // 3. Assessment Parametric CRUD & Actions
  router.get(
    "/rcsa/assessment/:id(\\d+)",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    rcsaAssessmentController.getById
);
  router.post(
  "/rcsa/assessment",
  authenticateToken,
  attachPermissions,
  authorizePerm("can_create"),
  rcsaAssessmentController.saveAssessment
);
  router.put(
  "/rcsa/assessment/:id(\\d+)",
  authenticateToken,
  attachPermissions,
  authorizePerm("can_update"),
  rcsaAssessmentController.updateDraft
);
  router.put(
  "/rcsa/assessment/:id(\\d+)/submit",
  authenticateToken,
  attachPermissions,
  authorizePerm("can_update"),
  rcsaAssessmentController.submitAssessment
);

  return router;
};

export default createRcsaAssessmentRoutes;
