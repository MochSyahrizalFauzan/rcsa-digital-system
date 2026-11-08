const createDashboardController = (dashboardService) => {
  return {
    /**
     * GET /dashboard/summary
     */
    getSummary: async (req, res, next) => {
      try {
        const summary = await dashboardService.getSummary(req.perms);
        return res.status(200).json(summary);
      } catch (error) {
        next(error);
      }
    },
  };
};

export default createDashboardController;
