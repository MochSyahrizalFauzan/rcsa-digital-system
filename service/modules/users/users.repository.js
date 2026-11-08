const createUsersRepository = (db) => {
  return {
    /**
     * Retrieve all users joined with roles, units, and permissions
     */
    findAllUsers: async () => {
      const [rows] = await db.execute(`
        SELECT
          u.id,
          u.user_id,
          u.name,
          u.email,
          u.unit_id,
          u.role_id,
          u.status,
          r.role_name,
          un.unit_name,
          rp.can_create,
          rp.can_read,
          rp.can_view,
          rp.can_update,
          rp.can_approve,
          rp.can_delete,
          rp.can_provision
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN units un ON u.unit_id = un.id
        ORDER BY u.id ASC
      `);
      return rows;
    },

    /**
     * Find a user by primary key ID along with role
     */
    findUserByIdWithRole: async (id) => {
      const [rows] = await db.execute(
        `SELECT u.id, u.user_id, u.name, u.email, u.unit_id, u.role_id, u.status, r.role_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.id = ?
         LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },

    /**
     * Find a user by user_id string
     */
    findUserByUserId: async (userId) => {
      const [rows] = await db.execute(
        `SELECT id, user_id FROM users WHERE user_id = ? LIMIT 1`,
        [userId]
      );
      return rows[0] || null;
    },

    /**
     * Insert a new user
     */
    createUser: async ({ user_id, name, email, password, unit_id, role_id, status }) => {
      const [result] = await db.execute(
        `INSERT INTO users (user_id, name, email, password, unit_id, role_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, name, email || null, password, unit_id, role_id, status || "active"]
      );
      return result;
    },

    /**
     * Update user status (active / inactive)
     */
    updateUserStatus: async (id, status) => {
      const [result] = await db.execute(
        `UPDATE users SET status = ? WHERE id = ?`,
        [status, id]
      );
      return result;
    },

    /**
     * Retrieve all roles with their permissions
     */
    findAllRoles: async () => {
      const [rows] = await db.execute(`
        SELECT
          r.id,
          r.role_name,
          r.description,
          rp.can_create,
          rp.can_read,
          rp.can_view,
          rp.can_update,
          rp.can_approve,
          rp.can_delete,
          rp.can_provision
        FROM roles r
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        ORDER BY r.id ASC
      `);
      return rows;
    },

    /**
     * Find permissions for a specific role ID
     */
    findRolePermissions: async (roleId) => {
      const [rows] = await db.execute(
        `SELECT can_create, can_read, can_view, can_update, can_approve, can_delete, can_provision
         FROM role_permissions
         WHERE role_id = ?
         LIMIT 1`,
        [roleId]
      );
      return rows[0] || {};
    },

    /**
     * Retrieve login/logout audit trail
     */
    findAllUserLogins: async () => {
      const [rows] = await db.execute(`
        SELECT
          ul.id,
          ul.user_id,
          u.name AS user_name,
          u.email,
          ul.login_time,
          ul.logout_time,
          ul.ip_address,
          ul.user_agent,
          ul.role_name,
          ul.unit_name,
          u.status
        FROM user_logins ul
        JOIN users u ON ul.user_id = u.id
        ORDER BY ul.login_time DESC
      `);
      return rows;
    },

    /**
     * Retrieve units with optional parent_id filtering
     */
    findAllUnits: async (parentId) => {
      let query = `SELECT id, unit_name, unit_type, parent_id FROM units`;
      const params = [];

      if (parentId === "null") {
        query += ` WHERE parent_id IS NULL`;
      } else if (parentId) {
        query += ` WHERE parent_id = ?`;
        params.push(parentId);
      }

      query += `
        ORDER BY
          CASE
            WHEN unit_name = 'Kantor Pusat' THEN 0
            ELSE 1
          END,
          unit_name ASC
      `;

      const [rows] = await db.execute(query, params);
      return rows;
    },

    /**
     * Find single unit by ID
     */
    findUnitById: async (id) => {
      const [rows] = await db.execute(
        `SELECT id, unit_name, unit_type, parent_id FROM units WHERE id = ? LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },
  };
};

export default createUsersRepository;
