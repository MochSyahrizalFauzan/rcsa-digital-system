const createDashboardService = (dashboardRepository) => {
  return {
    /**
     * Get aggregated macro dashboard summary
     * @param {object} userPermissions - req.perms
     */
    getSummary: async (userPermissions = {}) => {
      const [
        masterStats,
        assessmentStats,
        coverage,
        missingByMaster,
        unitProgress,
        recentLogins,
      ] = await Promise.all([
        dashboardRepository.getMasterStats(),
        dashboardRepository.getAssessmentStats(),
        dashboardRepository.getCoverage(),
        dashboardRepository.getMissingByMaster(20),
        dashboardRepository.getUnitProgress(20),
        dashboardRepository.getRecentLogins(10),
      ]);

      let approvalInbox = [];
      let reviewQueue = [];

      if (userPermissions?.can_approve) {
        const [a, rq] = await Promise.all([
          dashboardRepository.getApprovalQueue(20),
          dashboardRepository.getReviewQueue(20),
        ]);
        approvalInbox = a;
        reviewQueue = rq;
      }

      return {
        masterStats,
        assessmentStats,
        coverage,
        missingByMaster,
        unitProgress,
        queues: {
          approvalInbox,
          reviewQueue,
        },
        recent: {
          logins: recentLogins,
        },
      };
    },
  };
};

export default createDashboardService;
