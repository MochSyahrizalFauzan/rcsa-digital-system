import jwt from "jsonwebtoken";

const JWT_SECRET = "access_secret_key";

export const authenticateToken = (db) => async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    console.log("RAW COOKIE HEADER:", req.headers.cookie);
    console.log("PARSED COOKIES:", req.cookies);

    if (!token) {
      return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const [rows] = await db.execute(
      `SELECT u.id, u.user_id, u.name, u.email, u.unit_id, u.role_id, u.status
       FROM users u
       WHERE u.id = ? LIMIT 1`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const user = rows[0];

    if (user.status !== "active") {
      // catatan: clearCookie harus pakai option sama persis dengan saat set cookie
      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });
      return res.status(403).json({ message: "Akun Anda nonaktif. Akses ditolak." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("auth error:", err);
    return res.status(403).json({ message: "Token tidak valid atau kadaluarsa" });
  }
};
