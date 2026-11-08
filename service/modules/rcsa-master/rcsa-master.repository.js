/**
 * RCSA Master Repository
 * Data access layer for rcsa_master, rcsa_master_units, and rcsa_master_approvals
 */
const createRcsaMasterRepository = (db) => {
  return {
    /**
     * Get database connection for manual transaction management
     */
    getConnection: async () => {
      return await db.getConnection();
    },

    /**
     * Find master by ID
     */
    findById: async (id, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT id, rcsa_name, description, status, created_by, created_at,
                submitted_at, submitted_by, approved_at, approved_by
         FROM rcsa_master
         WHERE id = ?
         LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },

    /**
     * Get detail of assigned target units for a master
     */
    findTargetUnitsByMasterId: async (masterId, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT u.id, u.unit_name, u.unit_type, rmu.is_active, rmu.assigned_at
         FROM rcsa_master_units rmu
         JOIN units u ON u.id = rmu.unit_id
         WHERE rmu.rcsa_master_id = ?
         ORDER BY u.unit_name ASC`,
        [masterId]
      );
      return rows;
    },

    /**
     * Get units that have already created assessments for this master
     */
    findUsedByUnitsByMasterId: async (masterId, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT
           u.id,
           u.unit_name,
           u.unit_type,
           COUNT(ra.id) AS used_assessment_count,
           MAX(ra.updated_at) AS last_used_at
         FROM rcsa_assessment ra
         JOIN units u ON u.id = ra.unit_id
         WHERE ra.rcsa_master_id = ?
         GROUP BY u.id, u.unit_name, u.unit_type
         ORDER BY u.unit_name ASC`,
        [masterId]
      );
      return rows;
    },

    /**
     * Count existing assessments for a master
     */
    countAssessmentsByMasterId: async (masterId, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT COUNT(*) AS cnt FROM rcsa_assessment WHERE rcsa_master_id = ?`,
        [masterId]
      );
      return rows[0]?.cnt || 0;
    },

    /**
     * Count target units for a master
     */
    countTargetUnitsByMasterId: async (masterId, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT COUNT(*) AS cnt FROM rcsa_master_units WHERE rcsa_master_id = ?`,
        [masterId]
      );
      return rows[0]?.cnt || 0;
    },

    /**
     * List all master risks with metrics and latest approval status
     */
    findAllWithSummary: async () => {
      const [rows] = await db.execute(`
        SELECT
          m.id,
          m.rcsa_name,
          m.description,
          m.status,
          m.created_at,
          u.name AS created_by_name,

          (SELECT COUNT(*) FROM rcsa_master_units mu WHERE mu.rcsa_master_id = m.id) AS target_units,
          (SELECT COUNT(*) FROM rcsa_assessment a WHERE a.rcsa_master_id = m.id) AS used_count,

          (
            SELECT a2.decision
            FROM rcsa_master_approvals a2
            WHERE a2.rcsa_master_id = m.id
            ORDER BY a2.decided_at DESC, a2.created_at DESC
            LIMIT 1
          ) AS last_decision,

          (
            SELECT a2.note
            FROM rcsa_master_approvals a2
            WHERE a2.rcsa_master_id = m.id
            ORDER BY a2.decided_at DESC, a2.created_at DESC
            LIMIT 1
          ) AS last_note,

          (
            SELECT a2.decided_at
            FROM rcsa_master_approvals a2
            WHERE a2.rcsa_master_id = m.id
            ORDER BY a2.decided_at DESC, a2.created_at DESC
            LIMIT 1
          ) AS last_decided_at

        FROM rcsa_master m
        LEFT JOIN users u ON m.created_by = u.id
        ORDER BY m.created_at DESC
      `);
      return rows;
    },

    /**
     * Find active & published master risks for a specific unit
     */
    findActiveByUnitId: async (unitId) => {
      const [rows] = await db.execute(
        `SELECT m.id, m.rcsa_name, m.description, u.unit_name
         FROM rcsa_master_units mu
         JOIN rcsa_master m ON m.id = mu.rcsa_master_id
         JOIN units u ON u.id = mu.unit_id
         WHERE mu.unit_id = ?
           AND mu.is_active = 1
           AND m.status = 'published'
         ORDER BY m.id ASC`,
        [unitId]
      );
      return rows;
    },

    /**
     * Find master risks assigned to a unit ID
     */
    findByUnitId: async (unitId) => {
      const [rows] = await db.execute(
        `SELECT m.id, m.rcsa_name, m.description, mu.is_active, m.status
         FROM rcsa_master_units mu
         JOIN rcsa_master m ON m.id = mu.rcsa_master_id
         WHERE mu.unit_id = ?
         ORDER BY m.id DESC`,
        [unitId]
      );
      return rows;
    },

    /**
     * Insert master record
     */
    createMaster: async ({ rcsa_name, description, created_by }, conn = db) => {
      const [result] = await conn.execute(
        `INSERT INTO rcsa_master (rcsa_name, description, created_by, status)
         VALUES (?, ?, ?, 'draft')`,
        [rcsa_name, description || null, created_by]
      );
      return result.insertId;
    },

    /**
     * Update master basic information
     */
    updateMaster: async (id, { rcsa_name, description }, conn = db) => {
      const [result] = await conn.execute(
        `UPDATE rcsa_master SET rcsa_name = ?, description = ? WHERE id = ?`,
        [rcsa_name, description || null, id]
      );
      return result;
    },

    /**
     * Delete master and its unit mappings
     */
    deleteMasterWithUnits: async (id, conn = db) => {
      await conn.execute("DELETE FROM rcsa_master_units WHERE rcsa_master_id = ?", [id]);
      const [result] = await conn.execute("DELETE FROM rcsa_master WHERE id = ?", [id]);
      return result;
    },

    /**
     * Assign units to master
     */
    assignUnits: async (masterId, unitIds, isActive = 0, conn = db) => {
      await conn.execute("DELETE FROM rcsa_master_units WHERE rcsa_master_id = ?", [masterId]);
      for (const uid of unitIds) {
        await conn.execute(
          `INSERT INTO rcsa_master_units (rcsa_master_id, unit_id, is_active)
           VALUES (?, ?, ?)`,
          [masterId, uid, isActive ? 1 : 0]
        );
      }
    },

    /**
     * Update master status
     */
    updateStatus: async (id, status, conn = db) => {
      const [result] = await conn.execute(
        `UPDATE rcsa_master SET status = ? WHERE id = ?`,
        [status, id]
      );
      return result;
    },

    /**
     * Archive master and deactivate units
     */
    archiveMaster: async (id, conn = db) => {
      await conn.execute(`UPDATE rcsa_master SET status = 'archived' WHERE id = ?`, [id]);
      await conn.execute(`UPDATE rcsa_master_units SET is_active = 0 WHERE rcsa_master_id = ?`, [id]);
    },

    /**
     * Submit master for approval
     */
    submitForApproval: async (id, submittedByUserId, conn = db) => {
      await conn.execute(`DELETE FROM rcsa_master_approvals WHERE rcsa_master_id = ?`, [id]);
      await conn.execute(
        `INSERT INTO rcsa_master_approvals (rcsa_master_id, step_order, role_id, approver_user_id, decision)
         VALUES (?, 1, NULL, NULL, 'pending')`,
        [id]
      );
      await conn.execute(
        `UPDATE rcsa_master
         SET status = 'pending_approval', submitted_at = NOW(), submitted_by = ?
         WHERE id = ?`,
        [submittedByUserId, id]
      );
    },

    /**
     * Get pending approvals inbox
     */
    findApprovalInbox: async () => {
      const [rows] = await db.execute(`
        SELECT
          a.id AS approval_id,
          m.id,
          m.rcsa_name,
          m.description,
          m.status,
          m.created_at,
          u.name AS created_by_name,
          a.step_order,
          'Approver' AS required_role,
          a.approver_user_id,

          (SELECT COUNT(*)
           FROM rcsa_master_units mu
           WHERE mu.rcsa_master_id = m.id) AS target_unit_count,

          (SELECT GROUP_CONCAT(un.unit_name ORDER BY un.unit_name SEPARATOR ', ')
           FROM rcsa_master_units mu
           JOIN units un ON un.id = mu.unit_id
           WHERE mu.rcsa_master_id = m.id) AS target_units

        FROM rcsa_master m
        JOIN rcsa_master_approvals a ON a.rcsa_master_id = m.id
        LEFT JOIN users u ON u.id = m.created_by
        WHERE m.status = 'pending_approval'
          AND a.decision = 'pending'
        ORDER BY m.created_at DESC
      `);
      return rows;
    },

    /**
     * Find latest pending approval step for master
     */
    findPendingApprovalStep: async (masterId, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT id, approver_user_id
         FROM rcsa_master_approvals
         WHERE rcsa_master_id = ? AND decision = 'pending'
         ORDER BY step_order ASC
         LIMIT 1`,
        [masterId]
      );
      return rows[0] || null;
    },

    /**
     * Claim approval step by approver
     */
    claimApprovalStep: async (approvalId, approverUserId, conn = db) => {
      const [result] = await conn.execute(
        `UPDATE rcsa_master_approvals
         SET approver_user_id = ?
         WHERE id = ? AND approver_user_id IS NULL`,
        [approverUserId, approvalId]
      );
      return result.affectedRows > 0;
    },

    /**
     * Record approval decision (approved or rejected)
     */
    recordApprovalDecision: async ({ approvalId, masterId, decision, note, reviewerId }, conn = db) => {
      await conn.execute(
        `UPDATE rcsa_master_approvals
         SET decision = ?, note = ?, reviewer_id = ?, decided_at = NOW()
         WHERE id = ?`,
        [decision, note, reviewerId, approvalId]
      );

      if (decision === "rejected") {
        await conn.execute(
          `UPDATE rcsa_master
           SET status = 'rejected', approved_at = NULL, approved_by = NULL
           WHERE id = ?`,
          [masterId]
        );
      } else {
        await conn.execute(
          `UPDATE rcsa_master
           SET status = 'approved', approved_at = NOW(), approved_by = ?
           WHERE id = ?`,
          [reviewerId, masterId]
        );
      }
    },

    /**
     * Publish master and activate its assigned units
     */
    publishMaster: async (masterId, conn = db) => {
      await conn.execute(
        `UPDATE rcsa_master_units
         SET is_active = 1, assigned_at = NOW()
         WHERE rcsa_master_id = ?`,
        [masterId]
      );
      await conn.execute(
        `UPDATE rcsa_master
         SET status = 'published'
         WHERE id = ?`,
        [masterId]
      );
    },
  };
};

export default createRcsaMasterRepository;
