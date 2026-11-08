import { AppError } from "../../middleware/error.js";

const createRisksService = (risksRepository) => {
  return {
    getAllRisks: async () => {
      return await risksRepository.findAll();
    },

    getRiskById: async (id) => {
      const numericId = Number(id);
      const risk = await risksRepository.findById(numericId);
      if (!risk) {
        throw new AppError("Data risiko tidak ditemukan", 404);
      }
      return risk;
    },

    createRisk: async (data) => {
      const id = await risksRepository.create(data);
      return { id, ...data };
    },

    updateRisk: async (id, data) => {
      const numericId = Number(id);
      const existing = await risksRepository.findById(numericId);
      if (!existing) {
        throw new AppError("Data risiko tidak ditemukan", 404);
      }
      await risksRepository.update(numericId, data);
      return { id: numericId, ...data };
    },

    deleteRisk: async (id) => {
      const numericId = Number(id);
      const existing = await risksRepository.findById(numericId);
      if (!existing) {
        throw new AppError("Data risiko tidak ditemukan", 404);
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

    generateRiskForUnit: async (masterId, targetUnitId, pemilikRisiko) => {
      if (!masterId) {
        throw new AppError("master_id wajib disertakan", 400);
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
