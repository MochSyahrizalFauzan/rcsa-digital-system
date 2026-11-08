const createUsersController = (usersService) => {
  return {
    /**
     * GET /users
     */
    getAllUsers: async (req, res, next) => {
      try {
        const users = await usersService.getAllUsers();
        return res.status(200).json(users);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /users
     */
    createUser: async (req, res, next) => {
      try {
        const result = await usersService.createUser(req.body);
        return res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * PUT /users/:id/status
     */
    updateUserStatus: async (req, res, next) => {
      try {
        const targetId = req.params.id;
        const { status } = req.body;
        const currentUserId = req.user?.id;

        const result = await usersService.updateUserStatus(targetId, status, currentUserId);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /roles
     */
    getAllRoles: async (req, res, next) => {
      try {
        const roles = await usersService.getAllRoles();
        return res.status(200).json(roles);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /roles/:roleId/permissions
     */
    getRolePermissions: async (req, res, next) => {
      try {
        const { roleId } = req.params;
        const permissions = await usersService.getRolePermissions(roleId);
        return res.status(200).json(permissions);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /user-logins
     */
    getUserLogins: async (req, res, next) => {
      try {
        const logins = await usersService.getUserLogins();
        return res.status(200).json(logins);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /units
     */
    getAllUnits: async (req, res, next) => {
      try {
        const { parent_id } = req.query;
        const units = await usersService.getAllUnits(parent_id);
        return res.status(200).json(units);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /units/:id
     */
    getUnitById: async (req, res, next) => {
      try {
        const unit = await usersService.getUnitById(req.params.id);
        return res.status(200).json(unit);
      } catch (error) {
        next(error);
      }
    },
  };
};

export default createUsersController;
