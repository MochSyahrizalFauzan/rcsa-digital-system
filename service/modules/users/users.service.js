import { AppError } from "../../middleware/error.js";
import { hashPassword } from "../../utils/password.js";

const createUsersService = (usersRepository) => {
  return {
    /**
     * Get all users with roles and permissions
     */
    getAllUsers: async () => {
      return await usersRepository.findAllUsers();
    },

    /**
     * Create a new user with hashed password
     */
    createUser: async (payload) => {
      const { user_id, name, email, password, unit_id, role_id, status } = payload;

      if (!user_id || !name || !password || !unit_id || !role_id) {
        throw new AppError("Data tidak lengkap (user_id, name, password, unit_id, role_id wajib diisi)", 400);
      }

      // Pastikan User ID belum digunakan
      const existing = await usersRepository.findUserByUserId(user_id);
      if (existing) {
        throw new AppError(`User ID '${user_id}' sudah terdaftar dalam sistem`, 400);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      const result = await usersRepository.createUser({
        user_id,
        name,
        email: email || null,
        password: hashedPassword,
        unit_id,
        role_id,
        status: status || "active",
      });

      return {
        id: result.insertId,
        message: "User berhasil ditambahkan",
      };
    },

    /**
     * Update user status (active/inactive) with safety rules
     */
    updateUserStatus: async (targetId, status, currentUserId) => {
      const numericTargetId = Number(targetId);
      const numericCurrentUserId = Number(currentUserId);

      if (!status || !["active", "inactive"].includes(status)) {
        throw new AppError("Status tidak valid. Gunakan 'active' atau 'inactive'.", 400);
      }

      // Aturan Keamanan 1: Tidak boleh menonaktifkan akun sendiri yang sedang login
      if (numericTargetId === numericCurrentUserId) {
        throw new AppError("Tidak bisa menonaktifkan akun sendiri saat sedang login.", 403);
      }

      // Ambil data user target untuk cek role
      const targetUser = await usersRepository.findUserByIdWithRole(numericTargetId);
      if (!targetUser) {
        throw new AppError("User tidak ditemukan", 404);
      }

      // Aturan Keamanan 2: Role Project Manager tidak boleh dinonaktifkan
      const protectedRoles = new Set(["Project Manager"]);
      if (protectedRoles.has(targetUser.role_name)) {
        throw new AppError("User dengan role Project Manager tidak boleh dinonaktifkan.", 403);
      }

      const result = await usersRepository.updateUserStatus(numericTargetId, status);
      if (result.affectedRows === 0) {
        throw new AppError("User tidak ditemukan atau status tidak berubah", 404);
      }

      return {
        id: numericTargetId,
        status,
        message: "Status user berhasil diperbarui",
      };
    },

    /**
     * Get all roles and permissions
     */
    getAllRoles: async () => {
      return await usersRepository.findAllRoles();
    },

    /**
     * Get permissions for a specific role
     */
    getRolePermissions: async (roleId) => {
      const numericRoleId = Number(roleId);
      if (!numericRoleId) {
        throw new AppError("Role ID tidak valid", 400);
      }
      return await usersRepository.findRolePermissions(numericRoleId);
    },

    /**
     * Get user login history (Audit Trail)
     */
    getUserLogins: async () => {
      return await usersRepository.findAllUserLogins();
    },

    /**
     * Get units list
     */
    getAllUnits: async (parentId) => {
      return await usersRepository.findAllUnits(parentId);
    },

    /**
     * Get single unit by ID
     */
    getUnitById: async (id) => {
      const numericId = Number(id);
      if (!numericId) {
        throw new AppError("Unit ID tidak valid", 400);
      }
      const unit = await usersRepository.findUnitById(numericId);
      if (!unit) {
        throw new AppError("Unit tidak ditemukan", 404);
      }
      return unit;
    },
  };
};

export default createUsersService;
