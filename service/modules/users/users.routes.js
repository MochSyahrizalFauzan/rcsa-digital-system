import { Router } from "express";

const createUsersRoutes = (usersController, authenticateToken, attachPermissions, authorizePerm) => {
  const router = Router();

  // Users Management
  router.get("/users", authenticateToken, usersController.getAllUsers);
  router.post(
    "/users",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_provision"),
    usersController.createUser
  );
  router.put(
    "/users/:id/status",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_provision"),
    usersController.updateUserStatus
  );

  // Roles & Permissions
  router.get("/roles", authenticateToken, attachPermissions, authorizePerm("can_read"), usersController.getAllRoles);
  router.get(
    "/roles/:roleId/permissions",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    usersController.getRolePermissions
  );

  // User Logins (Audit Trail)
  router.get("/user-logins", authenticateToken, usersController.getUserLogins);

  // Units
  router.get("/units", authenticateToken, attachPermissions, authorizePerm("can_read"), usersController.getAllUnits);
  router.get(
    "/units/:id",
    authenticateToken,
    attachPermissions,
    authorizePerm("can_read"),
    usersController.getUnitById
  );

  return router;
};

export default createUsersRoutes;
