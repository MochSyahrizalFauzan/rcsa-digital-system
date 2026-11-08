const createRcsaMasterController = (rcsaMasterService) => {
  return {
    /**
     * GET /rcsa/master/list
     */
    getMasterList: async (req, res, next) => {
      try {
        const rows = await rcsaMasterService.getMasterList();
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/master/:id/detail
     */
    getMasterDetail: async (req, res, next) => {
      try {
        const detail = await rcsaMasterService.getMasterDetail(req.params.id);
        return res.status(200).json(detail);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/master
     */
    createMaster: async (req, res, next) => {
      try {
        const result = await rcsaMasterService.createMaster(req.body, req.user.id);
        return res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * PUT /rcsa/master/:id
     */
    updateMaster: async (req, res, next) => {
      try {
        const result = await rcsaMasterService.updateMaster(req.params.id, req.body);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * DELETE /rcsa/master/:id
     */
    deleteMaster: async (req, res, next) => {
      try {
        const result = await rcsaMasterService.deleteMaster(req.params.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/master/:id/assign-units
     */
    assignUnits: async (req, res, next) => {
      try {
        const { unit_ids } = req.body;
        const result = await rcsaMasterService.assignUnits(req.params.id, unit_ids);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/master/:id/archive
     */
    archiveMaster: async (req, res, next) => {
      try {
        const result = await rcsaMasterService.archiveMaster(req.params.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/master/:id/submit
     */
    submitForApproval: async (req, res, next) => {
      try {
        const result = await rcsaMasterService.submitForApproval(req.params.id, req.user.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/master/approval/inbox
     */
    getApprovalInbox: async (req, res, next) => {
      try {
        const rows = await rcsaMasterService.getApprovalInbox();
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/master/:id/decision
     */
    decideApproval: async (req, res, next) => {
      try {
        const result = await rcsaMasterService.decideApproval(req.params.id, req.body, req.user.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /rcsa/master/:id/publish
     */
    publishMaster: async (req, res, next) => {
      try {
        const result = await rcsaMasterService.publishMaster(req.params.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/master/active
     */
    getActiveMasters: async (req, res, next) => {
      try {
        const userUnitId = req.user.unit_id;
        const rows = await rcsaMasterService.getActiveForUserUnit(userUnitId);
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /rcsa/master/by-unit/:unitId
     */
    getByUnitId: async (req, res, next) => {
      try {
        const rows = await rcsaMasterService.getByUnitId(req.params.unitId);
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },
  };
};

export default createRcsaMasterController;
