/**
 * Risks Repository
 * Data access layer for general risk register (table: risks)
 */
const createRisksRepository = (db) => {
  return {
    /**
     * Retrieve all risks with owner, role, and unit
     */
    findAll: async () => {
      const [rows] = await db.execute(`
        SELECT r.*, rs.role_name AS jabatan, u.unit_id,
              un.unit_name AS unit_kerja, u.name AS pemilik_nama
        FROM risks r
        LEFT JOIN users u ON r.pemilik_risiko = u.id
        LEFT JOIN roles rs ON u.role_id = rs.id
        LEFT JOIN units un ON u.unit_id = un.id
        ORDER BY r.id DESC
      `);
      return rows;
    },

    /**
     * Find single risk by ID
     */
    findById: async (id) => {
      const [rows] = await db.execute(`SELECT * FROM risks WHERE id = ? LIMIT 1`, [id]);
      return rows[0] || null;
    },

    /**
     * Insert new risk
     */
    create: async (data) => {
      const [result] = await db.execute(
        `INSERT INTO risks (
          kategori_risiko, jenis_risiko, skenario_risiko, root_cause, dampak,
          dampak_keuangan, tingkat_dampak_keuangan, dampak_operasional, tingkat_dampak_operasional,
          dampak_reputasi, tingkat_dampak_reputasi, dampak_regulasi, tingkat_dampak_regulasi,
          skor_kemungkinan, tingkat_kemungkinan, nilai_risiko, tingkat_risiko,
          rencana_penanganan, deskripsi_rencana_penanganan, risiko_residual,
          kriteria_penerimaan_risiko, pemilik_risiko
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.kategori_risiko ?? null,
          data.jenis_risiko ?? null,
          data.skenario_risiko ?? null,
          data.root_cause ?? null,
          data.dampak ?? null,
          data.dampak_keuangan ?? null,
          data.tingkat_dampak_keuangan ?? null,
          data.dampak_operasional ?? null,
          data.tingkat_dampak_operasional ?? null,
          data.dampak_reputasi ?? null,
          data.tingkat_dampak_reputasi ?? null,
          data.dampak_regulasi ?? null,
          data.tingkat_dampak_regulasi ?? null,
          data.skor_kemungkinan ?? null,
          data.tingkat_kemungkinan ?? null,
          data.nilai_risiko ?? null,
          data.tingkat_risiko ?? null,
          data.rencana_penanganan ?? null,
          data.deskripsi_rencana_penanganan ?? null,
          data.risiko_residual ?? null,
          data.kriteria_penerimaan_risiko ?? null,
          data.pemilik_risiko ?? null,
        ]
      );
      return result.insertId;
    },

    /**
     * Update existing risk
     */
    update: async (id, data) => {
      const safe = (v) => (v !== undefined ? v : null);
      await db.execute(
        `UPDATE risks SET
          kategori_risiko=?, jenis_risiko=?, skenario_risiko=?, root_cause=?, dampak=?,
          dampak_keuangan=?, tingkat_dampak_keuangan=?, dampak_operasional=?, tingkat_dampak_operasional=?,
          dampak_reputasi=?, tingkat_dampak_reputasi=?, dampak_regulasi=?, tingkat_dampak_regulasi=?,
          skor_kemungkinan=?, tingkat_kemungkinan=?, nilai_risiko=?, tingkat_risiko=?,
          rencana_penanganan=?, deskripsi_rencana_penanganan=?, risiko_residual=?,
          kriteria_penerimaan_risiko=?, pemilik_risiko=?
        WHERE id=?`,
        [
          safe(data.kategori_risiko),
          safe(data.jenis_risiko),
          safe(data.skenario_risiko),
          safe(data.root_cause),
          safe(data.dampak),
          safe(data.dampak_keuangan),
          safe(data.tingkat_dampak_keuangan),
          safe(data.dampak_operasional),
          safe(data.tingkat_dampak_operasional),
          safe(data.dampak_reputasi),
          safe(data.tingkat_dampak_reputasi),
          safe(data.dampak_regulasi),
          safe(data.tingkat_dampak_regulasi),
          safe(data.skor_kemungkinan),
          safe(data.tingkat_kemungkinan),
          safe(data.nilai_risiko),
          safe(data.tingkat_risiko),
          safe(data.rencana_penanganan),
          safe(data.deskripsi_rencana_penanganan),
          safe(data.risiko_residual),
          safe(data.kriteria_penerimaan_risiko),
          safe(data.pemilik_risiko),
          id,
        ]
      );
    },

    /**
     * Delete risk by ID
     */
    delete: async (id) => {
      const [result] = await db.execute(`DELETE FROM risks WHERE id=?`, [id]);
      return result;
    },

    /**
     * Find risk masters
     */
    findMasters: async () => {
      const [rows] = await db.execute(
        `SELECT id, kategori_risiko, jenis_risiko, skenario_risiko, pemilik_risiko, status, created_at
         FROM risks
         WHERE (nilai_risiko IS NULL AND rencana_penanganan IS NULL) OR status = 'draft'
         ORDER BY created_at DESC`
      );
      return rows;
    },

    /**
     * Create risk master
     */
    createMaster: async ({ kategori_risiko, jenis_risiko, skenario_risiko, pemilik_risiko, status, userId }) => {
      const [result] = await db.execute(
        `INSERT INTO risks (
          kategori_risiko, jenis_risiko, skenario_risiko,
          pemilik_risiko, status, last_updated_by
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          kategori_risiko,
          jenis_risiko || null,
          skenario_risiko || null,
          pemilik_risiko || null,
          status || "draft",
          userId,
        ]
      );
      return result.insertId;
    },

    /**
     * Generate risk for unit from master
     */
    generateRisk: async (masterId, pemilik_risiko) => {
      const [masters] = await db.execute(
        `SELECT kategori_risiko, jenis_risiko, skenario_risiko FROM risks WHERE id = ?`,
        [masterId]
      );
      if (!masters.length) return null;

      const m = masters[0];
      const [result] = await db.execute(
        `INSERT INTO risks (
          kategori_risiko, jenis_risiko, skenario_risiko,
          pemilik_risiko
        ) VALUES (?, ?, ?, ?)`,
        [m.kategori_risiko, m.jenis_risiko, m.skenario_risiko, pemilik_risiko || null]
      );
      return result.insertId;
    },
  };
};

export default createRisksRepository;
