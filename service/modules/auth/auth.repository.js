const createAuthRepository = (db) => {
  return {
    /**
     * Find user with role and unit details by user_id string
     * @param {string} userId
     */
    findUserByUserId: async (userId) => {
      const [rows] = await db.execute(
        `SELECT u.*, r.role_name, un.unit_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         LEFT JOIN units un ON u.unit_id = un.id
         WHERE u.user_id = ?
         LIMIT 1`,
        [userId]
      );
      return rows[0] || null;
    },

    /**
     * Find user with role and unit details by primary key ID
     * @param {number} id
     */
    findUserById: async (id) => {
      const [rows] = await db.execute(
        `SELECT u.*, r.role_name, un.unit_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         LEFT JOIN units un ON u.unit_id = un.id
         WHERE u.id = ?
         LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },

    /**
     * Find minimal profile by primary key ID
     * @param {number} id
     */
    findProfileById: async (id) => {
      const [rows] = await db.execute(
        `SELECT id, user_id, name, email, role_id, unit_id, status
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },

    /**
     * Find permissions for a given role_id
     * @param {number} roleId
     */
    findPermissionsByRoleId: async (roleId) => {
      const [rows] = await db.execute(
        `SELECT can_create, can_read, can_view, can_update, can_approve, can_delete, can_provision
         FROM role_permissions
         WHERE role_id = ?
         LIMIT 1`,
        [roleId]
      );
      const p = rows[0] || {};
      return {
        can_create: Boolean(p.can_create),
        can_read: Boolean(p.can_read),
        can_view: Boolean(p.can_view),
        can_update: Boolean(p.can_update),
        can_approve: Boolean(p.can_approve),
        can_delete: Boolean(p.can_delete),
        can_provision: Boolean(p.can_provision),
      };
    },

    /**
     * Record an audit trail login entry
     */
    recordUserLogin: async ({ userId, ipAddress, userAgent, success, roleName, unitName }) => {
      await db.execute(
        `INSERT INTO user_logins (user_id, ip_address, user_agent, success, role_name, unit_name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, ipAddress, userAgent, success ? 1 : 0, roleName || null, unitName || null]
      );
    },

    /**
     * Record user logout timestamp for the latest active login session
     */
    recordUserLogout: async (userId) => {
      await db.execute(
        `UPDATE user_logins
         SET logout_time = NOW()
         WHERE user_id = ? AND logout_time IS NULL
         ORDER BY login_time DESC
         LIMIT 1`,
        [userId]
      );
    },
  };
};

export default createAuthRepository;
