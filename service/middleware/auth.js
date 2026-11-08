import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import authConfig from "../config/auth.config.js";

/**
 * Authentication Middleware Factory
 * Compatible with `authenticateToken(db)` in server.js and standalone in modular server
 * @param {object} [dbInstance] - Optional mysql2 connection or pool
 */
export const authenticateToken = (dbInstance) => {
  const db = dbInstance || pool;

  return async (req, res, next) => {
    try {
      // 1. Ekstrak token dari Cookie HttpOnly atau Header Authorization Bearer
      const token =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.slice(7)
          : null);

      if (!token) {
        return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
      }

      // 2. Verifikasi Token
      const decoded = jwt.verify(token, authConfig.jwt.accessSecret);

      // 3. Ambil data user aktif dari database
      const [rows] = await db.execute(
        `SELECT u.id, u.user_id, u.name, u.email, u.unit_id, u.role_id, u.status
         FROM users u
         WHERE u.id = ? LIMIT 1`,
        [decoded.id]
      );

      if (!rows || rows.length === 0) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }

      const user = rows[0];

      // 4. Validasi status akun (harus active)
      if (user.status !== "active") {
        res.clearCookie("accessToken", { path: "/" });
        res.clearCookie("refreshToken", { path: "/" });
        return res.status(403).json({ message: "Akun Anda nonaktif. Akses ditolak." });
      }

      // 5. Lampirkan user ke request object
      req.user = user;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token kadaluarsa, silakan refresh token" });
      }
      return res.status(403).json({ message: "Token tidak valid atau kadaluarsa" });
    }
  };
};

export default authenticateToken;
