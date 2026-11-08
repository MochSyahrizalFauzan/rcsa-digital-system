const createRisksController = (risksService) => {
  return {
    /**
     * GET /risks
     */
    getAllRisks: async (req, res, next) => {
      try {
        const rows = await risksService.getAllRisks(req.user, req.perms);
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /risks/:id
     */
    getRiskById: async (req, res, next) => {
      try {
        const risk = await risksService.getRiskById(req.params.id, req.user, req.perms);
        return res.status(200).json(risk);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /risks
     */
    createRisk: async (req, res, next) => {
      try {
        const result = await risksService.createRisk(req.body, req.user, req.perms);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * PUT /risks/:id
     */
    updateRisk: async (req, res, next) => {
      try {
        const result = await risksService.updateRisk(req.params.id, req.body, req.user, req.perms);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * DELETE /risks/:id
     */
    deleteRisk: async (req, res, next) => {
      try {
        const result = await risksService.deleteRisk(req.params.id, req.user, req.perms);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /risks/masters
     */
    getRiskMasters: async (req, res, next) => {
      try {
        const rows = await risksService.getRiskMasters();
        return res.status(200).json(rows);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /risks/master
     */
    createRiskMaster: async (req, res, next) => {
      try {
        const result = await risksService.createRiskMaster(req.body, req.user.id);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /risks/generate
     */
    generateRisk: async (req, res, next) => {
      try {
        const { master_id, target_unit_id, pemilik_risiko } = req.body;
        const result = await risksService.generateRiskForUnit(
          master_id,
          target_unit_id,
          pemilik_risiko,
          req.user,
          req.perms
        );
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  };
};

export default createRisksController;
