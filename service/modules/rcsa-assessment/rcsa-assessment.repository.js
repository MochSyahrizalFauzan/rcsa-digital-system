/**
 * RCSA Assessment Repository
 * Data access layer for rcsa_assessment and rcsa_review_notes.
 */
const createRcsaAssessmentRepository = (db) => {
  const assessmentValues = (data, userId) => [
    data.rcsa_master_id ?? null,
    data.unit_id ?? null,
    userId,
    data.jenis_risiko ?? null,
    data.potensi_risiko ?? null,
    data.penyebab_risiko ?? null,
    data.dampak_inheren ?? null,
    data.frekuensi_inheren ?? null,
    data.nilai_inheren ?? null,
    data.level_inheren ?? null,
    data.pengendalian ?? null,
    data.dampak_residual ?? null,
    data.kemungkinan_residual ?? null,
    data.nilai_residual ?? null,
    data.level_residual ?? null,
    data.action_plan ?? null,
    data.pic ?? null,
    data.keterangan_user ?? null,
  ];

  const assessmentColumns = `
    rcsa_master_id, unit_id, created_by,
    jenis_risiko, potensi_risiko, penyebab_risiko,
    dampak_inheren, frekuensi_inheren, nilai_inheren, level_inheren,
    pengendalian,
    dampak_residual, kemungkinan_residual, nilai_residual, level_residual,
    action_plan, pic, keterangan_user, status
  `;

  return {
    getConnection: () => db.getConnection(),

    assertMasterPublishedForUnit: async (rcsaMasterId, unitId, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT m.id
         FROM rcsa_master m
         JOIN rcsa_master_units mu ON mu.rcsa_master_id = m.id
         WHERE m.id = ? AND mu.unit_id = ? AND mu.is_active = 1
           AND m.status = 'published'
         LIMIT 1`,
        [rcsaMasterId, unitId]
      );
      return rows.length > 0;
    },

    findSubmitted: async (unitId) => {
      let sql = `
        SELECT ra.*, u.unit_name, u.unit_type,
               rm.rcsa_name, rm.description AS rcsa_description
        FROM rcsa_assessment ra
        JOIN rcsa_master rm ON rm.id = ra.rcsa_master_id
        JOIN units u ON u.id = ra.unit_id
        WHERE ra.status = 'submitted'`;
      const params = [];
      if (unitId) {
        sql += " AND ra.unit_id = ?";
        params.push(unitId);
      }
      sql += " ORDER BY ra.id ASC";
      const [rows] = await db.execute(sql, params);
      return rows;
    },

    findDrafts: async ({ unitId, userId, excludeSubmitted, incompleteOnly }) => {
      let sql = `
        SELECT rmu.rcsa_master_id, rm.rcsa_name,
               rm.description AS keterangan_admin,
               rmu.unit_id, u.unit_name, u.unit_type,
               ra.id AS assessment_id,
               COALESCE(ra.status, 'draft') AS status,
               COALESCE(ra.potensi_risiko, rm.rcsa_name) AS potensi_risiko,
               ra.jenis_risiko, ra.penyebab_risiko,
               ra.dampak_inheren, ra.frekuensi_inheren,
               ra.nilai_inheren, ra.level_inheren,
               ra.pengendalian,
               ra.dampak_residual, ra.kemungkinan_residual,
               ra.nilai_residual, ra.level_residual,
               ra.action_plan, ra.pic, ra.keterangan_user
        FROM rcsa_master_units rmu
        JOIN rcsa_master rm ON rm.id = rmu.rcsa_master_id
        JOIN units u ON u.id = rmu.unit_id
        LEFT JOIN rcsa_assessment ra
          ON ra.rcsa_master_id = rmu.rcsa_master_id
         AND ra.unit_id = rmu.unit_id
         AND ra.created_by = ?
        WHERE rmu.unit_id = ? AND rmu.is_active = 1
          AND rm.status = 'published'`;
      const params = [userId, unitId];

      if (excludeSubmitted === "true") {
        sql += " AND (ra.status IS NULL OR ra.status = 'draft')";
      }
      if (incompleteOnly === "true") {
        sql += `
          AND (
            ra.id IS NULL OR ra.jenis_risiko IS NULL OR ra.jenis_risiko = ''
            OR ra.penyebab_risiko IS NULL OR ra.penyebab_risiko = ''
            OR ra.dampak_inheren IS NULL OR ra.frekuensi_inheren IS NULL
            OR ra.pengendalian IS NULL OR ra.pengendalian = ''
            OR ra.dampak_residual IS NULL
            OR ra.kemungkinan_residual IS NULL
            OR ra.action_plan IS NULL OR ra.action_plan = ''
            OR ra.pic IS NULL OR ra.pic = ''
          )`;
      }
      sql += " ORDER BY rmu.rcsa_master_id ASC";
      const [rows] = await db.execute(sql, params);
      return rows;
    },

    findById: async (id, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT ra.*, rm.id AS master_id, rm.rcsa_name,
                rm.description AS master_desc,
                u.id AS unit_id, u.unit_name, u.unit_type,
                usr.id AS user_id, usr.name AS user_name,
                usr.email AS user_email
         FROM rcsa_assessment ra
         JOIN rcsa_master rm ON ra.rcsa_master_id = rm.id
         JOIN units u ON ra.unit_id = u.id
         JOIN users usr ON ra.created_by = usr.id
         WHERE ra.id = ? LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },

    findExistingByUserAndMaster: async (masterId, unitId, userId, conn = db) => {
      const [rows] = await conn.execute(
        `SELECT id, status, created_by, rcsa_master_id, unit_id
         FROM rcsa_assessment
         WHERE rcsa_master_id = ? AND unit_id = ? AND created_by = ?
         ORDER BY id DESC LIMIT 1`,
        [masterId, unitId, userId]
      );
      return rows[0] || null;
    },

    insertAssessment: async (data, userId, conn = db) => {
      const [result] = await conn.execute(
        `INSERT INTO rcsa_assessment (${assessmentColumns})
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
        assessmentValues(data, userId)
      );
      return result.insertId;
    },

    updateAssessment: async (id, data, conn = db) => {
      await conn.execute(
        `UPDATE rcsa_assessment SET
           potensi_risiko = ?, jenis_risiko = ?, penyebab_risiko = ?,
           dampak_inheren = ?, frekuensi_inheren = ?, nilai_inheren = ?,
           level_inheren = ?, pengendalian = ?, dampak_residual = ?,
           kemungkinan_residual = ?, nilai_residual = ?, level_residual = ?,
           action_plan = ?, pic = ?, keterangan_user = ?, status = 'draft'
         WHERE id = ?`,
        [
          data.potensi_risiko ?? null,
          data.jenis_risiko ?? null,
          data.penyebab_risiko ?? null,
          data.dampak_inheren ?? null,
          data.frekuensi_inheren ?? null,
          data.nilai_inheren ?? null,
          data.level_inheren ?? null,
          data.pengendalian ?? null,
          data.dampak_residual ?? null,
          data.kemungkinan_residual ?? null,
          data.nilai_residual ?? null,
          data.level_residual ?? null,
          data.action_plan ?? null,
          data.pic ?? null,
          data.keterangan_user ?? null,
          id,
        ]
      );
    },

    updateStatus: async (id, status, conn = db) => {
      const [result] = await conn.execute(
        "UPDATE rcsa_assessment SET status = ? WHERE id = ?",
        [status, id]
      );
      return result;
    },

    findReviewQueue: async () => {
      const [rows] = await db.execute(`
        SELECT ra.id, ra.status, ra.created_at, ra.updated_at,
               ra.potensi_risiko, ra.jenis_risiko, ra.penyebab_risiko,
               ra.pengendalian, ra.action_plan, ra.pic, ra.keterangan_user,
               ra.dampak_inheren, ra.frekuensi_inheren, ra.nilai_inheren,
               ra.level_inheren, ra.dampak_residual,
               ra.kemungkinan_residual, ra.nilai_residual, ra.level_residual,
               u.unit_name, u.unit_type,
               usr.name AS created_by_name, usr.user_id AS created_by_user_id,
               rm.rcsa_name, rm.description AS rcsa_description
        FROM rcsa_assessment ra
        JOIN units u ON u.id = ra.unit_id
        JOIN users usr ON usr.id = ra.created_by
        JOIN rcsa_master rm ON rm.id = ra.rcsa_master_id
        WHERE ra.status = 'submitted'
        ORDER BY ra.updated_at DESC`);
      return rows;
    },

    insertReviewNote: async ({ assessmentId, reviewerId, note, decision }, conn = db) => {
      const [result] = await conn.execute(
        `INSERT INTO rcsa_review_notes
           (assessment_id, reviewer_id, note, decision)
         VALUES (?, ?, ?, ?)`,
        [assessmentId, reviewerId, note, decision]
      );
      return result.insertId;
    },

    findReviewNotesByAssessmentId: async (assessmentId) => {
      const [rows] = await db.execute(
        `SELECT rn.*, u.name AS reviewer_name
         FROM rcsa_review_notes rn
         LEFT JOIN users u ON u.id = rn.reviewer_id
         WHERE rn.assessment_id = ?
         ORDER BY rn.created_at DESC`,
        [assessmentId]
      );
      return rows;
    },

    findAllReviewed: async () => {
      const [rows] = await db.execute(`
        SELECT ra.id AS assessment_id, ra.potensi_risiko,
               u.unit_name, u.unit_type, ra.created_at, ra.updated_at,
               ra.created_by AS created_by_user_id, cu.name AS created_by_name,
               rn.decision, rn.note, rn.created_at AS reviewed_at,
               rv.name AS reviewer_name
        FROM rcsa_assessment ra
        JOIN units u ON u.id = ra.unit_id
        LEFT JOIN users cu ON cu.id = ra.created_by
        LEFT JOIN rcsa_review_notes rn ON rn.id = (
          SELECT rn2.id FROM rcsa_review_notes rn2
          WHERE rn2.assessment_id = ra.id
          ORDER BY rn2.created_at DESC LIMIT 1
        )
        LEFT JOIN users rv ON rv.id = rn.reviewer_id
        WHERE ra.status = 'reviewed'
        ORDER BY ra.updated_at DESC`);
      return rows;
    },

    findReportReviewed: async (unitId) => {
      let sql = `
        SELECT ra.*, un.unit_name, un.unit_type,
               rn.decision, rn.note, rv.name AS reviewer_name,
               rn.created_at AS reviewed_at
        FROM rcsa_assessment ra
        JOIN units un ON un.id = ra.unit_id
        LEFT JOIN rcsa_review_notes rn ON rn.id = (
          SELECT rn2.id FROM rcsa_review_notes rn2
          WHERE rn2.assessment_id = ra.id
          ORDER BY rn2.created_at DESC LIMIT 1
        )
        LEFT JOIN users rv ON rv.id = rn.reviewer_id
        WHERE ra.status = 'reviewed'`;
      const params = [];
      if (unitId) {
        sql += " AND ra.unit_id = ?";
        params.push(unitId);
      }
      sql += " ORDER BY ra.updated_at DESC";
      const [rows] = await db.execute(sql, params);
      return rows;
    },

    findMineReviewed: async (userId) => {
      const [rows] = await db.execute(
        `SELECT ra.*, rm.rcsa_name, u.unit_name, u.unit_type,
                rn.decision, rn.note, rn.created_at AS reviewed_at,
                rv.name AS reviewer_name
         FROM rcsa_assessment ra
         JOIN rcsa_master rm ON rm.id = ra.rcsa_master_id
         JOIN units u ON u.id = ra.unit_id
         LEFT JOIN rcsa_review_notes rn ON rn.id = (
           SELECT rn2.id FROM rcsa_review_notes rn2
           WHERE rn2.assessment_id = ra.id
           ORDER BY rn2.created_at DESC LIMIT 1
         )
         LEFT JOIN users rv ON rv.id = rn.reviewer_id
         WHERE ra.created_by = ? AND ra.status = 'reviewed'
         ORDER BY ra.updated_at DESC`,
        [userId]
      );
      return rows;
    },
  };
};

export default createRcsaAssessmentRepository;
