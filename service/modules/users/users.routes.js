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
  router.get("/roles", usersController.getAllRoles);
  router.get("/roles/:roleId/permissions", usersController.getRolePermissions);

  // User Logins (Audit Trail)
  router.get("/user-logins", authenticateToken, usersController.getUserLogins);

  // Units
  router.get("/units", usersController.getAllUnits);
  router.get("/units/:id", usersController.getUnitById);

  return router;
};

export default createUsersRoutes;
