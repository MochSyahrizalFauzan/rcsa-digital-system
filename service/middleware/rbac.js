import pool from "../config/database.js";

/**
 * Middleware to fetch and attach user permissions from role_permissions table
 * @param {object} [dbInstance] - Optional mysql2 connection or pool
 */
export const attachPermissions = (dbInstance) => {
  const db = dbInstance || pool;

  return async (req, res, next) => {
    try {
      const roleId = req.user?.role_id;
      if (!roleId) {
        return res.status(401).json({ message: "Role pengguna tidak ditemukan" });
      }

      const [rows] = await db.execute(
        `SELECT can_create, can_read, can_view, can_update, can_approve, can_delete, can_provision
         FROM role_permissions
         WHERE role_id = ?
         LIMIT 1`,
        [roleId]
      );

      const p = rows?.[0] || {};
      req.perms = {
        can_create: Boolean(p.can_create),
        can_read: Boolean(p.can_read),
        can_view: Boolean(p.can_view),
        can_update: Boolean(p.can_update),
        can_approve: Boolean(p.can_approve),
        can_delete: Boolean(p.can_delete),
        can_provision: Boolean(p.can_provision),
      };

      next();
    } catch (err) {
      console.error("attachPermissions error:", err);
      return res.status(500).json({ message: "Gagal memproses hak akses pengguna" });
    }
  };
};

/**
 * Authorize specific permission key
 * e.g. authorizePerm("can_create") or authorizePerm("can_provision")
 * @param {string} permKey
 */
export const authorizePerm = (permKey) => (req, res, next) => {
  if (!req.perms?.[permKey]) {
    return res.status(403).json({ message: "Forbidden: Anda tidak memiliki akses untuk tindakan ini" });
  }
  next();
};

/**
 * Alias for authorizePerm for Clean Architecture naming convention
 */
export const requirePermission = authorizePerm;

/**
 * Authorize by role ID or Role Name
 * e.g. authorizeRoles(1, 2) or authorizeRoles("Project Manager", "Risk Officer")
 * @param  {...(number|string)} allowedRoles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role_id;
    const userRoleName = req.user?.role_name;

    const isAllowed = allowedRoles.some((role) => {
      if (typeof role === "number") {
        return role === userRole;
      }
      if (typeof role === "string") {
        return role.toLowerCase() === userRoleName?.toLowerCase();
      }
      return false;
    });

    if (!isAllowed) {
      return res.status(403).json({ message: "Forbidden: Role Anda tidak diizinkan mengakses fitur ini" });
    }
    next();
  };
};

export const requireRoles = authorizeRoles;

export default {
  attachPermissions,
  authorizePerm,
  requirePermission,
  authorizeRoles,
  requireRoles,
};
