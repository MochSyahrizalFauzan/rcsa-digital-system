const createRcsaAssessmentController = (rcsaAssessmentService) => {
  return {
    /**
     * GET /rcsa/assessment
     */
    getSubmitted: async (req, res, next) => {
      try {
        const { unit_id } = req.query;
        const rows = await rcsaAssessmentService.getSubmitted(unit_id);
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/assessment/drafts
     */
    getDrafts: async (req, res, next) => {
      try {
        const { unit_id, exclude_submitted, incomplete_only } = req.query;
        const rows = await rcsaAssessmentService.getDrafts(
          {
            unitId: unit_id,
            excludeSubmitted: exclude_submitted,
            incompleteOnly: incomplete_only,
          },
          req.user.id
        );
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/assessment/:id(\d+)
     */
    getById: async (req, res, next) => {
      try {
        const data = await rcsaAssessmentService.getById(req.params.id);
        return res.status(200).json({ success: true, data });
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/assessment
     */
    saveAssessment: async (req, res, next) => {
      try {
        const result = await rcsaAssessmentService.saveAssessment(req.body, req.user.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * PUT /rcsa/assessment/:id
     */
    updateDraft: async (req, res, next) => {
      try {
        const result = await rcsaAssessmentService.updateDraft(req.params.id, req.body, req.user.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * PUT /rcsa/assessment/:id/submit
     */
    submitAssessment: async (req, res, next) => {
      try {
        const result = await rcsaAssessmentService.submitAssessment(req.params.id, req.user.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/review/queue
     */
    getReviewQueue: async (req, res, next) => {
      try {
        const rows = await rcsaAssessmentService.getReviewQueue();
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/review/:assessmentId
     */
    reviewAssessment: async (req, res, next) => {
      try {
        const result = await rcsaAssessmentService.reviewAssessment(
          req.params.assessmentId,
          req.body,
          req.user.id
        );
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/review/:assessmentId/notes
     */
    getReviewNotes: async (req, res, next) => {
      try {
        const rows = await rcsaAssessmentService.getReviewNotes(req.params.assessmentId);
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/assessment/reviewed
     */
    getReviewedHistory: async (req, res, next) => {
      try {
        const rows = await rcsaAssessmentService.getReviewedHistory();
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/report/reviewed
     */
    getReportReviewed: async (req, res, next) => {
      try {
        const { unit_id } = req.query;
        const rows = await rcsaAssessmentService.getReportReviewed(unit_id);
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/assessment/mine-reviewed
     */
    getMineReviewed: async (req, res, next) => {
      try {
        const rows = await rcsaAssessmentService.getMineReviewed(req.user.id);
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },
  };
};

export default createRcsaAssessmentController;
