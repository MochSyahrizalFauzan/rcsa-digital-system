import { AppError } from "../../middleware/error.js";

const createRcsaMasterService = (rcsaMasterRepository) => {
  return {
    /**
     * List all master risks with summary and status
     */
    getMasterList: async () => {
      return await rcsaMasterRepository.findAllWithSummary();
    },

    /**
     * Get detail of a master (info, target units, used by units)
     */
    getMasterDetail: async (id) => {
      const numericId = Number(id);
      if (!numericId) {
        throw new AppError("ID Master tidak valid", 400);
      }

      const master = await rcsaMasterRepository.findById(numericId);
      const targetUnits = await rcsaMasterRepository.findTargetUnitsByMasterId(numericId);
      const usedByUnits = await rcsaMasterRepository.findUsedByUnitsByMasterId(numericId);

      return {
        master,
        targetUnits,
        usedByUnits,
      };
    },

    /**
     * Create new master risk with target units
     */
    createMaster: async ({ rcsa_name, description, unit_ids }, userId) => {
      if (!rcsa_name || !String(rcsa_name).trim()) {
        throw new AppError("Nama RCSA (rcsa_name) wajib diisi", 400);
      }
      if (!Array.isArray(unit_ids) || unit_ids.length === 0) {
        throw new AppError("Unit target (unit_ids) wajib dipilih minimal 1 unit", 400);
      }

      const conn = await rcsaMasterRepository.getConnection();
      try {
        await conn.beginTransaction();

        const masterId = await rcsaMasterRepository.createMaster(
          {
            rcsa_name: rcsa_name.trim(),
            description: description ? description.trim() : null,
            created_by: userId,
          },
          conn
        );

        await rcsaMasterRepository.assignUnits(masterId, unit_ids, 0, conn);

        await conn.commit();
        return { id: masterId, status: "draft" };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Update master info (only when draft)
     */
    updateMaster: async (id, { rcsa_name, description }) => {
      const numericId = Number(id);
      const master = await rcsaMasterRepository.findById(numericId);
      if (!master) {
        throw new AppError("Master tidak ditemukan", 404);
      }
      if (master.status !== "draft") {
        throw new AppError("Hanya master berstatus draft yang boleh diubah", 400);
      }

      await rcsaMasterRepository.updateMaster(numericId, {
        rcsa_name: rcsa_name ? rcsa_name.trim() : master.rcsa_name,
        description: description !== undefined ? description : master.description,
      });

      return { message: "Master berhasil diperbarui" };
    },

    /**
     * Delete master risk (only draft and not yet used in assessments)
     */
    deleteMaster: async (id) => {
      const numericId = Number(id);
      const master = await rcsaMasterRepository.findById(numericId);
      if (!master) {
        throw new AppError("Master tidak ditemukan", 404);
      }
      if (master.status !== "draft") {
        throw new AppError("Hanya master berstatus draft yang boleh dihapus", 400);
      }

      const assessmentCount = await rcsaMasterRepository.countAssessmentsByMasterId(numericId);
      if (assessmentCount > 0) {
        throw new AppError(
          "Master sudah dipakai assessment. Tidak boleh delete. Silakan gunakan fitur arsip (archive).",
          400
        );
      }

      const conn = await rcsaMasterRepository.getConnection();
      try {
        await conn.beginTransaction();
        await rcsaMasterRepository.deleteMasterWithUnits(numericId, conn);
        await conn.commit();
        return { message: "Master RCSA berhasil dihapus" };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Assign / update target units for master (draft only)
     */
    assignUnits: async (id, unitIds) => {
      const numericId = Number(id);
      if (!Array.isArray(unitIds) || unitIds.length === 0) {
        throw new AppError("unit_ids wajib berupa array dan minimal 1 unit", 400);
      }

      const master = await rcsaMasterRepository.findById(numericId);
      if (!master) {
        throw new AppError("Master tidak ditemukan", 404);
      }
      if (master.status !== "draft") {
        throw new AppError("Assign unit hanya boleh saat status draft", 400);
      }

      const conn = await rcsaMasterRepository.getConnection();
      try {
        await conn.beginTransaction();
        await rcsaMasterRepository.assignUnits(numericId, unitIds, 0, conn);
        await conn.commit();
        return { message: "Unit target berhasil diperbarui", unit_ids: unitIds };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Archive master (deactivates units)
     */
    archiveMaster: async (id) => {
      const numericId = Number(id);
      const master = await rcsaMasterRepository.findById(numericId);
      if (!master) {
        throw new AppError("Master tidak ditemukan", 404);
      }

      const conn = await rcsaMasterRepository.getConnection();
      try {
        await conn.beginTransaction();
        await rcsaMasterRepository.archiveMaster(numericId, conn);
        await conn.commit();
        return { message: "Master berhasil di-archive" };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Submit master for Maker-Checker approval
     */
    submitForApproval: async (id, userId) => {
      const numericId = Number(id);
      const master = await rcsaMasterRepository.findById(numericId);
      if (!master) {
        throw new AppError("Master tidak ditemukan", 404);
      }
      if (!["draft", "rejected"].includes(master.status)) {
        throw new AppError("Master harus berstatus draft atau rejected untuk diajukan kembali", 400);
      }

      const targetUnitsCount = await rcsaMasterRepository.countTargetUnitsByMasterId(numericId);
      if (targetUnitsCount === 0) {
        throw new AppError("Unit target belum dipilih", 400);
      }

      const conn = await rcsaMasterRepository.getConnection();
      try {
        await conn.beginTransaction();
        await rcsaMasterRepository.submitForApproval(numericId, userId, conn);
        await conn.commit();
        return {
          message: "Master diajukan untuk persetujuan (Approver: siapa pun yang punya can_approve)",
        };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Get inbox for pending approvals
     */
    getApprovalInbox: async () => {
      return await rcsaMasterRepository.findApprovalInbox();
    },

    /**
     * Approve or reject a master (Dual-Control Decision)
     */
    decideApproval: async (id, { decision, note }, reviewerId) => {
      const numericId = Number(id);
      if (!["approved", "rejected"].includes(decision)) {
        throw new AppError("Keputusan (decision) tidak valid. Pilih 'approved' atau 'rejected'", 400);
      }
      if (!note || !String(note).trim()) {
        throw new AppError("Catatan (note) wajib diisi untuk setiap keputusan review", 400);
      }

      const conn = await rcsaMasterRepository.getConnection();
      try {
        await conn.beginTransaction();

        const pendingStep = await rcsaMasterRepository.findPendingApprovalStep(numericId, conn);
        if (!pendingStep) {
          throw new AppError("Tidak ada tahapan approval yang berstatus pending untuk master ini", 400);
        }

        // Concurrency lock / claim approver
        if (!pendingStep.approver_user_id) {
          const claimed = await rcsaMasterRepository.claimApprovalStep(pendingStep.id, reviewerId, conn);
          if (!claimed) {
            throw new AppError("Approval sudah diambil oleh approver lain secara bersamaan", 409);
          }
        } else if (pendingStep.approver_user_id !== reviewerId) {
          throw new AppError("Approval ini sedang diproses oleh approver lain", 403);
        }

        await rcsaMasterRepository.recordApprovalDecision(
          {
            approvalId: pendingStep.id,
            masterId: numericId,
            decision,
            note: note.trim(),
            reviewerId,
          },
          conn
        );

        await conn.commit();

        return {
          message:
            decision === "approved"
              ? "Master disetujui (approved), siap dipublish"
              : "Master ditolak (rejected)",
        };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Publish master risk to activate units
     */
    publishMaster: async (id) => {
      const numericId = Number(id);
      const master = await rcsaMasterRepository.findById(numericId);
      if (!master) {
        throw new AppError("Master tidak ditemukan", 404);
      }
      if (master.status !== "approved") {
        throw new AppError("Master harus berstatus approved sebelum dipublish", 400);
      }

      const conn = await rcsaMasterRepository.getConnection();
      try {
        await conn.beginTransaction();
        await rcsaMasterRepository.publishMaster(numericId, conn);
        await conn.commit();
        return { message: "Master berhasil dipublish ke semua unit target" };
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    },

    /**
     * Get active published masters for logged-in user unit
     */
    getActiveForUserUnit: async (unitId) => {
      if (!unitId) {
        throw new AppError("Pengguna belum terafiliasi dengan unit kerja manapun", 400);
      }
      return await rcsaMasterRepository.findActiveByUnitId(unitId);
    },

    /**
     * Get master risks filtered by unit
     */
    getByUnitId: async (unitId) => {
      const numericUnitId = Number(unitId);
      return await rcsaMasterRepository.findByUnitId(numericUnitId);
    },
  };
};

export default createRcsaMasterService;
