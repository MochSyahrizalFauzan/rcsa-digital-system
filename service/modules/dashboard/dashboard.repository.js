/**
 * Dashboard Repository
 * Aggregations and metrics for macro management monitoring
 */
const createDashboardRepository = (db) => {
  return {
    /**
     * Get statistics for RCSA masters grouped by status
     */
    getMasterStats: async () => {
      const [rows] = await db.execute(`
        SELECT status, COUNT(*) AS cnt
        FROM rcsa_master
        GROUP BY status
      `);
      return rows;
    },

    /**
     * Get assessment statistics (draft, submitted, reviewed counts)
     */
    getAssessmentStats: async () => {
      const [rows] = await db.execute(`
        SELECT
          COALESCE(SUM(CASE WHEN status='draft' THEN 1 ELSE 0 END), 0) AS draft,
          COALESCE(SUM(CASE WHEN status='submitted' THEN 1 ELSE 0 END), 0) AS submitted,
          COALESCE(SUM(CASE WHEN status='reviewed' THEN 1 ELSE 0 END), 0) AS reviewed
        FROM rcsa_assessment
      `);
      return rows[0] || { draft: 0, submitted: 0, reviewed: 0 };
    },

    /**
     * Get coverage metrics for published masters and active units
     */
    getCoverage: async () => {
      const [rows] = await db.execute(`
        SELECT
          COUNT(*) AS total_assignments,
          COALESCE(SUM(CASE WHEN subq.has_submitted = 1 THEN 1 ELSE 0 END), 0) AS done,
          COALESCE(SUM(CASE WHEN subq.has_submitted = 0 AND subq.has_draft = 1 THEN 1 ELSE 0 END), 0) AS draft,
          COALESCE(SUM(CASE WHEN subq.has_any = 0 THEN 1 ELSE 0 END), 0) AS missing
        FROM (
          SELECT
            mu.rcsa_master_id,
            mu.unit_id,

            EXISTS(
              SELECT 1
              FROM rcsa_assessment ra
              WHERE ra.rcsa_master_id = mu.rcsa_master_id
                AND ra.unit_id = mu.unit_id
                AND ra.status IN ('submitted','reviewed')
              LIMIT 1
            ) AS has_submitted,

            EXISTS(
              SELECT 1
              FROM rcsa_assessment ra
              WHERE ra.rcsa_master_id = mu.rcsa_master_id
                AND ra.unit_id = mu.unit_id
                AND ra.status = 'draft'
              LIMIT 1
            ) AS has_draft,

            EXISTS(
              SELECT 1
              FROM rcsa_assessment ra
              WHERE ra.rcsa_master_id = mu.rcsa_master_id
                AND ra.unit_id = mu.unit_id
              LIMIT 1
            ) AS has_any

          FROM rcsa_master_units mu
          JOIN rcsa_master m ON m.id = mu.rcsa_master_id
          WHERE mu.is_active = 1
            AND m.status = 'published'
        ) subq
      `);
      return rows[0] || { total_assignments: 0, done: 0, draft: 0, missing: 0 };
    },

    /**
     * Get missing submissions grouped by master
     */
    getMissingByMaster: async (limit = 20) => {
      const [rows] = await db.execute(`
        SELECT
          m.id AS master_id,
          m.rcsa_name,
          m.created_at,
          COUNT(mu.unit_id) AS assigned_units,

          SUM(
            CASE
              WHEN EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = m.id
                  AND ra.unit_id = mu.unit_id
                  AND ra.status IN ('submitted','reviewed')
                LIMIT 1
              ) THEN 1 ELSE 0
            END
          ) AS submitted_units,

          SUM(
            CASE
              WHEN NOT EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = m.id
                  AND ra.unit_id = mu.unit_id
                  AND ra.status IN ('submitted','reviewed')
                LIMIT 1
              )
              AND EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = m.id
                  AND ra.unit_id = mu.unit_id
                  AND ra.status = 'draft'
                LIMIT 1
              ) THEN 1 ELSE 0
            END
          ) AS draft_units,

          SUM(
            CASE
              WHEN EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = m.id
                  AND ra.unit_id = mu.unit_id
                LIMIT 1
              ) THEN 0 ELSE 1
            END
          ) AS missing_units,

          GROUP_CONCAT(
            CASE
              WHEN NOT EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = m.id
                  AND ra.unit_id = mu.unit_id
                  AND ra.status IN ('submitted','reviewed')
                LIMIT 1
              )
              THEN u.unit_name
            END
            ORDER BY u.unit_name SEPARATOR ', '
          ) AS not_submitted_unit_names

        FROM rcsa_master m
        JOIN rcsa_master_units mu ON mu.rcsa_master_id = m.id AND mu.is_active = 1
        JOIN units u ON u.id = mu.unit_id
        WHERE m.status = 'published'
        GROUP BY m.id, m.rcsa_name, m.created_at
        ORDER BY missing_units DESC, m.created_at DESC
        LIMIT ${Number(limit)}
      `);
      return rows;
    },

    /**
     * Get unit progress ranking
     */
    getUnitProgress: async (limit = 20) => {
      const [rows] = await db.execute(`
        SELECT
          u.id AS unit_id,
          u.unit_name,
          u.unit_type,

          COUNT(mu.rcsa_master_id) AS assigned_masters,

          SUM(
            CASE
              WHEN EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = mu.rcsa_master_id
                  AND ra.unit_id = u.id
                  AND ra.status IN ('submitted','reviewed')
                LIMIT 1
              ) THEN 1 ELSE 0
            END
          ) AS submitted,

          SUM(
            CASE
              WHEN NOT EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = mu.rcsa_master_id
                  AND ra.unit_id = u.id
                  AND ra.status IN ('submitted','reviewed')
                LIMIT 1
              )
              AND EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = mu.rcsa_master_id
                  AND ra.unit_id = u.id
                  AND ra.status = 'draft'
                LIMIT 1
              ) THEN 1 ELSE 0
            END
          ) AS draft,

          SUM(
            CASE
              WHEN EXISTS(
                SELECT 1 FROM rcsa_assessment ra
                WHERE ra.rcsa_master_id = mu.rcsa_master_id
                  AND ra.unit_id = u.id
                LIMIT 1
              ) THEN 0 ELSE 1
            END
          ) AS missing

        FROM units u
        JOIN rcsa_master_units mu
          ON mu.unit_id = u.id
         AND mu.is_active = 1

        JOIN rcsa_master m
          ON m.id = mu.rcsa_master_id
         AND m.status = 'published'

        GROUP BY u.id, u.unit_name, u.unit_type
        ORDER BY missing DESC, u.unit_name ASC
        LIMIT ${Number(limit)}
      `);
      return rows;
    },

    /**
     * Get recent user logins
     */
    getRecentLogins: async (limit = 10) => {
      const [rows] = await db.execute(`
        SELECT
          ul.id,
          ul.user_id,
          u.name AS user_name,
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
        LIMIT ${Number(limit)}
      `);
      return rows;
    },

    /**
     * Get pending approvals inbox queue
     */
    getApprovalQueue: async (limit = 20) => {
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
          a.approver_user_id
        FROM rcsa_master m
        JOIN rcsa_master_approvals a ON a.rcsa_master_id = m.id
        LEFT JOIN users u ON u.id = m.created_by
        WHERE m.status = 'pending_approval'
          AND a.decision = 'pending'
        ORDER BY m.created_at DESC
        LIMIT ${Number(limit)}
      `);
      return rows;
    },

    /**
     * Get submitted assessments review queue
     */
    getReviewQueue: async (limit = 20) => {
      const [rows] = await db.execute(`
        SELECT
          ra.id,
          ra.status,
          ra.updated_at,
          ra.potensi_risiko,
          un.unit_name,
          un.unit_type,
          usr.name AS created_by_name,
          usr.user_id AS created_by_user_id
        FROM rcsa_assessment ra
        JOIN units un ON un.id = ra.unit_id
        JOIN users usr ON usr.id = ra.created_by
        WHERE ra.status = 'submitted'
        ORDER BY ra.updated_at DESC
        LIMIT ${Number(limit)}
      `);
      return rows;
    },
  };
};

export default createDashboardRepository;
