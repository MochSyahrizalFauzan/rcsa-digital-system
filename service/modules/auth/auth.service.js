import { AppError } from "../../middleware/error.js";
import { comparePassword } from "../../utils/password.js";
import { generateTokens, generateAccessToken, verifyRefreshToken } from "../../utils/jwt.js";

const createAuthService = (authRepository) => {
  return {
    /**
     * User Login Service
     */
    login: async ({ userId, password, ipAddress, userAgent }) => {
      if (!userId || !password) {
        throw new AppError("ID User dan Password wajib diisi", 400);
      }

      // 1. Cari user di database
      const user = await authRepository.findUserByUserId(userId);
      if (!user) {
        throw new AppError("ID User tidak ditemukan", 401);
      }

      // 2. Cek apakah status user aktif
      if (user.status !== "active") {
        await authRepository.recordUserLogin({
          userId: user.id,
          ipAddress,
          userAgent,
          success: false,
          roleName: user.role_name,
          unitName: user.unit_name,
        });
        throw new AppError("Akun Anda nonaktif. Hubungi Project Manager.", 403);
      }

      // 3. Verifikasi kecocokan password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        await authRepository.recordUserLogin({
          userId: user.id,
          ipAddress,
          userAgent,
          success: false,
          roleName: user.role_name,
          unitName: user.unit_name,
        });
        throw new AppError("Password salah", 401);
      }

      // 4. Ambil matriks hak akses (permissions)
      const permissions = await authRepository.findPermissionsByRoleId(user.role_id);

      // 5. Buat JWT tokens
      const tokenPayload = {
        id: user.id,
        user_id: user.user_id,
        role_id: user.role_id,
      };
      const tokens = generateTokens(tokenPayload);

      // 6. Catat audit trail login berhasil
      await authRepository.recordUserLogin({
        userId: user.id,
        ipAddress,
        userAgent,
        success: true,
        roleName: user.role_name,
        unitName: user.unit_name,
      });

      return {
        tokens,
        user: {
          id: user.id,
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name,
          unit_id: user.unit_id,
          unit_name: user.unit_name,
          status: user.status,
          permissions,
        },
      };
    },

    /**
     * Refresh Token Service
     */
    refreshAccessToken: async (refreshTokenString) => {
      if (!refreshTokenString) {
        throw new AppError("Refresh token tidak ada", 401);
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshTokenString);
      } catch (err) {
        throw new AppError("Refresh token tidak valid atau kadaluarsa", 403);
      }

      const user = await authRepository.findUserById(decoded.id);
      if (!user || user.status !== "active") {
        throw new AppError("User tidak ditemukan atau akun telah dinonaktifkan", 403);
      }

      const newAccessToken = generateAccessToken({
        id: user.id,
        user_id: user.user_id,
        role_id: user.role_id,
      });

      return { accessToken: newAccessToken };
    },

    /**
     * Logout Service
     */
    logout: async (userId) => {
      if (userId) {
        await authRepository.recordUserLogout(userId);
      }
      return { message: "Logout berhasil" };
    },

    /**
     * Get Current Active Session (ME)
     */
    getCurrentUser: async (userId) => {
      const user = await authRepository.findUserById(userId);
      if (!user) {
        throw new AppError("User tidak ditemukan", 404);
      }

      const permissions = await authRepository.findPermissionsByRoleId(user.role_id);

      return {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        unit_id: user.unit_id,
        unit_name: user.unit_name,
        status: user.status,
        permissions,
      };
    },

    /**
     * Get User Profile
     */
    getProfile: async (userId) => {
      const profile = await authRepository.findProfileById(userId);
      if (!profile) {
        throw new AppError("Profile not found", 404);
      }
      return profile;
    },
  };
};

export default createAuthService;
