import { AppError } from "../../middleware/error.js";

const createRcsaAssessmentService = (rcsaAssessmentRepository) => {
  return {
    /**
     * Get submitted assessments list
     */
    getSubmitted: async (unitId) => {
      return await rcsaAssessmentRepository.findSubmitted(unitId);
    },

    /**
     * Get draft assessments matrix for unit
     */
    getDrafts: async ({ unitId, excludeSubmitted, incompleteOnly }, userId) => {
      if (!unitId) {
        throw new AppError("Parameter unit_id wajib disertakan", 400);
      }
      return await rcsaAssessmentRepository.findDrafts({
        unitId,
        userId,
        excludeSubmitted,
        incompleteOnly,
      });
    },

    /**
     * Get assessment detail by ID
     */
    getById: async (id) => {
      const numericId = Number(id);
      if (!numericId) {
        throw new AppError("ID Assessment tidak valid", 400);
      }
      const assessment = await rcsaAssessmentRepository.findById(numericId);
      if (!assessment) {
        throw new AppError("Assessment tidak ditemukan", 404);
      }
      return assessment;
    },

    /**
     * Save (upsert) assessment draft
     */
    saveAssessment: async (data, userId) => {
      if (!data.rcsa_master_id || !data.unit_id) {
        throw new AppError("rcsa_master_id dan unit_id wajib disertakan", 400);
      }

      // 1. Verifikasi Master Published & Aktif untuk Unit
      const isMasterActive = await rcsaAssessmentRepository.assertMasterPublishedForUnit(
        data.rcsa_master_id,
        data.unit_id
      );
      if (!isMasterActive) {
        throw new AppError(
          "Master belum dipublish atau belum aktif untuk unit ini. Tidak boleh membuat draft assessment.",
          403
        );
      }

      const existing = await rcsaAssessmentRepository.findExistingByUserAndMaster(
        data.rcsa_master_id,
        data.unit_id,
        userId
      );

      // Jika draft sudah ada
      if (existing) {
        if (existing.status === "submitted") {
          throw new AppError("Assessment sudah submitted, tidak bisa membuat draft baru.", 400);
        }

        await rcsaAssessmentRepository.updateAssessment(existing.id, data);
        return { ...data, id: existing.id, status: "draft" };
      }

      // Jika belum ada, lakukan INSERT baru
      const newId = await rcsaAssessmentRepository.insertAssessment(data, userId);
      return { ...data, id: newId, status: "draft" };
    },

    /**
     * Update existing draft by assessment ID
     */
    updateDraft: async (id, data, userId) => {
      const numericId = Number(id);
      const existing = await rcsaAssessmentRepository.findById(numericId);

      if (!existing) {
        throw new AppError("Assessment tidak ditemukan", 404);
      }

      // Verifikasi kepemilikan
      if (existing.created_by !== userId) {
        throw new AppError("Forbidden: Anda bukan pemilik draft assessment ini", 403);
      }

      if (existing.status === "submitted") {
        throw new AppError("Assessment sudah submitted, tidak bisa diubah kembali", 400);
      }

      // Verifikasi master published
      const isMasterActive = await rcsaAssessmentRepository.assertMasterPublishedForUnit(
        existing.rcsa_master_id,
        existing.unit_id
      );
      if (!isMasterActive) {
        throw new AppError(
          "Master belum dipublish / belum aktif untuk unit ini. Draft tidak bisa diubah.",
          403
        );
      }

      await rcsaAssessmentRepository.updateAssessment(numericId, data);
      return { ...data, id: numericId, status: "draft" };
    },

    /**
     * Submit assessment for QA / Review
     */
    submitAssessment: async (id, userId) => {
      const numericId = Number(id);
      const existing = await rcsaAssessmentRepository.findById(numericId);

      if (!existing) {
        throw new AppError("Assessment tidak ditemukan", 404);
      }

      // Verifikasi kepemilikan
      if (existing.created_by !== userId) {
        throw new AppError("Forbidden: Anda bukan pemilik draft assessment ini", 403);
      }

      if (existing.status === "submitted") {
        throw new AppError("Assessment sudah berstatus submitted", 400);
      }

      // Verifikasi master aktif
      const isMasterActive = await rcsaAssessmentRepository.assertMasterPublishedForUnit(
        existing.rcsa_master_id,
        existing.unit_id
      );
      if (!isMasterActive) {
        throw new AppError(
          "Master belum dipublish / belum aktif untuk unit ini. Tidak boleh submit assessment.",
          403
        );
      }

      // Validasi kelengkapan form kertas kerja RCSA
      const missing = [];
      const reqText = (v) => v === null || v === undefined || String(v).trim() === "";
      const reqNum = (v) => v === null || v === undefined;

      if (reqText(existing.jenis_risiko)) missing.push("jenis_risiko");
      if (reqText(existing.penyebab_risiko)) missing.push("penyebab_risiko");
      if (reqNum(existing.dampak_inheren)) missing.push("dampak_inheren");
      if (reqNum(existing.frekuensi_inheren)) missing.push("frekuensi_inheren");
      if (reqText(existing.pengendalian)) missing.push("pengendalian");
      if (reqNum(existing.dampak_residual)) missing.push("dampak_residual");
      if (reqNum(existing.kemungkinan_residual)) missing.push("kemungkinan_residual");
      if (reqText(existing.action_plan)) missing.push("action_plan");
      if (reqText(existing.pic)) missing.push("pic");

      if (missing.length > 0) {
        throw new AppError("Data assessment belum lengkap, tidak dapat disubmit", 400, { missing });
      }

      await rcsaAssessmentRepository.updateStatus(numericId, "submitted");
      return { message: "Assessment berhasil di-submit" };
    },

    /**
     * Get review queue for approver / risk reviewer
     */
    getReviewQueue: async () => {
      return await rcsaAssessmentRepository.findReviewQueue();
    },

    /**
     * Submit review decision and note
     */
    reviewAssessment: async (assessmentId, { note, decision }, reviewerId) => {
      const numericId = Number(assessmentId);

      if (!note || !String(note).trim()) {
        throw new AppError("Catatan review (note) wajib diisi", 400);
      }
      if (!["approved", "rejected"].includes(decision)) {
        throw new AppError("Keputusan review (decision) tidak valid", 400);
      }

      const existing = await rcsaAssessmentRepository.findById(numericId);
      if (!existing) {
        throw new AppError("Assessment tidak ditemukan", 404);
      }
      if (existing.status !== "submitted") {
        throw new AppError("Hanya assessment berstatus 'submitted' yang dapat direview", 400);
      }

      const conn = await rcsaAssessmentRepository.getConnection();
      try {
        await conn.beginTransaction();

        await rcsaAssessmentRepository.insertReviewNote(
          {
            assessmentId: numericId,
            reviewerId,
            note: note.trim(),
            decision,
          },
          conn
        );

        await rcsaAssessmentRepository.updateStatus(numericId, "reviewed", conn);

        await conn.commit();
        return { success: true, message: "Review tersimpan" };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Get review notes history for an assessment
     */
    getReviewNotes: async (assessmentId) => {
      const numericId = Number(assessmentId);
      return await rcsaAssessmentRepository.findReviewNotesByAssessmentId(numericId);
    },

    /**
     * Get reviewed assessments history for Admin
     */
    getReviewedHistory: async () => {
      return await rcsaAssessmentRepository.findAllReviewed();
    },

    /**
     * Get report of reviewed assessments
     */
    getReportReviewed: async (unitId) => {
      return await rcsaAssessmentRepository.findReportReviewed(unitId);
    },

    /**
     * Get reviewed assessments for logged-in user archive
     */
    getMineReviewed: async (userId) => {
      return await rcsaAssessmentRepository.findMineReviewed(userId);
    },
  };
};

export default createRcsaAssessmentService;
