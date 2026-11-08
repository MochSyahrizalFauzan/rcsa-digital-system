import { AppError } from "../../middleware/error.js";

const createRisksService = (risksRepository) => {
  return {
    getAllRisks: async (user, permissions) => {
      return await risksRepository.findAll({
        userId: user.id,
        unitId: user.unit_id,
        includeAll: permissions?.can_approve || permissions?.can_provision,
      });
    },

    getRiskById: async (id, user, permissions) => {
      const numericId = Number(id);
      const risk = await risksRepository.findById(numericId);
      if (!risk) {
        throw new AppError("Data risiko tidak ditemukan", 404);
      }
      if (
        !permissions?.can_provision &&
        risk.pemilik_risiko !== user.id &&
        Number(risk.owner_unit_id) !== Number(user.unit_id)
      ) {
        throw new AppError("Forbidden: risiko berada di luar unit Anda", 403);
      }
      return risk;
    },

    createRisk: async (data, user, permissions) => {
      const payload = { ...data };
      if (!permissions?.can_provision) {
        if (payload.pemilik_risiko && Number(payload.pemilik_risiko) !== Number(user.id)) {
          throw new AppError("Forbidden: risiko hanya dapat dibuat untuk user Anda sendiri", 403);
        }
        payload.pemilik_risiko = user.id;
      }
      const id = await risksRepository.create(payload);
      return { id, ...payload };
    },

    updateRisk: async (id, data, user, permissions) => {
      const numericId = Number(id);
      const existing = await risksRepository.findById(numericId);
      if (!existing) {
        throw new AppError("Data risiko tidak ditemukan", 404);
      }
      if (
        !permissions?.can_provision &&
        existing.pemilik_risiko !== user.id &&
        Number(existing.owner_unit_id) !== Number(user.unit_id)
      ) {
        throw new AppError("Forbidden: risiko berada di luar unit Anda", 403);
      }
      const payload = permissions?.can_provision ? data : { ...data, pemilik_risiko: existing.pemilik_risiko };
      await risksRepository.update(numericId, payload);
      return { id: numericId, ...payload };
    },

    deleteRisk: async (id, user, permissions) => {
      const numericId = Number(id);
      const existing = await risksRepository.findById(numericId);
      if (!existing) {
        throw new AppError("Data risiko tidak ditemukan", 404);
      }
      if (
        !permissions?.can_provision &&
        existing.pemilik_risiko !== user.id &&
        Number(existing.owner_unit_id) !== Number(user.unit_id)
      ) {
        throw new AppError("Forbidden: risiko berada di luar unit Anda", 403);
      }
      await risksRepository.delete(numericId);
      return { message: "Risk deleted" };
    },

    getRiskMasters: async () => {
      return await risksRepository.findMasters();
    },

    createRiskMaster: async (data, userId) => {
      if (!data.kategori_risiko) {
        throw new AppError("kategori_risiko wajib diisi", 400);
      }
      const id = await risksRepository.createMaster({ ...data, userId });
      return { id, message: "Master risk created" };
    },

    generateRiskForUnit: async (masterId, targetUnitId, pemilikRisiko, user, permissions) => {
      if (!masterId) {
        throw new AppError("master_id wajib disertakan", 400);
      }
      if (!permissions?.can_provision && Number(targetUnitId) !== Number(user.unit_id)) {
        throw new AppError("Forbidden: risiko hanya dapat digenerate untuk unit Anda", 403);
      }
      const id = await risksRepository.generateRisk(masterId, pemilikRisiko);
      if (!id) {
        throw new AppError("Master tidak ditemukan", 404);
      }
      return { id, message: "Generated risk for unit" };
    },
  };
};

export default createRisksService;
